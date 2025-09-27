from paper_processor import extract_text_from_papers, summarize_methodology
from idea_generator import generate_research_ideas, parse_ideas
from parallel_agents import parallel_discussion

def display_ideas_nicely(parsed_ideas):
    """Display ideas in a clean, numbered format"""
    print("\n" + "="*50)
    print("SELECT A RESEARCH IDEA:")
    print("="*50)
    
    for i, idea in enumerate(parsed_ideas, 1):
        print(f"\n{i}. TITLE: {idea['title']}")
        
        # Show a brief description (first 150 characters)
        if len(idea['description']) > 150:
            description = idea['description'][:150] + "..."
        else:
            description = idea['description']
        
        print(f"   DESCRIPTION: {description}")
        print("-" * 40)

def get_user_choice(max_choices):
    """Get valid user choice with error handling"""
    while True:
        try:
            choice = int(input(f"\nSelect an idea (1-{max_choices}): ")) - 1
            if 0 <= choice < max_choices:
                return choice
            else:
                print(f"Please enter a number between 1 and {max_choices}")
        except ValueError:
            print("Please enter a valid number")
        except KeyboardInterrupt:
            print("\nExiting...")
            exit()

def display_selected_idea(idea):
    """Display the full details of the selected idea"""
    print("\n" + "="*60)
    print("SELECTED RESEARCH IDEA - FULL DETAILS:")
    print("="*60)
    print(f"TITLE: {idea['title']}")
    print(f"\nPROBLEM: {idea['problem']}")
    print(f"\nMETHODOLOGY: {idea['methodology']}")  
    print(f"\nCONTRIBUTION: {idea['contribution']}")
    print("="*60)

def main():
    print("Enter paths to 4-5 PDF research papers separated by commas:")
    file_input = input()
    uploaded_files = [f.strip() for f in file_input.split(",")]
    
    # Extract and process papers
    papers_text = extract_text_from_papers(uploaded_files)

    # Generate focused ideas
    print("\n" + "="*50)
    print("GENERATING RESEARCH IDEAS...")
    print("="*50)
    
    ideas_raw = generate_research_ideas(papers_text)
    print("Raw AI Response:")
    print("-" * 30)
    print(ideas_raw)
    print("-" * 30)
    
    # Parse ideas into structured format
    parsed_ideas = parse_ideas(ideas_raw)
    
    if not parsed_ideas:
        print("❌ No valid research ideas were generated. Please try again.")
        return
    
    print(f"\n✅ Successfully parsed {len(parsed_ideas)} research ideas!")
    
    # Display ideas nicely
    display_ideas_nicely(parsed_ideas)
    
    # Get user choice
    choice = get_user_choice(len(parsed_ideas))
    selected_idea = parsed_ideas[choice]
    
    # Show full details of selected idea
    display_selected_idea(selected_idea)
    
    # Confirm before proceeding to evaluation
    proceed = input("\nProceed with evaluation of this idea? (y/n): ").lower().strip()
    if proceed != 'y' and proceed != 'yes':
        print("Evaluation cancelled.")
        return
    
    # Run parallel researcher-peer reviewer discussion
    print("\n" + "="*50)
    print("RUNNING PARALLEL EVALUATION...")
    print("="*50)
    
    final_output = parallel_discussion(selected_idea, papers_text)
    
    print("\n" + "="*50)
    print("FINAL EVALUATION RESULT:")
    print("="*50)
    print(final_output)

if __name__ == "__main__":
    main()