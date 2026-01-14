def generate_score(platform: str, profile: dict) -> int:
    score = 0

    if platform == "github":
        score += min(profile.get("followers", 0), 30)
        score += min(profile.get("stars", 0) // 5, 40)
        score += min(profile.get("public_repos", 0) * 2, 30)

    elif platform == "geeksforgeeks":
        score = 60

    elif platform == "hackerrank":
        score = 55

    return min(score, 100)