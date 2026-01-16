def calculate_credex_score(data, github_data=None, linkedin_data=None, skills=None):
    """
    Calculate the Credex score based on real data:
    Total score is now out of 1000.
    """
    score = 0

    # Experience points (was max 40/100, now scale to 200/1000)
    exp_map = {
        "Student": 100,
        "Fresher": 150,
        "1–3 Years": 250,
        "3+ Years": 400
    }
    score += exp_map.get(data.experience, 100)

    # GitHub data (was 15 + bonus 10 = max 25, now scale to max 250)
    if github_data and github_data.get("repos", 0) > 0:
        score += 150  # base for having GitHub
        score += min(github_data.get("stars", 0) * 5, 100)  # bonus for stars
        # Optionally add bonus for forks
        score += min(github_data.get("forks", 0) * 2, 50)  # max 50
    # Max possible from GitHub ~300

    # LinkedIn data (was max 20, now scale to 200)
    if linkedin_data and linkedin_data.get("positions"):
        score += 100  # base for LinkedIn
        total_exp = sum(p.get("years", 0) for p in linkedin_data["positions"])
        score += min(total_exp * 20, 100)  # max 100 extra for years of experience
    # Max possible from LinkedIn ~200

    # Projects (was max 25, now scale to 150)
    if data.projects:
        project_score = min(len(data.projects) * 50, 150)  # 50 points per project, max 150
        score += project_score

    # Resume skills (was max 10, now scale to 100)
    if skills:
        score += min(len(skills) * 10, 100)  # 10 points per skill, max 100

    # Total maximum ~1000
    return min(score, 1000)