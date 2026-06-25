def calculate_credex_score(
    data,
    github_data=None,
    linkedin_data=None,
    resume_data=None
):
    total_score = 0

    print("\n================ CREDex Score Detailed Report ================\n")

    # ============================================================
    # 1. EXPERIENCE (Max 100)
    # ============================================================
    exp_map = {
        "Student": 20,
        "Fresher": 40,
        "1–3 Years": 70,
        "1-3 Years": 70,
        "3+ Years": 100
    }

    experience_score = exp_map.get(getattr(data, "experience", "Student"), 20)
    total_score += experience_score

    print(f"[Experience Score] {experience_score} / 100")

    # ============================================================
    # 2. RESUME (Max 300)
    # ============================================================
    resume_score = 0

    if resume_data:
        print("\n--- Resume Breakdown (Max 300) ---")

        # ---------------- Contact Info (75) ----------------
        contact_score = 0

        if resume_data.get("name") and resume_data["name"] != "Unknown":
            contact_score += 30
        if resume_data.get("email"):
            contact_score += 30
        if resume_data.get("phone"):
            contact_score += 10
        if resume_data.get("linkedin") or resume_data.get("github"):
            contact_score += 5

        contact_score = min(contact_score, 75)
        resume_score += contact_score
        print(f"Contact Info: {contact_score} / 75")

        # ---------------- Skills (75) ----------------
        skills_count = len(resume_data.get("skills", []))
        skills_score = 0

        if skills_count >= 15:
            skills_score = 75
        elif skills_count >= 10:
            skills_score = 55
        elif skills_count >= 5:
            skills_score = 35
        elif skills_count >= 1:
            skills_score = 15

        resume_score += skills_score
        print(f"Skills ({skills_count}): {skills_score} / 75")

        # ---------------- Projects in Resume (50) ----------------
        projects_count = resume_data.get("projects", 0)
        projects_resume_score = 0

        if projects_count >= 3:
            projects_resume_score = 50
        elif projects_count == 2:
            projects_resume_score = 35
        elif projects_count == 1:
            projects_resume_score = 20

        resume_score += projects_resume_score
        print(f"Projects in Resume ({projects_count}): {projects_resume_score} / 50")

        # ---------------- Education (50) ----------------
        education_count = resume_data.get("education", 0)
        education_score = 0

        if education_count >= 2:
            education_score = 50
        elif education_count == 1:
            education_score = 35

        resume_score += education_score
        print(f"Education ({education_count}): {education_score} / 50")

        # ---------------- Work Experience (50) ----------------
        work_exp_count = resume_data.get("experience", 0)
        work_exp_score = 0

        if work_exp_count >= 2:
            work_exp_score = 50
        elif work_exp_count == 1:
            work_exp_score = 30

        resume_score += work_exp_score
        print(f"Work Experience ({work_exp_count}): {work_exp_score} / 50")

    else:
        print("[Resume Score] 0 / 300 (No resume data)")

    resume_score = min(resume_score, 300)
    total_score += resume_score
    print(f"[Resume Score] {resume_score} / 300")

    # ============================================================
    # 3. PROJECT PORTFOLIO (Max 150)
    # ============================================================
    project_score = 0
    projects = getattr(data, "projects", [])

    print("\n--- Project Portfolio Breakdown (Max 150) ---")

    if projects:
        for idx, project in enumerate(projects[:6], 1):  # Max 6 projects

            name = project.get("name") if isinstance(project, dict) else getattr(project, "name", None)
            repo = project.get("repo") if isinstance(project, dict) else getattr(project, "repo", None)
            live = project.get("live") if isinstance(project, dict) else getattr(project, "live", None)

            if not name:
                continue

            print(f"\nProject {idx}: {name}")

            single_score = 0

            # Base only if at least one link exists
            if repo or live:
                single_score += 5
                print("  Base: +5")

                if repo:
                    single_score += 10
                    print("  Repo: +10")

                if live:
                    single_score += 10
                    print("  Live: +10")
            else:
                print("  No repo or live link. 0 points.")

            print(f"  Subtotal: {single_score} / 25")

            project_score += single_score

    project_score = min(project_score, 150)
    total_score += project_score
    print(f"[Projects Score] {project_score} / 150")

    # -----------------------------
    # 4. GitHub Score (Max 250)
    # -----------------------------
    github_score = 0

    if github_data and github_data.get("repos", 0) > 0:
        print("\n--- GitHub Breakdown (Max 250) ---")

        # Profile (50)
        profile_score = 0
        if github_data.get("bio"):
            profile_score += 15
        if github_data.get("avatar_url"):
            profile_score += 10
        if github_data.get("blog"):
            profile_score += 10
        if github_data.get("location"):
            profile_score += 15

        profile_score = min(profile_score, 50)
        github_score += profile_score
        print(f"Profile: {profile_score} / 50")

        # Repositories (40)
        repo_count = github_data.get("repos", 0)
        repos_score = min(repo_count * 2, 40)
        github_score += repos_score
        print(f"Repos ({repo_count}): {repos_score} / 40")

        # Activity (60)
        contributions = github_data.get("total_commits", 0)
        activity_score = min(contributions // 10, 60)
        github_score += activity_score
        print(f"Activity (Commits {contributions}): {activity_score} / 60")

        # Stars (30)
        total_stars = github_data.get("total_stars", 0)
        stars_score = min(total_stars * 2, 30)
        github_score += stars_score
        print(f"Stars ({total_stars}): {stars_score} / 30")

        # Followers (30)
        followers = github_data.get("followers", 0)
        followers_score = min(followers * 2, 30)
        github_score += followers_score
        print(f"Followers ({followers}): {followers_score} / 30")

        # Code Quality (40)
        languages_used = len(github_data.get("languages", []))
        readme_present = github_data.get("readme_score", 0)

        code_quality_score = min((languages_used * 5) + readme_present, 40)
        github_score += code_quality_score
        print(f"Code Quality: {code_quality_score} / 40")

    github_score = min(github_score, 250)
    total_score += github_score
    print(f"[GitHub Score] {github_score} / 250")


    # -----------------------------
    # 5. LinkedIn Score (Max 200)
    # -----------------------------
    linkedin_score = 0

    if linkedin_data:
        print("\n--- LinkedIn Breakdown (Max 200) ---")

        # Profile (60)
        profile_score = 0
        if linkedin_data.get("headline"):
            profile_score += 20
        if linkedin_data.get("summary"):
            profile_score += 20
        if linkedin_data.get("profile_picture"):
            profile_score += 20

        profile_score = min(profile_score, 60)
        linkedin_score += profile_score
        print(f"Profile: {profile_score} / 60")

        # Experience (60)
        positions = linkedin_data.get("positions", [])
        experience_score = min(len(positions) * 20, 60)
        linkedin_score += experience_score
        print(f"Experience Entries ({len(positions)}): {experience_score} / 60")

        # Network (40)
        connections = linkedin_data.get("connections", 0)
        network_score = min(connections // 25, 40)
        linkedin_score += network_score
        print(f"Network ({connections} connections): {network_score} / 40")

        # Engagement (40)
        recommendations = linkedin_data.get("recommendations", 0)

        endorsements_data = linkedin_data.get("endorsements", 0)

        # If endorsements is a list, count it
        if isinstance(endorsements_data, list):
            endorsements_count = len(endorsements_data)
        else:
            endorsements_count = endorsements_data

        engagement_score = min((recommendations * 5) + (endorsements_count * 2), 40)

        linkedin_score += engagement_score
        print(f"Engagement: {engagement_score} / 40")

    linkedin_score = min(linkedin_score, 200)
    total_score += linkedin_score
    print(f"[LinkedIn Score] {linkedin_score} / 200")

    # ============================================================
    # FINAL SCORE (Max 1000)
    # ============================================================
    final_score = min(total_score, 1000)

    print("\n================ FINAL SCORE SUMMARY ================")
    print(f"Experience : {experience_score} / 100")
    print(f"Resume     : {resume_score} / 300")
    print(f"Projects   : {project_score} / 150")
    print(f"GitHub     : {github_score} / 250")
    print(f"LinkedIn   : {linkedin_score} / 200")
    print("-----------------------------------------------------")
    print(f"TOTAL      : {final_score} / 1000")
    print("=====================================================\n")

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