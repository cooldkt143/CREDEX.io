import os
import json
import re
import requests
from dotenv import load_dotenv
from typing import Dict, Any, List
from .schemas import RoadmapResponse, RoadmapRequest

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
# Primary model is GPT-4o-mini as it is cost-effective, fast, and handles JSON responses well.
# Fallback is Gemini 2.5 Flash.
PRIMARY_MODEL = "openai/gpt-4o-mini"
FALLBACK_MODEL = "google/gemini-2.5-flash"

def sanitize_json_string(text: str) -> str:
    """Cleans up markdown code blocks or extra text to isolate the JSON string."""
    cleaned = text.strip()
    
    # Remove markdown code block wrappers if present
    cleaned = re.sub(r"^```(?:json)?", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"```$", "", cleaned, flags=re.IGNORECASE)
    cleaned = cleaned.strip()
    
    # Try to find the first '{' and last '}'
    start_idx = cleaned.find('{')
    end_idx = cleaned.rfind('}')
    
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        cleaned = cleaned[start_idx:end_idx + 1]
        
    return cleaned

def generate_roadmap_ai(request: RoadmapRequest) -> Dict[str, Any]:
    """
    Sends request to OpenRouter to analyze current skills & target role
    and returns a structured roadmap JSON with Month/Week details.
    """
    if not OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY is not defined in the environment or .env file.")

    current_skills_str = (
        ", ".join(request.current_skills) 
        if isinstance(request.current_skills, list) 
        else request.current_skills
    )

    prompt = f"""
You are an expert career advisor, senior software engineer, and technical curriculum designer.
Analyze the user's current skills and target role, and create a highly customized, accurate, sequential, and structured month-by-month and week-by-week learning roadmap that fits perfectly within the specified time limit.

User Inputs:
- Current Skills: {current_skills_str}
- Target Role: {request.target_role}
- Time Limit: {request.time_limit}

Tasks:
1. Identify and list the user's current skills that are relevant to the target role.
2. Identify the skill gaps that the user needs to bridge to achieve the target role.
3. Recommend realistic weekly hours of study.
4. Structure the timeline into logical months (e.g. Month 1, Month 2).
5. For each month, provide a theme-based Month Title (e.g. 'Foundations of Generative AI').
6. For each week in a month, provide:
   - Week Number (sequential across the whole roadmap, e.g. 1, 2, 3...)
   - Week Title (e.g., 'Python for AI Development')
   - A list of specific conceptual 'Topics' to learn (e.g., ['Advanced Python', 'OOP Concepts', 'Async Programming'])
   - A list of libraries, tools, or frameworks to 'Learn' (e.g., ['FastAPI', 'Requests', 'Pydantic'])
   - A specific hands-on 'Project' description or task to build that implements the concepts learned that week (e.g., 'Build a simple AI API using FastAPI.').
7. Provide general learning and strategy tips.

You MUST respond strictly with a valid JSON object matching the schema below. No conversational wrapper, no markdown blocks.

Expected JSON Schema:
{{
  "target_role": "string",
  "time_limit": "string",
  "current_skills_recognized": ["string"],
  "skill_gaps": ["string"],
  "weekly_hours_recommended": 15,
  "roadmap_months": [
    {{
      "month_number": 1,
      "month_title": "string",
      "weeks": [
        {{
          "week_number": 1,
          "week_title": "string",
          "topics": ["string"],
          "learn": ["string"],
          "project": "string"
        }}
      ]
    }}
  ],
  "general_tips": ["string"]
}}
"""

    models_to_try = [PRIMARY_MODEL, FALLBACK_MODEL]
    last_error = None

    for model in models_to_try:
        try:
            print(f"[INFO] Attempting roadmap generation with model: {model}")
            response = requests.post(
                OPENROUTER_URL,
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model,
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a JSON assistant. You must return strictly valid JSON matching the requested schema. Do not write explanation text, code block fences, or any other output other than valid JSON."
                        },
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.2,
                    "max_tokens": 3000,
                },
                timeout=60
            )

            if response.status_code != 200:
                raise Exception(f"OpenRouter API returned error {response.status_code}: {response.text}")

            result = response.json()
            raw_content = result["choices"][0]["message"]["content"]
            
            # Clean and parse JSON
            cleaned_content = sanitize_json_string(raw_content)
            parsed_data = json.loads(cleaned_content)
            
            # Verify structure against Pydantic schema
            validated_roadmap = RoadmapResponse(**parsed_data)
            return validated_roadmap.model_dump()

        except Exception as e:
            print(f"[ERROR] Failed to generate roadmap with {model}: {e}")
            last_error = e

    raise Exception(f"Failed to generate roadmap using all models. Last error: {last_error}")
