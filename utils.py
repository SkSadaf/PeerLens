import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

def call_gemini_api(prompt):
    # Check if API key is loaded
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not found. Please check your .env file.")
    
    headers = {
        "x-goog-api-key": GEMINI_API_KEY,
        "Content-Type": "application/json"
    }
    data = {
        "contents": [
            {"role": "user", "parts": [{"text": prompt}]}
        ]
    }
    response = requests.post(GEMINI_ENDPOINT, json=data, headers=headers)
    print("API response status:", response.status_code)
    
    # Handle the actual response structure
    json_resp = response.json()
    
    # Check for error first
    if response.status_code != 200:
        print(f"API Error: {json_resp}")
        raise ValueError(f"API request failed with status {response.status_code}: {json_resp}")
    
    # Handle the correct response structure with 'candidates'
    if 'candidates' in json_resp and len(json_resp['candidates']) > 0:
        candidate = json_resp['candidates'][0]
        if 'content' in candidate and 'parts' in candidate['content']:
            return candidate['content']['parts'][0]['text']
        else:
            raise ValueError(f"Unexpected candidate structure: {candidate}")
    # Fallback for old response structure (if it still exists)
    elif 'contents' in json_resp:
        return json_resp['contents'][0]['parts'][0]['text']
    else:
        raise ValueError(f"Unexpected response structure: {json_resp}")