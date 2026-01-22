def extract_linkedin(profile_id: str, parsed_data: dict | None = None) -> dict:

    if parsed_data is None:
        parsed_data = {
            "headline": "",
            "summary": "",
            "experience": [],
            "education": [],
            "skills": [],
            "links": [],
            "has_photo": False,
            "recent_activity": False
        }

    headline = parsed_data.get("headline", "")
    summary = parsed_data.get("summary", "")
    experiences = parsed_data.get("experience", [])
    education = parsed_data.get("education", [])
    skills = set(parsed_data.get("skills", []))
    links = parsed_data.get("links", [])

    return {
        "platform": "linkedin",
        "profile_id": profile_id,
        "profile_url": f"https://www.linkedin.com/in/{profile_id}",

        # Only visible if data exists
        "profile_visible": bool(profile_id and (headline or summary or experiences or education or skills or links)),

        "profile_photo_present": parsed_data.get("has_photo", False),
        "headline_present": len(headline.strip()) > 10,
        "summary_present": len(summary.strip()) > 50,

        "experience_count": len(experiences),
        "education_present": len(education) > 0,

        "project_links_present": any(
            "github.com" in l or "vercel.app" in l or "netlify.app" in l
            for l in links
        ),

        "skills_count": len(skills),
        "recent_activity_30_days": parsed_data.get("recent_activity", False),

        "data_quality": "inferred"
    }