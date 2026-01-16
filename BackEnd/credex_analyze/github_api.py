import requests

GITHUB_TOKEN = "YOUR_PERSONAL_ACCESS_TOKEN"  # Set as env variable

def fetch_github_stats(username: str):
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    user_url = f"https://api.github.com/users/{username}"
    repos_url = f"https://api.github.com/users/{username}/repos?per_page=100"
    
    user_resp = requests.get(user_url, headers=headers).json()
    repos_resp = requests.get(repos_url, headers=headers).json()

    total_stars = sum(repo.get("stargazers_count", 0) for repo in repos_resp)
    total_forks = sum(repo.get("forks_count", 0) for repo in repos_resp)
    repo_count = len(repos_resp)
    languages = list({repo.get("language") for repo in repos_resp if repo.get("language")})

    return {
        "name": user_resp.get("name"),
        "followers": user_resp.get("followers"),
        "repos": repo_count,
        "stars": total_stars,
        "forks": total_forks,
        "languages": languages,
    }