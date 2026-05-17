import os
import requests
from dotenv import load_dotenv
from .score import generate_score

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def generate_insights(platform: str, profile: dict) -> list[str]:

    score = generate_score(platform, profile)

    # Keep profile compact so prompt doesn't become too large
    profile_summary = {k: v for k, v in profile.items() if v}

    prompt = f"""
You are a technical career evaluator.

Platform: {platform}
Score (out of 1000): {score}

Profile Data:
{profile_summary}

Generate 5 concise, practical improvement tips.
Focus only on weak areas based on the score and data.
Keep each tip under 20 words.
Be specific and actionable.
Return only bullet points.
"""

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "openai/gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "You generate career improvement insights."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    try:
        response = requests.post(OPENROUTER_URL, headers=headers, json=payload)

        if response.status_code != 200:
            raise Exception(response.text)

        result = response.json()
        content = result["choices"][0]["message"]["content"]

        # Convert bullet text into list
        tips = [
            tip.strip("•- ").strip()
            for tip in content.split("\n")
            if tip.strip()
        ]

        return tips if tips else ["Profile analyzed successfully. Continue improving consistently."]

    except Exception as e:
        print("OpenRouter Error:", str(e))
        return ["Insights temporarily unavailable. Please try again later."]