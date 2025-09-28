# from utils import call_gemini_api

# def parallel_discussion(selected_idea, papers_context):
#     """
#     Run parallel evaluation with researcher and peer reviewer agents
#     """
    
#     # Prepare context
#     idea_title = selected_idea.get('title', 'Unknown')
#     idea_description = selected_idea.get('description', '')
    
#     # Truncate papers context to avoid token limits
#     if isinstance(papers_context, list):
#         truncated_context = "\n".join(papers_context)[:3000]
#     else:
#         truncated_context = str(papers_context)[:3000]
    
#     print(f"Evaluating idea: {idea_title}")
    
#     # Researcher analysis (positive/supportive perspective)
#     researcher_prompt = f"""
# You are an enthusiastic research scientist evaluating a proposed research idea. Your role is to provide a supportive analysis highlighting the potential, novelty, and feasibility of this research.

# RESEARCH IDEA TO EVALUATE:
# Title: {idea_title}

# Full Description:
# {idea_description}

# RELEVANT RESEARCH CONTEXT:
# {truncated_context}

# Provide a detailed analysis covering:
# 1. **Novelty Assessment**: How novel/original is this research direction?
# 2. **Technical Feasibility**: Can this be realistically implemented with current resources?
# 3. **Potential Impact**: What significant contributions could this make to the field?
# 4. **Research Opportunities**: What exciting possibilities does this open up?
# 5. **Methodological Strengths**: What aspects of the proposed methodology are particularly strong?

# Write 3-4 paragraphs focusing on the positive aspects and potential of this research idea.
# """

#     # Peer reviewer analysis (critical perspective)
#     reviewer_prompt = f"""
# You are a critical peer reviewer evaluating a proposed research idea. Your role is to identify potential weaknesses, challenges, and risks that could affect the success and publishability of this research.

# RESEARCH IDEA TO EVALUATE:
# Title: {idea_title}

# Full Description:
# {idea_description}

# RELEVANT RESEARCH CONTEXT:
# {truncated_context}

# Provide a critical analysis covering:
# 1. **Potential Challenges**: What technical/methodological difficulties might arise?
# 2. **Limitations**: What are the potential limitations of the proposed approach?
# 3. **Resource Requirements**: What significant resources (computational, data, time) would be needed?
# 4. **Risk Assessment**: What could go wrong or lead to negative results?
# 5. **Competition/Prior Work**: Are there similar efforts that might diminish novelty?
# 6. **Publication Concerns**: What might prevent this from being accepted at top venues?

# Write 3-4 paragraphs focusing on realistic challenges and potential issues with this research idea.
# """

#     print("Running researcher analysis...")
#     researcher_analysis = call_gemini_api(researcher_prompt)
    
#     print("Running peer reviewer analysis...")
#     reviewer_analysis = call_gemini_api(reviewer_prompt)
    
#     # Final synthesis
#     synthesis_prompt = f"""
# You are a senior research advisor synthesizing feedback from two perspectives on a research proposal.

# RESEARCH IDEA:
# {idea_title}
# {idea_description}

# RESEARCHER'S POSITIVE ANALYSIS:
# {researcher_analysis}

# PEER REVIEWER'S CRITICAL ANALYSIS:
# {reviewer_analysis}

# Based on both analyses, provide:

# 1. **Overall Assessment Score** (0-100%): What is the likelihood this research will be novel, useful, and publishable at a top-tier venue?

# 2. **Key Strengths** (2-3 points from researcher analysis)

# 3. **Major Concerns** (2-3 points from reviewer analysis)

# 4. **Recommendation**: 
#    - PROCEED: Strong potential, manageable risks
#    - PROCEED WITH CAUTION: Good potential but significant challenges
#    - MAJOR REVISION NEEDED: Interesting but requires substantial changes
#    - DO NOT PROCEED: Too risky or limited potential

# 5. **Action Items**: 3-4 specific steps to improve this research proposal

# Format your response clearly with these sections. Be balanced but decisive in your assessment.
# """

#     print("Synthesizing final evaluation...")
#     final_evaluation = call_gemini_api(synthesis_prompt)
    
#     return final_evaluation

# parallel_agents.py
import os, uuid, asyncio
from utils import call_gemini_api  # your existing direct HTTP fallback

ADK_AVAILABLE = False
try:
    from google.adk.agents import LlmAgent, ParallelAgent, SequentialAgent
    from google.adk.runners import Runner
    from google.adk.sessions import InMemorySessionService
    from google.genai import types  # Content/Part for messages
    ADK_AVAILABLE = True
