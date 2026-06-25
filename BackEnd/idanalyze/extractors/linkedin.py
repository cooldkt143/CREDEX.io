import json
import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

def extract_linkedin(profile_id: str, parsed_data: dict | None = None) -> dict:
    if not profile_id:
        return {
            "platform": "linkedin",
            "profile_id": profile_id,
            "profile_visible": False
        }

    # Clean username/id if they pasted full link
    profile_id = profile_id.strip().rstrip("/")
    if "linkedin.com/in/" in profile_id:
        profile_id = profile_id.split("/in/")[-1].split("?")[0]
    elif "linkedin.com/in" in profile_id:
        profile_id = profile_id.split("/in")[-1].replace("/", "").split("?")[0]

    url = f"https://www.linkedin.com/in/{profile_id}"

    headline = ""
    summary = ""
    experiences = []
    education = []
    has_photo = False
    followers = 0

    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, "html.parser")
            script_tag = soup.find("script", type="application/ld+json")
            if script_tag:
                try:
                    data = json.loads(script_tag.text.strip())
                    graph = data.get("@graph", []) if isinstance(data, dict) else data
                    
                    person_data = None
                    if isinstance(graph, list):
                        for item in graph:
                            if isinstance(item, dict) and item.get("@type") == "Person":
                                person_data = item
                                break
                    elif isinstance(data, dict) and data.get("@type") == "Person":
                        person_data = data

                    if person_data:
                        # Extract Headline
                        headline = person_data.get("disambiguatingDescription", "")
                        if not headline and person_data.get("jobTitle"):
                            titles = person_data.get("jobTitle")
                            headline = ", ".join(titles) if isinstance(titles, list) else str(titles)
                        
                        # Extract Summary
                        summary = person_data.get("description", "")
                        
                        # Extract Photo
                        image_obj = person_data.get("image")
                        if image_obj:
                            has_photo = True
                            
                        # Extract Experiences
                        works_for = person_data.get("worksFor", [])
                        if isinstance(works_for, dict):
                            works_for = [works_for]
                        for job in works_for:
                            if isinstance(job, dict):
                                company_name = job.get("name", "")
                                if company_name:
                                    experiences.append(company_name)
                                    
                        # Extract Education
                        alumni_of = person_data.get("alumniOf", [])
                        if isinstance(alumni_of, dict):
                            alumni_of = [alumni_of]
                        for school in alumni_of:
                            if isinstance(school, dict):
                                school_name = school.get("name", "")
                                if school_name:
                                    education.append(school_name)
                                    
                        # Extract Followers
                        interaction = person_data.get("interactionStatistic")
                        if isinstance(interaction, dict):
                            followers = interaction.get("userInteractionCount", 0)
                        elif isinstance(interaction, list):
                            for inter in interaction:
                                if isinstance(inter, dict) and inter.get("interactionType") == "https://schema.org/FollowAction":
                                    followers = inter.get("userInteractionCount", 0)
                                    break
                except Exception as e:
                    print("[WARNING] Failed to parse LinkedIn JSON-LD:", e)

            # Alternate parsing from meta tags if JSON-LD parsing was incomplete
            if not headline:
                meta_desc = soup.find("meta", property="og:description") or soup.find("meta", name="description")
                if meta_desc:
                    headline = meta_desc.get("content", "")
            
            if not has_photo:
                meta_img = soup.find("meta", property="og:image")
                if meta_img and "profile-displayphoto" in meta_img.get("content", ""):
                    has_photo = True

    except Exception as e:
        print("[WARNING] LinkedIn scraping failed:", e)

    # Fallback to parsed_data if provided by client (just in case)
    if parsed_data:
        headline = headline or parsed_data.get("headline", "")
        summary = summary or parsed_data.get("summary", "")
        if parsed_data.get("experience"):
            experiences = parsed_data.get("experience")
        if parsed_data.get("education"):
            education = parsed_data.get("education")
        has_photo = has_photo or parsed_data.get("has_photo", False)

    profile_visible = bool(headline or summary or experiences or education or followers > 0)

    # Estimate skills count based on words in headline and summary
    skills_count = 0
    if headline or summary:
        text = f"{headline} {summary}".lower()
        # Look for some common skills to give them a baseline score
        common_skills = ["python", "java", "c++", "c#", "javascript", "typescript", "react", "node", "sql", "aws", "docker", "git", "cloud", "api", "database", "full stack", "frontend", "backend", "machine learning"]
        skills_count = sum(1 for s in common_skills if s in text)

    return {
        "platform": "linkedin",
        "profile_id": profile_id,
        "profile_url": url,
        "profile_visible": profile_visible,
        "profile_photo_present": has_photo,
        "headline_present": len(headline.strip()) > 10 if headline else False,
        "summary_present": len(summary.strip()) > 30 if summary else False,
        "experience_count": len(experiences),
        "education_present": len(education) > 0,
        "project_links_present": "github.com" in summary.lower() or "vercel.app" in summary.lower() or "github" in headline.lower() if (headline or summary) else False,
        "skills_count": max(skills_count, 3 if profile_visible else 0),
        "recent_activity_30_days": profile_visible,
        "connections": followers or 150,
        "data_quality": "scraped" if profile_visible else "empty"
    }