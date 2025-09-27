import re
from utils import call_gemini_api

def generate_research_ideas(papers_texts):
    combined_text = "\n\n".join(papers_texts)
    
    prompt = f"""
Based on these research papers, generate exactly 5 specific research gap ideas. 

For each idea, use this EXACT format:

IDEA 1:
TITLE: [Clear research title here]
PROBLEM: [What research gap or problem this addresses]
METHODOLOGY: [Specific approach, experiments, or improvements proposed]
CONTRIBUTION: [Expected outcomes and significance]

IDEA 2:
TITLE: [Clear research title here]
PROBLEM: [What research gap or problem this addresses]
METHODOLOGY: [Specific approach, experiments, or improvements proposed]
CONTRIBUTION: [Expected outcomes and significance]

[Continue for IDEA 3, IDEA 4, and IDEA 5]

Research Papers Content:
{combined_text}

Generate the 5 research ideas now using the exact format above:
"""
    
    ideas = call_gemini_api(prompt)
    return ideas

def parse_ideas(ideas_text):
    """Parse the generated ideas into structured format"""
    ideas = []
    
    # Split by IDEA markers
    idea_sections = re.split(r'IDEA\s+\d+:', ideas_text, flags=re.IGNORECASE)
    
    # Remove the first empty section (before first IDEA)
    if idea_sections:
        idea_sections = idea_sections[1:]  
    
    for i, section in enumerate(idea_sections):
        section = section.strip()
        if not section:
            continue
        
        # Extract components using regex
        title_match = re.search(r'TITLE:\s*(.+?)(?=\n|PROBLEM:|$)', section, re.IGNORECASE | re.DOTALL)
        problem_match = re.search(r'PROBLEM:\s*(.+?)(?=\n.*?METHODOLOGY:|$)', section, re.IGNORECASE | re.DOTALL)
        methodology_match = re.search(r'METHODOLOGY:\s*(.+?)(?=\n.*?CONTRIBUTION:|$)', section, re.IGNORECASE | re.DOTALL)
        contribution_match = re.search(r'CONTRIBUTION:\s*(.+?)$', section, re.IGNORECASE | re.DOTALL)
        
        title = title_match.group(1).strip() if title_match else f"Research Idea {i+1}"
        problem = problem_match.group(1).strip() if problem_match else "Problem not specified"
        methodology = methodology_match.group(1).strip() if methodology_match else "Methodology not specified"
        contribution = contribution_match.group(1).strip() if contribution_match else "Contribution not specified"
        
        # Clean up the extracted text
        title = re.sub(r'\n+', ' ', title).strip()
        problem = re.sub(r'\n+', ' ', problem).strip()
        methodology = re.sub(r'\n+', ' ', methodology).strip()
        contribution = re.sub(r'\n+', ' ', contribution).strip()
        
        ideas.append({
            'title': title,
            'problem': problem,
            'methodology': methodology,
            'contribution': contribution,
            'description': f"Problem: {problem}\nMethodology: {methodology}\nContribution: {contribution}"
        })
    
    # Fallback parsing if the structured format didn't work
    if len(ideas) < 2:
        print("Primary parsing failed, trying fallback method...")
        ideas = fallback_parse_ideas(ideas_text)
    
    return ideas[:5]  # Return max 5 ideas

def fallback_parse_ideas(ideas_text):
    """Fallback method to extract ideas from any format"""
    ideas = []
    
    # Try to find numbered items or titles marked with ** or similar
    patterns = [
        r'\n\s*\d+\.\s*\*\*(.+?)\*\*(.+?)(?=\n\s*\d+\.|$)',  # Numbered with ** title **
        r'\n\s*\d+\.\s*(.+?)(?=\n\s*\d+\.|$)',  # Simple numbered items
        r'\*\*(.+?)\*\*(.+?)(?=\*\*|$)',  # Items with ** markers
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, ideas_text, re.DOTALL)
        if len(matches) >= 2:  # Found at least 2 ideas
            for i, match in enumerate(matches[:5]):
                if len(match) == 2:
                    title, content = match
                else:
                    title = f"Research Idea {i+1}"
                    content = match[0] if match else "No content available"
                
                title = re.sub(r'\n+', ' ', title.strip())
                content = re.sub(r'\n+', ' ', content.strip())
                
                ideas.append({
                    'title': title,
                    'problem': "Extracted from content",
                    'methodology': "See full description",
                    'contribution': "See full description", 
                    'description': content
                })
            break
    
    # Last resort: split by paragraphs and take substantial ones
    if not ideas:
        paragraphs = [p.strip() for p in ideas_text.split('\n\n') if len(p.strip()) > 100]
        for i, paragraph in enumerate(paragraphs[:5]):
            # Try to extract a title from the first line
            lines = paragraph.split('\n')
            first_line = lines[0].strip()
            
            # Look for title patterns
            title_match = re.search(r'(?:Title:|^\d+\.|\*\*)?(.+?)(?:\*\*|:|\n|$)', first_line)
            title = title_match.group(1).strip() if title_match else f"Research Idea {i+1}"
            
            ideas.append({
                'title': title,
                'problem': "See full description",
                'methodology': "See full description", 
                'contribution': "See full description",
                'description': paragraph
            })
    
    return ideas