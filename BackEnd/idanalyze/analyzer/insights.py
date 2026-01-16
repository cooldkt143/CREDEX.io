def generate_insights(platform: str, profile: dict) -> list[str]:
    
    tips = []

    if platform == "github":

        # 1. Account & profile strength
        if profile.get("profile_completeness_score", 0) < 3:
            tips.append("Complete your GitHub profile with bio, links, and company details to improve credibility")

        if profile.get("follower_following_ratio", 0) < 0.8:
            tips.append("Follow fewer inactive accounts and focus on meaningful connections to improve profile trust")

        # 2. Repository impact
        if profile.get("public_repos", 0) < 8:
            tips.append("Build more complete public projects instead of small experiments to increase profile depth")

        if profile.get("total_stars", 0) < 100:
            tips.append("Add clear READMEs, screenshots, and demos so more developers can discover and star your projects")

        if profile.get("max_repo_stars", 0) < 30:
            tips.append("Focus on one flagship project and improve its usefulness to create higher impact")

        # 3. Activity & consistency
        if profile.get("active_repos_last_90_days", 0) < 3:
            tips.append("Push code regularly across a few repositories to show consistent development activity")

        if profile.get("total_commits_last_90_days", 0) < 40:
            tips.append("Increase weekly commits by working in smaller iterations rather than infrequent large pushes")

        if profile.get("days_since_last_commit", 999) > 30:
            tips.append("Resume recent contributions to keep your profile active and visible")

        # 4. Collaboration & open source
        if profile.get("prs_opened", 0) < 10:
            tips.append("Contribute pull requests to other repositories to demonstrate collaboration skills")

        if profile.get("prs_merged", 0) < 5:
            tips.append("Target beginner friendly open source issues to improve your pull request acceptance rate")

        if profile.get("external_contributions", 0) < 3:
            tips.append("Contribute outside your own repositories to strengthen open source credibility")

        # 5. Code quality & maturity
        if profile.get("repos_with_readme", 0) < profile.get("public_repos", 1) * 0.7:
            tips.append("Ensure most repositories include a proper README explaining setup, usage, and features")

        if profile.get("repos_with_license", 0) < 2:
            tips.append("Add open source licenses to your projects to make them easier to reuse and contribute to")

        # 6. Tech depth
        if len(profile.get("primary_languages", [])) < 2:
            tips.append("Strengthen expertise in at least two primary languages to show technical depth")

        # Strong profile case
        if not tips:
            tips.append("Your GitHub profile shows strong activity, collaboration, and project impact")
            
    elif platform == "hackerrank":

        # 1. Profile presence
        if not profile.get("profile_visible"):
            tips.append("Make your HackerRank profile public so your practice and skills are visible")

        if not profile.get("profile_completed"):
            tips.append("Complete your HackerRank profile with skills and preferences to improve credibility")

        # 2. Practice & engagement
        badges = profile.get("badge_count_estimated") or 0

        if badges == 0:
            tips.append("Start solving problems regularly to earn your first badge and build momentum")
        elif badges < 5:
            tips.append("Increase problem solving frequency to unlock more badges and show consistency")
        elif badges < 10:
            tips.append("Focus on advanced problems to move from practice to strong skill signals")

        # 3. Skill validation
        certs = profile.get("certification_count") or 0

        if certs == 0:
            tips.append("Attempt a skill certification to demonstrate validated problem solving ability")
        elif certs < 2:
            tips.append("Earning certifications in multiple domains can strengthen your skill profile")

        # 4. Growth & consistency
        if not profile.get("recent_activity_30_days"):
            tips.append("Practice consistently each month to maintain visible progress and skill retention")

        if profile.get("recent_activity_30_days") and badges < 10:
            tips.append("Convert recent practice into badge milestones by focusing on completion streaks")

        # Strong profile case
        if not tips:
            tips.append("Your HackerRank profile reflects consistent practice and solid skill development")
            
    elif platform == "geeksforgeeks":

        if not profile.get("profile_visible"):
            tips.append("Make your GeeksforGeeks profile public so your progress and practice are visible")

        problems = profile.get("problems_solved") or 0

        if problems < 50:
            tips.append("Solve problems consistently to build a strong foundation in data structures and algorithms")
        elif problems < 200:
            tips.append("Increase problem difficulty to move from practice to strong problem solving ability")
        else:
            tips.append("Maintain consistency and focus on accuracy and optimization in advanced problems")
            
        articles = profile.get("articles_contributed") or 0

        if articles == 0:
            tips.append("Writing articles on topics you understand can strengthen your conceptual clarity")
        elif articles < 5:
            tips.append("Publishing more articles can improve your teaching and explanation skills")
            
        if not profile.get("recent_activity_30_days"):
            tips.append("Practice regularly each month to maintain momentum and visible growth")

        if not tips:
            tips.append("Your GeeksforGeeks profile shows strong problem solving discipline and consistency")
    
    elif platform == "unstop":

        if not profile.get("profile_visible"):
            tips.append("Create and complete your Unstop profile to showcase participation and career readiness")

        if not profile.get("has_activity"):
            tips.append("Participate in at least one hackathon or challenge to build visibility and confidence")

        types = profile.get("participation_types", {})

        if not any(types.values()):
            tips.append("Explore hackathons, quizzes, or hiring challenges to gain exposure across formats")

        if types.get("hackathon") and not types.get("hiring_challenge"):
            tips.append("Try hiring challenges to align your skills with real company expectations")

        if not profile.get("resume_visible"):
            tips.append("Upload a well-structured resume to improve recruiter visibility on Unstop")

        if not tips:
            tips.append("Your Unstop profile reflects strong participation and career-focused engagement")
    
    elif platform == "linkedin":

        if not profile.get("profile_photo_present"):
            tips.append("Add a professional profile photo to improve profile trust and visibility")

        if not profile.get("headline_present"):
            tips.append("Write a clear headline that highlights your role, skills, and goals")

        if not profile.get("summary_present"):
            tips.append("Add a concise summary explaining what you do, what you are learning, and what you are aiming for")

        experience_count = profile.get("experience_count") or 0

        if experience_count == 0:
            tips.append("Add internships, freelance work, or personal projects as experience entries")
        elif experience_count < 2:
            tips.append("Expanding your experience section can improve recruiter confidence")

        if not profile.get("project_links_present"):
            tips.append("Link GitHub projects or live demos to show real proof of your work")

        skills = profile.get("skills_count") or 0
        if skills < 5:
            tips.append("Add relevant technical and professional skills to strengthen keyword matching")

        if not profile.get("recent_activity_30_days"):
            tips.append("Stay active by sharing learnings or updates to improve profile reach")

        if not tips:
            tips.append("Your LinkedIn profile presents a strong and well-rounded professional presence")

    else:
        tips.append("Maintain consistency and focus on improving skills through regular practice")

    return tips