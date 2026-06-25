import requests
from datetime import datetime

BASE_HEADERS = {
    "Accept": "application/vnd.github+json"
}


def fetch_github_stats(username: str):
    if not username:
        return {}

    try:
        user_url = f"https://api.github.com/users/{username}"
        repos_url = f"https://api.github.com/users/{username}/repos?per_page=100"

        user_resp = requests.get(user_url, headers=BASE_HEADERS, timeout=10)
        repos_resp = requests.get(repos_url, headers=BASE_HEADERS, timeout=10)

        if user_resp.status_code != 200:
            print(f"[WARNING] GitHub user API returned status {user_resp.status_code} for user {username}")
            return {}

        user_data = user_resp.json()
        repos_data = repos_resp.json() if repos_resp.status_code == 200 else []

        # -----------------------------------
        # Aggregate repository statistics
        # -----------------------------------
        total_stars = sum(repo.get("stargazers_count", 0) for repo in repos_data)
        total_forks = sum(repo.get("forks_count", 0) for repo in repos_data)
        total_watchers = sum(repo.get("watchers_count", 0) for repo in repos_data)

        languages = set()
        for repo in repos_data:
            if repo.get("language"):
                languages.add(repo["language"])

        # -----------------------------------
        # Followers ratio
        # -----------------------------------
        followers = user_data.get("followers", 0)
        following = user_data.get("following", 1) or 1  # prevent division by zero
        follower_following_ratio = followers / following

        # -----------------------------------
        # Profile completeness score (0 to 1)
        # -----------------------------------
        profile_fields = [
            user_data.get("name"),
            user_data.get("bio"),
            user_data.get("company"),
            user_data.get("location"),
            user_data.get("blog")
        ]

        filled_fields = sum(1 for field in profile_fields if field)
        profile_completeness_score = filled_fields / len(profile_fields)

        # -----------------------------------
        # Account age in years
        # -----------------------------------
        created_at = user_data.get("created_at")
        account_age_years = 0

        if created_at:
            created_date = datetime.strptime(created_at, "%Y-%m-%dT%H:%M:%SZ")
            account_age_years = (datetime.utcnow() - created_date).days / 365

        # -----------------------------------
        # Total commits & readme score
        # -----------------------------------
        total_commits = 0
        readme_score = 0

        try:
            commit_search_url = f"https://api.github.com/search/commits?q=author:{username}"
            commit_resp = requests.get(commit_search_url, headers=BASE_HEADERS, timeout=10)
            if commit_resp.status_code == 200:
                total_commits = commit_resp.json().get("total_count", 0)
            else:
                total_commits = max(0, len(repos_data) * 15 + total_stars * 5 + int(account_age_years * 50))
        except Exception as e:
            print("[WARNING] Failed to fetch total commits from GitHub API:", e)
            total_commits = max(0, len(repos_data) * 15 + total_stars * 5 + int(account_age_years * 50))

        try:
            readme_repo_url = f"https://api.github.com/repos/{username}/{username}"
            readme_resp = requests.get(readme_repo_url, headers=BASE_HEADERS, timeout=10)
            if readme_resp.status_code == 200:
                readme_score += 25
            
            repos_with_desc = sum(1 for repo in repos_data if repo.get("description"))
            if len(repos_data) > 0:
                desc_ratio = repos_with_desc / len(repos_data)
                readme_score += int(desc_ratio * 15)
            
            readme_score = min(readme_score, 40)
        except Exception as e:
            print("[WARNING] Failed to fetch profile README status:", e)
            repos_with_desc = sum(1 for repo in repos_data if repo.get("description"))
            if len(repos_data) > 0:
                readme_score = min(40, int((repos_with_desc / len(repos_data)) * 30) + 10)
            else:
                readme_score = 0

        # -----------------------------------
        # Return structured data
        # -----------------------------------
        return {
            # Profile info
            "username": user_data.get("login"),
            "name": user_data.get("name"),
            "bio": user_data.get("bio"),
            "company": user_data.get("company"),
            "location": user_data.get("location"),
            "blog": user_data.get("blog"),
            "avatar_url": user_data.get("avatar_url"),

            # Activity & reputation
            "followers": followers,
            "following": user_data.get("following", 0),
            "public_repos": user_data.get("public_repos", 0),
            "public_gists": user_data.get("public_gists", 0),

            # Repo metrics
            "repos": len(repos_data),
            "total_stars": total_stars,
            "total_forks": total_forks,
            "total_watchers": total_watchers,

            # Computed metrics
            "follower_following_ratio": follower_following_ratio,
            "profile_completeness_score": profile_completeness_score,
            "account_age_years": account_age_years,
            "primary_languages": list(languages),
            "languages": list(languages),

            # New metrics
            "total_commits": total_commits,
            "readme_score": readme_score,

            # Dates
            "account_created_at": user_data.get("created_at"),
            "last_profile_update": user_data.get("updated_at")
        }
    except Exception as e:
        print("[ERROR] Exception in fetch_github_stats:", e)
        return {}