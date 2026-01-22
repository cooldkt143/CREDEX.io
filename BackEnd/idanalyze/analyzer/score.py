def generate_score(platform: str, profile: dict) -> int:
    score = 0

    if platform == "github":
        
        # existing github logic (unchanged)
        score += min(profile.get("followers", 0) * 3, 100)
        score += min(profile.get("follower_following_ratio", 0) * 20, 50)
        score += min(profile.get("profile_completeness_score", 0) * 10, 50)

        score += min(profile.get("public_repos", 0) * 4, 120)
        score += min(profile.get("account_age_years", 0) * 8, 80)

        score += min(profile.get("total_stars", 0) * 1.5, 180)
        score += min(profile.get("avg_stars_per_repo", 0) * 10, 60)
        score += min(profile.get("total_forks", 0) * 2, 60)

        score += min(profile.get("repos_with_readme", 0) * 8, 100)
        score += min(profile.get("repos_with_license", 0) * 8, 100)

        score += min(len(profile.get("primary_languages", [])) * 25, 75)
        score += min(profile.get("avg_forks_per_repo", 0) * 10, 25)

    elif platform == "hackerrank":

        # 1. Profile presence & trust (200)
        if profile.get("profile_visible"):
            score += 120
        if profile.get("username"):
            score += 50
        if profile.get("profile_completed"):
            score += 30

        # 2. Practice & engagement (300)
        badges = profile.get("badge_count_estimated") or 0

        if badges >= 1:
            score += 80
        if badges >= 5:
            score += 100
        if badges >= 10:
            score += 120

        # 3. Skill proof (certifications) (300)
        certs = profile.get("certification_count") or 0

        score += min(certs * 120, 240)

        if certs > 0 and profile.get("certifications_verified"):
            score += 60

        # 4. Growth & momentum (200)
        if profile.get("recent_activity_30_days"):
            score += 100

        if profile.get("new_badge_recent"):
            score += 50

        if profile.get("first_certification_recent"):
            score += 50

    elif platform == "geeksforgeeks":

        # 1. Profile presence (200)
        if profile.get("profile_visible"):
            score += 150
        if profile.get("username"):
            score += 50

        # 2. Problem solving depth (400)
        problems = profile.get("problems_solved") or 0

        score += min(problems * 4, 300)

        if problems >= 100:
            score += 50
        if problems >= 300:
            score += 50

        # 3. Knowledge sharing (200)
        articles = profile.get("articles_contributed") or 0
        score += min(articles * 40, 200)

        # 4. Growth & consistency (200)
        if profile.get("recent_activity_30_days"):
            score += 200
            
    elif platform == "unstop":

        # 1. Profile presence (300)
        if profile.get("profile_visible"):
            score += 200
        if profile.get("username"):
            score += 100

        # 2. Participation exposure (400)
        if profile.get("has_activity"):
            score += 150

        participation_count = profile.get("participation_count_estimated") or 0
        score += min(participation_count * 80, 250)

        # 3. Career readiness (300)
        if profile.get("resume_visible"):
            score += 150

        types = profile.get("participation_types", {})
        if types.get("hackathon"):
            score += 50
        if types.get("hiring_challenge"):
            score += 50
    
    elif platform == "linkedin":

        # 1. Profile completeness & trust (400)
        if profile.get("profile_visible"):
            score += 100

        if profile.get("data_quality"):
            score += 50

        if profile.get("profile_photo_present"):
            score += 50
        if profile.get("headline_present"):
            score += 100
        if profile.get("summary_present"):
            score += 150

        # 2. Career clarity & depth (300)
        experience_count = profile.get("experience_count", 0)
        score += min(experience_count * 60, 180)

        if profile.get("education_present"):
            score += 60

        if experience_count >= 2:
            score += 60

        # 3. Proof of work (200)
        if profile.get("project_links_present"):
            score += 120

        skills = profile.get("skills_count", 0)
        score += min(skills * 10, 80)

        # 4. Activity & visibility (100)
        if profile.get("recent_activity_30_days"):
            score += 100
    
    else :
        
        score = 400  # generic baseline for other platforms

    return int(min(score, 1000))