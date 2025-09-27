from utils import call_gemini_api

def parallel_discussion(selected_idea, papers_context):
    """
    Run parallel evaluation with researcher and peer reviewer agents
    """
    
    # Prepare context
    idea_title = selected_idea.get('title', 'Unknown')
    idea_description = selected_idea.get('description', '')
    
    # Truncate papers context to avoid token limits
    if isinstance(papers_context, list):
        truncated_context = "\n".join(papers_context)[:3000]
    else:
        truncated_context = str(papers_context)[:3000]
    
    print(f"Evaluating idea: {idea_title}")
    
    # Researcher analysis (positive/supportive perspective)
    researcher_prompt = f"""
You are an enthusiastic research scientist evaluating a proposed research idea. Your role is to provide a supportive analysis highlighting the potential, novelty, and feasibility of this research.

RESEARCH IDEA TO EVALUATE:
Title: {idea_title}

Full Description:
{idea_description}

RELEVANT RESEARCH CONTEXT:
{truncated_context}

Provide a detailed analysis covering:
1. **Novelty Assessment**: How novel/original is this research direction?
2. **Technical Feasibility**: Can this be realistically implemented with current resources?
3. **Potential Impact**: What significant contributions could this make to the field?
4. **Research Opportunities**: What exciting possibilities does this open up?
5. **Methodological Strengths**: What aspects of the proposed methodology are particularly strong?

Write 3-4 paragraphs focusing on the positive aspects and potential of this research idea.
"""

    # Peer reviewer analysis (critical perspective)
    reviewer_prompt = f"""
You are a critical peer reviewer evaluating a proposed research idea. Your role is to identify potential weaknesses, challenges, and risks that could affect the success and publishability of this research.

RESEARCH IDEA TO EVALUATE:
Title: {idea_title}

Full Description:
{idea_description}

RELEVANT RESEARCH CONTEXT:
{truncated_context}

Provide a critical analysis covering:
1. **Potential Challenges**: What technical/methodological difficulties might arise?
2. **Limitations**: What are the potential limitations of the proposed approach?
3. **Resource Requirements**: What significant resources (computational, data, time) would be needed?
4. **Risk Assessment**: What could go wrong or lead to negative results?
5. **Competition/Prior Work**: Are there similar efforts that might diminish novelty?
6. **Publication Concerns**: What might prevent this from being accepted at top venues?

Write 3-4 paragraphs focusing on realistic challenges and potential issues with this research idea.
"""

    print("Running researcher analysis...")
    researcher_analysis = call_gemini_api(researcher_prompt)
    
    print("Running peer reviewer analysis...")
    reviewer_analysis = call_gemini_api(reviewer_prompt)
    
    # Final synthesis
    synthesis_prompt = f"""
You are a senior research advisor synthesizing feedback from two perspectives on a research proposal.

RESEARCH IDEA:
{idea_title}
{idea_description}

RESEARCHER'S POSITIVE ANALYSIS:
{researcher_analysis}

PEER REVIEWER'S CRITICAL ANALYSIS:
{reviewer_analysis}

Based on both analyses, provide:

1. **Overall Assessment Score** (0-100%): What is the likelihood this research will be novel, useful, and publishable at a top-tier venue?

2. **Key Strengths** (2-3 points from researcher analysis)

3. **Major Concerns** (2-3 points from reviewer analysis)

4. **Recommendation**: 
   - PROCEED: Strong potential, manageable risks
   - PROCEED WITH CAUTION: Good potential but significant challenges
   - MAJOR REVISION NEEDED: Interesting but requires substantial changes
   - DO NOT PROCEED: Too risky or limited potential

5. **Action Items**: 3-4 specific steps to improve this research proposal

Format your response clearly with these sections. Be balanced but decisive in your assessment.
"""

    print("Synthesizing final evaluation...")
    final_evaluation = call_gemini_api(synthesis_prompt)
    
    return final_evaluation