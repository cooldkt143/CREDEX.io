def calculate_credex_score(
    data,
    github_data=None,
    linkedin_data=None,
    resume_data=None
):
    total_score = 0

    # -----------------------------
    # 1. Experience Score (Max 200)
    # -----------------------------
    exp_map = {
        "Student": 80,
        "Fresher": 120,
        "1–3 Years": 160,
        "3+ Years": 200
    }

    experience_score = exp_map.get(getattr(data, "experience", "Student"), 80)
    total_score += experience_score
    print("Experience Score:", experience_score)

    # -----------------------------
    # 2. Resume Score (Max 500)
    # -----------------------------
    resume_score = 0

    def calculate_resume_quality_score(extracted_data):
        """Base quality score out of 100"""
        if not extracted_data:
            return 0
        print("------------Resume score pattern------------")
        score = 0

        # Contact information (20 points)
        if extracted_data.get("name") and extracted_data["name"] != "Unknown":
            score += 5
        if extracted_data.get("email"):
            score += 5
        if extracted_data.get("phone"):
            score += 5
        if extracted_data.get("linkedin") or extracted_data.get("github"):
            score += 5
        print("Contact Info Score:", score)

        # Skills (25 points)
        skills_count = len(extracted_data.get("skills", []))
        if skills_count >= 10:
            score += 25
        elif skills_count >= 5:
            score += 15
        elif skills_count >= 1:
            score += 5
        print("Skills Score:", score)

        # Projects (20 points)
        projects_count = len(extracted_data.get("projects", []))
        if projects_count >= 3:
            score += 20
        elif projects_count >= 2:
            score += 15
        elif projects_count >= 1:
            score += 10
        print("Projects Score:", score)

        # Education (15 points)
        if extracted_data.get("education"):
            score += 15
        print("Education Score:", score)

        # Experience (20 points)
        experience = extracted_data.get("experience", [])
        if len(experience) >= 2:
            score += 20
        elif len(experience) >= 1:
            score += 10
        print("Experience Score:", score)

        return min(score, 100)

    if resume_data:
        base_quality_score = calculate_resume_quality_score(resume_data)

        # Scale 100 → 500
        scaled_quality_score = (base_quality_score / 100) * 500

        resume_score = int(min(scaled_quality_score, 500))

    total_score += resume_score
    print("Resume Score:", resume_score)

    # -----------------------------
    # 3. Projects (Max 150)
    # -----------------------------
    project_score = 0
    projects = getattr(data, "projects", [])

    for project in projects:
        if not getattr(project, "name", None):
            continue

        project_score += 30

        if getattr(project, "repo", None):
            project_score += 20

        if getattr(project, "live", None):
            project_score += 20

    project_score = min(project_score, 150)
    total_score += project_score
    print("Project Score:", project_score)

    # -----------------------------
    # 4. GitHub Score (Max 250)
    # -----------------------------
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

    github_score = int(min(github_score, 250))
    total_score += github_score
    print("GitHub Score:", github_score)

    # -----------------------------
    # 5. LinkedIn Score (Max 200)
    # -----------------------------
    linkedin_score = 0

    if linkedin_data and linkedin_data.get("positions"):
        linkedin_score += 100
        total_exp = sum(p.get("years", 0) for p in linkedin_data["positions"])
        linkedin_score += min(total_exp * 20, 100)

    linkedin_score = min(linkedin_score, 200)
    total_score += linkedin_score

    final_score = min(total_score, 1000)
    print("LinkedIn Score:", linkedin_score)
    print("Total Score:", final_score)

    return {
        "score": final_score,
        "breakdown": {
            "experience": experience_score,
            "resume": resume_score,
            "projects": project_score,
            "github": github_score,
            "linkedin": linkedin_score
        }
    }