except Exception as e:
    print(f"ADK not available: {e}")
    print("Install with: pip install google-adk google-genai")

MODEL_ID = os.getenv("ADK_MODEL_ID", "gemini-2.0-flash")  # valid example id from docs

def _idea_to_text(idea):
    if isinstance(idea, dict):
        return (
            f"TITLE: {idea.get('title','')}\n\n"
            f"PROBLEM: {idea.get('problem','')}\n\n"
            f"METHODOLOGY: {idea.get('methodology','')}\n\n"
            f"CONTRIBUTION: {idea.get('contribution','')}"
        )
    return str(idea)

async def _adk_run(idea_text: str, context_text: str):
    # Agents write to state keys via output_key
    researcher = LlmAgent(
        name="researcher",
        model=MODEL_ID,
        instruction=(
            "You are an enthusiastic research scientist. Use {idea} and optional {context?} "
            "to write 3–4 paragraphs focusing on novelty, feasibility, impact, opportunities, strengths."
        ),
        output_key="researcher_output",
    )

    reviewer = LlmAgent(
        name="reviewer",
        model=MODEL_ID,
        instruction=(
            "You are a critical peer reviewer. Use {idea} and optional {context?} "
            "to write 3–4 paragraphs focusing on challenges, limitations, resources, risks, prior work, publication concerns."
        ),
        output_key="reviewer_output",
    )

    synthesizer = LlmAgent(
        name="synthesizer",
        model=MODEL_ID,
        instruction=(
            "Synthesize the two perspectives.\n"
            "RESEARCHER:\n{researcher_output}\n\nREVIEWER:\n{reviewer_output}\n\n"
            "Return sections:\n"
            "1) Overall Assessment Score (0-100%)\n"
            "2) Key Strengths\n"
            "3) Major Concerns\n"
            "4) Recommendation\n"
            "5) Action Items"
        ),
        output_key="final_eval",
    )

    pipeline = SequentialAgent(
        name="discussion_pipeline",
        sub_agents=[ParallelAgent(name="parallel", sub_agents=[researcher, reviewer]), synthesizer],
    )

    session_service = InMemorySessionService()
    runner = Runner(agent=pipeline, app_name="peerlens", session_service=session_service)

    session = await session_service.create_session(
        app_name="peerlens",
        user_id="local",
        session_id=str(uuid.uuid4()),
        state={"idea": idea_text, "context": context_text},
    )

    # kick the run (a tiny "start" message)
    for _ in runner.run(
        user_id="local",
        session_id=session.session_id,
        new_message=types.Content(parts=[types.Part(text="start")]),
    ):
        pass

    updated = await session_service.get_session(
        app_name="peerlens", user_id="local", session_id=session.session_id
    )
    return updated.state.get("final_eval", "")

def fallback_parallel_discussion(idea, papers_text=None):
    idea_text = _idea_to_text(idea)
    context = ""
    if papers_text:
        # papers_text may be list or str
        ctx = papers_text if isinstance(papers_text, str) else "\n".join(papers_text)
        context = f"\n\nRELEVANT PAPERS CONTEXT:\n{ctx[:2000]}..."

    researcher_prompt = (
        f"As a researcher, evaluate this research idea:\n{idea_text}{context}\n"
        f"Give reasons why this idea is novel and useful."
    )
    reviewer_prompt = (
        f"As a peer reviewer, critically analyze this research idea:\n{idea_text}{context}\n"
        f"List weaknesses or challenges."
    )
    researcher_output = call_gemini_api(researcher_prompt)
    reviewer_output = call_gemini_api(reviewer_prompt)

    synthesis_prompt = (
        f"Given the researcher's positive analysis:\n{researcher_output}\n\n"
        f"And peer reviewer's critique:\n{reviewer_output}\n\n"
        f"For the research idea: {idea_text}\n\n"
        "Estimate likelihood (0-100%) that this idea will be novel/useful/publishable, and provide final arguments "
        "with sections: Overall Assessment Score, Key Strengths, Major Concerns, Recommendation, Action Items."
    )
    return call_gemini_api(synthesis_prompt)

def parallel_discussion(idea, papers_text=None):
    idea_text = _idea_to_text(idea)
    context_text = ""
    if papers_text:
        ctx = papers_text if isinstance(papers_text, str) else "\n".join(papers_text)
        context_text = ctx[:3000]

    if ADK_AVAILABLE:
        try:
            return asyncio.run(_adk_run(idea_text, context_text))
        except Exception as e:
            print(f"ADK execution failed, using fallback. Reason: {e}")

    return fallback_parallel_discussion(idea, papers_text)
