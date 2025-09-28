# PeerLens

PeerLens is for researchers who want to accelerate their literature review process and identify promising research opportunities. Our AI-powered tool uses Google ADK and Gemini API to analyze 4-5 uploaded research papers, automatically generating specific research gap ideas and evaluating their publication potential through an intelligent assessment system. The platform provides researchers with a publication probability score and detailed justification for each proposed idea, transforming hours of manual literature analysis into actionable, publication-ready research concepts.

## Tech Stack

### Backend
- Python  
- Google ADK  
- Gemini API  

### Frontend
- React.js  
- Auth0 Authentication  
- React Router  
- Modern UI components  

## Backend Setup
```
pip install -r requirements.txt
```

## Frontend Setup
```
cd frontend
npm install
```

## Configuration
Update a `.env` file with the following variables:

```
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key

# Auth0 Configuration (Frontend)
REACT_APP_AUTH0_DOMAIN=your_auth0_domain
REACT_APP_AUTH0_CLIENT_ID=your_client_id
```

## Running the Application
```
cd frontend
npm start
```

## Using PeerLens
1. **Upload Papers**: Upload 4-5 research papers in PDF or text format  
2. **Generate Ideas**: The system analyzes papers and generates research gap opportunities  
3. **Select Idea**: Choose from the generated ideas list  
4. **Evaluation**: Parallel agents debate and evaluate your selected idea  
5. **Get Results**: Receive publication probability score with detailed analysis  

## How it works

<img width="579" height="199" alt="image" src="https://github.com/user-attachments/assets/436c2ab2-145b-43ab-b02b-119664748820" />


## Use Cases
- **Academic Researchers**: Identify gaps in current literature  
- **Graduate Students**: Find thesis/dissertation topics  
- **Research Teams**: Evaluate project viability before funding applications  
- **Publication Planning**: Assess publication potential before starting research  
```
