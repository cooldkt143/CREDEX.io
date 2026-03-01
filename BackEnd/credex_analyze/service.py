import os
from .github_api import fetch_github_stats
from .resume_parser import (
    extract_details,
    extract_text_from_pdf,
    extract_text_from_docx
)
from .linkedin_api import fetch_linkedin_data
from .scoring import calculate_credex_score
from .tips import generate_insights
from .scorecard import generate_share_text


# -------------------------------
# Helper: Extract GitHub Username
# -------------------------------

def extract_github_username(github_profile):
    if not github_profile:
        return None

    # If username directly provided
    if getattr(github_profile, "username", None):
        return github_profile.username.strip()

    # If full GitHub link provided
    if getattr(github_profile, "link", None):
        link = github_profile.link.strip().rstrip("/")
        if "github.com" in link:
            return link.split("/")[-1]

    return None


# -------------------------------
# Helper: Extract LinkedIn Link
# -------------------------------

def extract_linkedin_link(linkedin_profile):
    if not linkedin_profile:
        return None

    if getattr(linkedin_profile, "link", None):
        return linkedin_profile.link.strip()

    return None


# -------------------------------
# Helper: Extract Resume Text
# -------------------------------
def extract_resume_text(data):
    """
    Extract resume text from:
    - FastAPI UploadFile
    - Saved file path
    - Raw resume text
    """

    resume_text = ""

    resume_file = getattr(data, "resume_file", None)

    # -----------------------------
    # CASE 1: FastAPI UploadFile
    # -----------------------------
    if resume_file and hasattr(resume_file, "file"):
        filename = resume_file.filename.lower()

        try:
            if filename.endswith(".pdf"):
                import pdfplumber
                with pdfplumber.open(resume_file.file) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            resume_text += page_text + "\n"

            elif filename.endswith(".docx"):
                import docx
                document = docx.Document(resume_file.file)
                resume_text = "\n".join(p.text for p in document.paragraphs)

            print(f"[INFO] Extracted resume from UploadFile ({len(resume_text)} chars)")

        except Exception as e:
            print("[ERROR] Failed reading UploadFile:", e)

    # -----------------------------
    # CASE 2: If resume_file is string path
    # -----------------------------
    elif isinstance(resume_file, str):
        file_path = resume_file.strip()

        if file_path.lower().endswith(".pdf"):
            resume_text = extract_text_from_pdf(file_path)

        elif file_path.lower().endswith(".docx"):
            resume_text = extract_text_from_docx(file_path)

    # -----------------------------
    # CASE 3: Fallback raw text
    # -----------------------------
    if not resume_text:
        resume_text = getattr(data, "resume_text", "") or ""

    return resume_text


# -------------------------------
# Main Profile Analyzer
# -------------------------------

def analyze_profile(data):

    # -------------------------------
    # Extract GitHub & LinkedIn
    # -------------------------------

    github_username = extract_github_username(getattr(data, "github", None))
    linkedin_link = extract_linkedin_link(getattr(data, "linkedin", None))

    github_data = fetch_github_stats(github_username) if github_username else {}
    linkedin_data = fetch_linkedin_data(linkedin_link) if linkedin_link else {}

    print("Extracted GitHub Username:", github_username)
    print("Extracted LinkedIn Link:", linkedin_link)

    # -------------------------------
    # Extract Resume Text Properly
    # -------------------------------

    resume_text = extract_resume_text(data)

    if not resume_text:
        print("[WARNING] No resume content found!")

    # -------------------------------
    # Parse Resume
    # -------------------------------

    resume_data = extract_details(resume_text)

    # -------------------------------
    # Calculate Score
    # -------------------------------

    score_result = calculate_credex_score(
        data,
        github_data,
        linkedin_data,
        resume_data
    )

    final_score = score_result.get("score", 0)
    breakdown = score_result.get("breakdown", {})

    # -------------------------------
    # Generate Insights
    # -------------------------------

    insights = generate_insights(
        total_score=final_score,
        experience_score=breakdown.get("experience", 0),
        resume_score=breakdown.get("resume", 0),
        project_score=breakdown.get("projects", 0),
        github_score=breakdown.get("github", 0),
        linkedin_score=breakdown.get("linkedin", 0)
    )

    # -------------------------------
    # Return Final Result
    # -------------------------------

    return {
        "credex_score": final_score,
        "level": insights.get("level", "Developer"),
        "description": insights.get("description", ""),
        "strengths": insights.get("strengths", []),
        "improvement_tips": insights.get("tips", []),
        "share_text": generate_share_text(
            getattr(data, "fullName", "Developer"),
            final_score,
            insights.get("level", "Developer")
        ),
    }