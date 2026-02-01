from .github_api import fetch_github_stats
from .resume_parser import extract_text_from_pdf, extract_skills, extract_details
from .linkedin_api import fetch_linkedin_data
from .scoring import calculate_credex_score
from .tips import generate_insights
from .scorecard import generate_share_text

def analyze_profile(data):
    github_username = data.github.username if data.github else None
    linkedin_link = data.linkedin.link if data.linkedin else None

    github_data = fetch_github_stats(github_username) if github_username else {}
    linkedin_data = fetch_linkedin_data(linkedin_link) if linkedin_link else {}

    resume_text = getattr(data, "resume_text", "") or ""
    resume_data = extract_details(resume_text)

    score = calculate_credex_score(data, github_data, linkedin_data, resume_data)
    insights = generate_insights(score)

    return {
        "credex_score": score,
        "level": insights["level"],
        "description": insights["description"],
        "strengths": insights["strengths"],
        "improvement_tips": insights["tips"],
        "share_text": generate_share_text(
            data.fullName or "Developer",
            score,
            insights["level"]
        ),
    }