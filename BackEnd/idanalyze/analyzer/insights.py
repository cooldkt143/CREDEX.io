import os
import requests
from dotenv import load_dotenv
from .score import generate_score

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def get_local_fallback_insights(platform: str, profile: dict) -> list[str]:
    tips = []
    
    if platform == "github":
        public_repos = profile.get("public_repos", 0)
        profile_completeness = profile.get("profile_completeness_score", 0)
        total_stars = profile.get("total_stars", 0)
        repos_with_readme = profile.get("repos_with_readme", 0)
        repos_with_license = profile.get("repos_with_license", 0)
        languages = len(profile.get("primary_languages", []))
        
        if public_repos < 5:
            tips.append("Create more public repositories to showcase your project work and coding consistency.")
        if profile_completeness < 4:
            tips.append("Complete your GitHub profile by adding a bio, location, company, and avatar.")
        if total_stars < 5:
            tips.append("Share your projects with the developer community to gain visibility and earn stars.")
        if repos_with_readme < max(1, public_repos // 2):
            tips.append("Add detailed README files to all public repositories to explain project setups and features.")
        if repos_with_license < max(1, public_repos // 2):
            tips.append("Include open-source licenses (like MIT or Apache) in your repositories to enable reuse.")
        if languages < 3:
            tips.append("Experiment with new programming languages to broaden your engineering stack.")
        if not tips:
            tips.append("Maintain a steady commit history to build developer credibility.")
            tips.append("Contribute to open-source projects to expand your collaborative coding experience.")

    elif platform == "hackerrank":
        badges = profile.get("badge_count_estimated") or 0
        certs = profile.get("certification_count") or 0
        
        if badges < 3:
            tips.append("Solve more challenges in HackerRank modules to earn higher-rank badges.")
        if certs < 1:
            tips.append("Take HackerRank skills certification tests to verify your competency in specific topics.")
        if not profile.get("profile_visible"):
            tips.append("Make your HackerRank profile public so it can be viewed by potential recruiters.")
        if not profile.get("recent_activity_30_days"):
            tips.append("Practice problem-solving regularly to maintain a consistent activity momentum.")
        if not tips:
            tips.append("Explore advanced problem domains (algorithms, data structures) to push your limits.")
            tips.append("Maintain your streak with quick daily coding workouts.")

    elif platform == "geeksforgeeks":
        problems = profile.get("problems_solved") or 0
        articles = profile.get("articles_contributed") or 0
        
        if problems < 50:
            tips.append("Practice and solve more data structures and algorithm challenges on GeeksForGeeks.")
        if articles < 1:
            tips.append("Contribute articles or tutorials on GFG to share technical knowledge with the community.")
        if not profile.get("profile_visible"):
            tips.append("Set your GFG profile to public to showcase your consistency and progress.")
        if not profile.get("recent_activity_30_days"):
            tips.append("Dedicate time to solve GFG problems weekly to keep your profile active.")
        if not tips:
            tips.append("Tackle school/easy level problems to raise your total solved count rapidly.")
            tips.append("Attempt medium and hard challenges to deepen your conceptual understanding.")

    elif platform == "unstop":
        participation_count = profile.get("participation_count_estimated") or 0
        
        if participation_count < 2:
            tips.append("Register and participate in more hackathons, hiring events, and coding contests on Unstop.")
        if not profile.get("resume_visible"):
            tips.append("Upload and make your resume visible to recruiters looking for qualified candidates.")
        if not profile.get("has_activity"):
            tips.append("Stay active on the Unstop platform by exploring ongoing engineering challenges.")
        if not tips:
            tips.append("Form a team and collaborate on national-level hackathons to win credentials.")
            tips.append("Prepare specifically for competitive hiring challenges from top tech companies.")

    elif platform == "linkedin":
        experience_count = profile.get("experience_count", 0)
        skills = profile.get("skills_count", 0)
        
        if not profile.get("headline_present") or not profile.get("summary_present"):
            tips.append("Write a professional headline and summary highlighting your main skills and experience.")
        if experience_count < 2:
            tips.append("Detail your work history, internship experience, and roles to demonstrate depth.")
        if not profile.get("project_links_present"):
            tips.append("Add project links or portfolio URLs in your featured/experience sections to showcase proof of work.")
        if skills < 5:
            tips.append("List your technical skills and request endorsements from colleagues and peers.")
        if not tips:
            tips.append("Connect with engineers in your field to expand your networking range.")
            tips.append("Share posts or articles about projects you've recently built to boost profile views.")

    else:
        tips.append("Complete your profile information on this platform.")
        tips.append("Engage in community challenges and projects consistently.")
        tips.append("Update your profile settings to ensure your achievements are publicly visible.")
        
    return tips[:5]


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

    # Model options (prefer gpt-4o-mini but fall back to free model options if credits/rates fail)
    models = [
        "openai/gpt-4o-mini",
        "google/gemini-2.5-flash-8b",
        "meta-llama/llama-3-8b-instruct:free"
    ]

    for model in models:
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": "You generate career improvement insights."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 150  # Fixes 402 payment credit reservation error
        }

        try:
            response = requests.post(OPENROUTER_URL, headers=headers, json=payload, timeout=12)

            if response.status_code != 200:
                print(f"[WARNING] OpenRouter call for model {model} returned code {response.status_code}: {response.text}")
                continue

            result = response.json()
            content = result["choices"][0]["message"]["content"]

            # Convert bullet/numbered text into a clean list
            tips = [
                tip.strip("•- 1234567890. ").strip()
                for tip in content.split("\n")
                if tip.strip()
            ]

            valid_tips = [t for t in tips if len(t) > 5]
            if valid_tips:
                return valid_tips[:5]

        except Exception as e:
            print(f"[WARNING] OpenRouter call failed for model {model}:", str(e))

    # Fallback to local heuristic rules
    print("[INFO] Returning local fallback insights.")
    return get_local_fallback_insights(platform.lower(), profile)