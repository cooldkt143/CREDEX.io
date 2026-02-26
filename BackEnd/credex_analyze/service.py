from .github_api import fetch_github_stats
from .resume_parser import extract_details
from .linkedin_api import fetch_linkedin_data
from .scoring import calculate_credex_score
from .tips import generate_insights
from .scorecard import generate_share_text


def extract_github_username(github_profile):
    if not github_profile:
        return None

    # If username is directly provided
    if github_profile.username:
        return github_profile.username.strip()

    # If full GitHub link is provided
    if github_profile.link:
        link = github_profile.link.strip().rstrip("/")
        if "github.com" in link:
            return link.split("/")[-1]

    return None


def extract_linkedin_link(linkedin_profile):
    if not linkedin_profile:
        return None

    if linkedin_profile.link:
        return linkedin_profile.link.strip()

    return None


def analyze_profile(data):

    github_username = extract_github_username(data.github)

    linkedin_link = extract_linkedin_link(data.linkedin)

    github_data = fetch_github_stats(github_username) if github_username else {}
    linkedin_data = fetch_linkedin_data(linkedin_link) if linkedin_link else {}

    print("Extracted GitHub Username:", github_username)

    resume_text = getattr(data, "resume_text", "") or ""
    resume_data = extract_details(resume_text)

    score_result = calculate_credex_score(
        data,
        github_data,
        linkedin_data,
        resume_data
    )

    final_score = score_result["score"]
    breakdown = score_result["breakdown"]
    insights = generate_insights(
        total_score=final_score,
        experience_score=breakdown["experience"],
        resume_score=breakdown["resume"],
        project_score=breakdown["projects"],
        github_score=breakdown["github"],
        linkedin_score=breakdown["linkedin"]
    )
    return {
        "credex_score": final_score,
        "level": insights["level"],
        "description": insights["description"],
        "strengths": insights["strengths"],
        "improvement_tips": insights["tips"],
        "share_text": generate_share_text(
            data.fullName or "Developer",
            final_score,
            insights["level"]
        ),
    }