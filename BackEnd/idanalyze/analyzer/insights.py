def generate_insights(platform: str, profile: dict) -> list[str]:
    tips = []

    if platform == "github":
        if profile.get("public_repos", 0) < 5:
            tips.append("Build more public repositories")
        if profile.get("stars", 0) < 20:
            tips.append("Improve README and project visibility")
        if len(profile.get("languages", [])) < 3:
            tips.append("Work with more languages")

    else:
        tips.append("Stay consistent and keep improving")

    return tips