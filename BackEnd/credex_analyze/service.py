from .github_api import fetch_github_stats
from .resume_parser import extract_text_from_pdf, extract_skills
from .linkedin_api import fetch_linkedin_data
from .scoring import calculate_credex_score
from .tips import generate_insights
from .scorecard import generate_share_text

def analyze_profile(data):
    github_data = fetch_github_stats(data.github.username) if data.github.username else {}
    linkedin_data = fetch_linkedin_data(data.linkedin.link) if data.linkedin.link else {}
    
    resume_text = data.resume_text or ""
    skills = extract_skills(resume_text)
    
    score = calculate_credex_score(data, github_data, linkedin_data, skills)
    insights = generate_insights(score)
    
    return {
        "credex_score": score,
        "level": insights["level"],
        "description": insights["description"],
        "strengths": insights["strengths"],
        "improvement_tips": insights["tips"],
        "share_text": generate_share_text(data.fullName or "Developer", score, insights["level"]),
    }