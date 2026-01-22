import requests

BASE_HEADERS = {
    "Accept": "application/vnd.github+json"
}

def fetch_github_stats(username: str):
    user_url = f"https://api.github.com/users/{username}"
    repos_url = f"https://api.github.com/users/{username}/repos?per_page=100"

    user_resp = requests.get(user_url, headers=BASE_HEADERS)
    repos_resp = requests.get(repos_url, headers=BASE_HEADERS)

    if user_resp.status_code != 200:
        raise ValueError("Invalid GitHub username or rate limit exceeded")

    user_data = user_resp.json()
    repos_data = repos_resp.json() if repos_resp.status_code == 200 else []

    # --- Aggregate repo level stats ---
    total_stars = sum(repo.get("stargazers_count", 0) for repo in repos_data)
    total_forks = sum(repo.get("forks_count", 0) for repo in repos_data)
    total_watchers = sum(repo.get("watchers_count", 0) for repo in repos_data)

    languages = set()
    for repo in repos_data:
        if repo.get("language"):
            languages.add(repo["language"])

    # --- Extract useful variables ---
    return {
        # Profile info
        "username": user_data.get("login"),
        "name": user_data.get("name"),
        "bio": user_data.get("bio"),
        "company": user_data.get("company"),
        "location": user_data.get("location"),
        "blog": user_data.get("blog"),

        # Activity & reputation
        "followers": user_data.get("followers", 0),
        "following": user_data.get("following", 0),
        "public_repos": user_data.get("public_repos", 0),
        "public_gists": user_data.get("public_gists", 0),

        # Repo metrics
        "repo_count": len(repos_data),
        "total_stars": total_stars,
        "total_forks": total_forks,
        "total_watchers": total_watchers,

        # Tech stack
        "languages": list(languages),

        # Dates
        "account_created_at": user_data.get("created_at"),
        "last_profile_update": user_data.get("updated_at")
    }