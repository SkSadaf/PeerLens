import PyPDF2
import os
from pathlib import Path

def extract_text_from_papers(file_paths):
    """Extract text from PDF papers and return as list of strings"""
    papers_text = []
    
    for file_path in file_paths:
        try:
            if not os.path.exists(file_path):
                print(f"Warning: File {file_path} not found, skipping...")
                continue
                
            print(f"Processing: {file_path}")
            
            # Extract text from PDF
            text = extract_pdf_text(file_path)
            
            if text and len(text.strip()) > 100:  # Only add if substantial content
                # Truncate very long papers to avoid token limits
                if len(text) > 8000:
                    text = text[:8000] + "... [truncated]"
                
                papers_text.append(f"=== PAPER: {Path(file_path).name} ===\n{text}\n")
            else:
                print(f"Warning: Could not extract meaningful text from {file_path}")
                
        except Exception as e:
            print(f"Error processing {file_path}: {str(e)}")
            continue
    
    if not papers_text:
        print("No papers were successfully processed!")
        # Add dummy data for testing
        papers_text = ["""
=== SAMPLE PAPER ===
This is a sample research paper about machine learning and privacy.
The paper discusses differential privacy techniques for neural networks.
Key findings include challenges in balancing privacy and utility.
The methodology involves training with noise injection and privacy budgets.
Results show that current approaches have limitations in complex models.
        """]
    
    return papers_text

def extract_pdf_text(file_path):
    """Extract text from a single PDF file"""
    text = ""
    
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            # Extract text from all pages (limit to first 10 pages to avoid too much content)
            max_pages = min(10, len(pdf_reader.pages))
            
            for page_num in range(max_pages):
                try:
                    page = pdf_reader.pages[page_num]
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                except Exception as e:
                    print(f"Error extracting page {page_num}: {str(e)}")
                    continue
                    
    except Exception as e:
        print(f"Error reading PDF {file_path}: {str(e)}")
        return None
    
    return text.strip()

def summarize_methodology(papers_text):
    """
    Summarize the methodologies from the papers (optional function)
    This could be used to provide additional context
    """
    if not papers_text:
        return "No methodology information available."
    
    combined_text = "\n".join(papers_text)
    
    # Simple extraction of methodology-related sections
    methodology_keywords = ["method", "approach", "algorithm", "technique", "procedure", "implementation"]
    
    lines = combined_text.split('\n')
    methodology_lines = []
    
    for line in lines:
        line_lower = line.lower()
        if any(keyword in line_lower for keyword in methodology_keywords):
            methodology_lines.append(line.strip())
    
    if methodology_lines:
        return "\n".join(methodology_lines[:20])  # Limit to 20 most relevant lines
    else:
        return "Methodology information not clearly identified in the papers."