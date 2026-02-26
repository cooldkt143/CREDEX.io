import os
import json
import re
import requests
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "openai/gpt-3.5-turbo"

def generate_insights(
    total_score: int,
    experience_score: int = 0,
    resume_score: int = 0,
    project_score: int = 0,
    github_score: int = 0,
    linkedin_score: int = 0,
):

    if not OPENROUTER_API_KEY:
        raise Exception("OPENROUTER_API_KEY is missing.")

    level = _calculate_level(total_score)

    prompt = f"""
You are a strict technical career evaluator.

Total Score: {total_score}/1000
Level: {level}

Breakdown:
Experience: {experience_score}/200
Resume: {resume_score}/500
Projects: {project_score}/150
GitHub: {github_score}/250
LinkedIn: {linkedin_score}/200

Return ONLY valid JSON in this format:

{{
  "description": "Short 2-3 sentence evaluation.",
  "strengths": ["s1","s2","s3","s4"],
  "tips": ["t1","t2","t3","t4","t5","t6"]
}}
"""

    for attempt in range(2):
        try:
            response = requests.post(
                OPENROUTER_URL,
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": MODEL,
                    "messages": [
                        {
                            "role": "system",
                            "content": "You must return strictly valid JSON. No explanations.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.4,
                },
                timeout=40,
            )

            if response.status_code != 200:
                raise Exception(response.text)

            result = response.json()
            raw_content = result["choices"][0]["message"]["content"]

            # Remove markdown fences
            cleaned = raw_content.replace("```json", "").replace("```", "").strip()

            # Extract JSON safely
            match = re.search(r"\{.*\}", cleaned, re.DOTALL)

            if not match:
                raise Exception("No valid JSON found in response.")

            json_string = match.group(0)
            parsed = json.loads(json_string)

            # Basic structure validation
            if not (
                isinstance(parsed.get("description"), str)
                and isinstance(parsed.get("strengths"), list)
                and isinstance(parsed.get("tips"), list)
            ):
                raise Exception("Invalid JSON structure returned by AI.")

            # Normalize strengths and tips
            strengths = parsed["strengths"][:4]
            tips = parsed["tips"][:6]

            # Pad if too short
            while len(strengths) < 4:
                strengths.append("Developing technical consistency")

            while len(tips) < 6:
                tips.append("Continue building depth and practical exposure")

            return {
                "level": level,
                "description": parsed["description"],
                "strengths": strengths,
                "tips": tips,
            }

        except Exception as e:
            print(f"Attempt {attempt + 1} failed:", str(e))

            if attempt == 1:
                # Fallback safe response instead of crashing backend
                return {
                    "level": level,
                    "description": f"{level} with growing potential. Continue strengthening practical execution and technical depth.",
                    "strengths": [
                        "Foundational technical knowledge",
                        "Growing professional presence",
                        "Active learning mindset",
                        "Career development awareness",
                    ],
                    "tips": [
                        "Build more production-level projects",
                        "Improve resume impact with quantified results",
                        "Increase GitHub contribution consistency",
                        "Strengthen problem-solving depth",
                        "Enhance system design understanding",
                        "Expand professional network strategically",
                    ],
                }

    # Should never reach here
    return {
        "level": level,
        "description": "Evaluation completed.",
        "strengths": [],
        "tips": [],
    }

def _calculate_level(score: int) -> str:
    if score >= 800:
        return "Elite Developer"
    elif score >= 650:
        return "Advanced Developer"
    elif score >= 450:
        return "Growing Professional"
    else:
        return "Early Stage Developer"