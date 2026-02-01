def calculate_credex_score(
    data,
    github_data=None,
    linkedin_data=None,
    resume_data=None
):
    total_score = 0

    # Experience (max 200)
    exp_map = {
        "Student": 80,
        "Fresher": 120,
        "1–3 Years": 160,
        "3+ Years": 200
    }
    total_score += exp_map.get(data.experience, 80)

    # Resume (max 500)
    resume_score = 0
    if resume_data:
        # Contact + Identity (50)
        if resume_data.get("email"):
            resume_score += 20
        if resume_data.get("phone"):
            resume_score += 20
        if resume_data.get("name") and resume_data["name"] != "Unknown":
            resume_score += 10

        # Skills (100)
        resume_score += min(len(resume_data.get("skills", [])) * 15, 100)

        # Resume Projects (150)
        resume_score += min(len(resume_data.get("projects", [])) * 50, 150)

        # Achievements (100)
        resume_score += min(len(resume_data.get("achievements", [])) * 50, 100)

        # Work Experience (200)
        resume_score += min(len(resume_data.get("experience", [])) * 100, 200)

        # Education (100)
        resume_score += min(len(resume_data.get("education", [])) * 50, 100)

        # Completeness bonus (100)
        completeness = 0
        for key in ["skills", "projects", "achievements", "experience", "education"]:
            if resume_data.get(key):
                completeness += 20

        resume_score += completeness

    total_score += min(resume_score, 500)

    # Credex Projects (max 150)
    project_score = 0
    projects = getattr(data, "projects", [])

    for project in projects:
        name = project.name
        repo = project.repo
        live = project.live

        # Only count valid projects
        if not name:
            continue

        # Base score for a real project
        project_score += 30

        # GitHub repo bonus
        if repo:
            project_score += 20

        # Live / deployed bonus
        if live:
            project_score += 20

    total_score += min(project_score, 150)

    # GitHub (max 250)
    github_score = 0
    if github_data and github_data.get("repos", 0) > 0:
        github_score += min(github_data.get("followers", 0) * 3, 60)
        github_score += min(github_data.get("follower_following_ratio", 0) * 15, 40)
        github_score += min(github_data.get("profile_completeness_score", 0) * 10, 40)

        github_score += min(github_data.get("public_repos", 0) * 3, 50)
        github_score += min(github_data.get("account_age_years", 0) * 8, 40)

        github_score += min(github_data.get("total_stars", 0) * 1.5, 60)
        github_score += min(github_data.get("total_forks", 0) * 2, 40)

        github_score += min(len(github_data.get("primary_languages", [])) * 15, 30)

    total_score += min(github_score, 250)

    # LinkedIn (max 200)
    linkedin_score = 0
    if linkedin_data and linkedin_data.get("positions"):
        linkedin_score += 100
        total_exp = sum(p.get("years", 0) for p in linkedin_data["positions"])
        linkedin_score += min(total_exp * 20, 100)

    total_score += min(linkedin_score, 200)

    # Final Cap
    return min(total_score, 1000)