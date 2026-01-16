def extract_linkedin(profile_id: str) -> dict:
    return {
        "platform": "linkedin",
        "profile_id": profile_id,
        "profile_url": f"https://www.linkedin.com/in/{profile_id}",
        "profile_visible": True,

        # User-provided / verifiable fields
        "headline_present": False,
        "summary_present": False,
        "experience_count": 0,
        "project_links_present": False,
        "skills_count": 0,
        "education_present": False,
        "profile_photo_present": False,

        # Activity signals (manual or inferred)
        "recent_activity_30_days": False,

        "data_quality": "user-provided"
    }