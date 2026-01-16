from idanalyze.utils.http import HTTPClient
from idanalyze.utils.constants import PLATFORMS
from datetime import datetime, timezone, timedelta

client = HTTPClient()

MAX_REPOS = 20

def extract_github(username: str) -> dict:
    base = PLATFORMS["github"]["base_url"]

    user_url = base + PLATFORMS["github"]["profile"].format(username=username)
    repos_url = base + PLATFORMS["github"]["repos"].format(username=username)

    user = client.get_json(user_url) or {}
    repos = (client.get_json(repos_url) or [])[:MAX_REPOS]

    now = datetime.now(timezone.utc)

    created_at = user.get("created_at", now.isoformat())
    created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
    account_age_years = round((now - created_at).days / 365, 2)

    followers = user.get("followers", 0)
    following = user.get("following", 1)
    follower_following_ratio = round(followers / max(following, 1), 2)

    profile_completeness = sum(
        bool(user.get(field)) for field in ["bio", "company", "location", "blog", "avatar_url"]
    )

    total_stars = total_forks = total_open_issues = 0
    repos_with_stars = repos_with_forks = 0
    repos_with_license = repos_with_readme = 0
    languages_usage = {}

    for repo in repos:
        stars = repo.get("stargazers_count", 0)
        forks = repo.get("forks_count", 0)

        total_stars += stars
        total_forks += forks
        total_open_issues += repo.get("open_issues_count", 0)

        if stars > 0:
            repos_with_stars += 1
        if forks > 0:
            repos_with_forks += 1
        if repo.get("license"):
            repos_with_license += 1
        if repo.get("has_wiki"):
            repos_with_readme += 1

        lang = repo.get("language")
        if lang:
            languages_usage[lang] = languages_usage.get(lang, 0) + 1

    total_repos = max(len(repos), 1)

    primary_languages = sorted(languages_usage, key=languages_usage.get, reverse=True)[:3]

    return {
        "username": user.get("login"),
        "account_age_years": account_age_years,
        "followers": followers,
        "following": following,
        "follower_following_ratio": follower_following_ratio,
        "profile_completeness_score": profile_completeness,

        "public_repos": user.get("public_repos", 0),
        "total_stars": total_stars,
        "avg_stars_per_repo": round(total_stars / total_repos, 2),
        "total_forks": total_forks,
        "avg_forks_per_repo": round(total_forks / total_repos, 2),
        "open_issues": total_open_issues,

        "repos_with_readme": repos_with_readme,
        "repos_with_license": repos_with_license,

        "primary_languages": primary_languages,
    }