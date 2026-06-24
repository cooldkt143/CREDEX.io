import io
import re
import pdfplumber

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity as sk_cosine_similarity

from ats_checker.skill_extractor import extract_skills


def extract_text_from_pdf(file_bytes):

    text = ""

    with pdfplumber.open(
        io.BytesIO(file_bytes)
    ) as pdf:

        for page in pdf.pages:

            page_text = page.extract_text()

            if page_text:
                text += page_text + " "

    return text


def clean_text(text):

    text = text.lower()

    text = re.sub(
        r"[^a-zA-Z0-9\s]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text


def semantic_similarity(
    resume_text,
    job_description
):
    # Use TF-IDF Vectorizer for semantic similarity
    # This avoids the need for sentence-transformers and PyTorch
    
    vectorizer = TfidfVectorizer(
        analyzer='word',
        lowercase=True,
        stop_words='english'
    )
    
    try:
        # Fit and transform the documents
        vectors = vectorizer.fit_transform([resume_text, job_description])
        
        # Calculate cosine similarity
        similarity = sk_cosine_similarity(vectors[0], vectors[1])[0][0]
        
        return similarity * 100
    except Exception as e:
        print(f"Error in semantic_similarity: {e}")
        return 0


def calculate_skill_score(
    resume_text,
    job_description
):

    resume_skills = extract_skills(
        resume_text
    )

    jd_skills = extract_skills(
        job_description
    )

    matched = list(
        set(resume_skills)
        &
        set(jd_skills)
    )

    missing = list(
        set(jd_skills)
        -
        set(resume_skills)
    )

    if len(jd_skills) == 0:
        return 0, matched, missing

    score = (
        len(matched)
        /
        len(jd_skills)
    ) * 100

    return score, matched, missing


def extract_experience_years(text):

    matches = re.findall(
        r"(\d+)\+?\s*(?:years|year)",
        text.lower()
    )

    if not matches:
        return 0

    return max(
        [int(x) for x in matches]
    )


async def analyze_resume(
    resume,
    job_description
):

    file_bytes = await resume.read()

    resume_text = extract_text_from_pdf(
        file_bytes
    )

    if not resume_text.strip():

        raise Exception(
            "Could not extract resume text"
        )

    resume_text = clean_text(
        resume_text
    )

    job_description = clean_text(
        job_description
    )

    # Semantic Similarity

    semantic_score = semantic_similarity(
        resume_text,
        job_description
    )

    # Skill Matching

    (
        skill_score,
        matched_skills,
        missing_skills
    ) = calculate_skill_score(
        resume_text,
        job_description
    )

    # Experience Matching

    resume_exp = extract_experience_years(
        resume_text
    )

    jd_exp = extract_experience_years(
        job_description
    )

    experience_score = 100

    if jd_exp > 0:

        experience_score = min(
            (resume_exp / jd_exp) * 100,
            100
        )

    # Final ATS Score

    ats_score = round(
        (
            semantic_score * 0.50
            +
            skill_score * 0.35
            +
            experience_score * 0.15
        ),
        2
    )

    return {
        "ats_score": ats_score,
        "semantic_score": round(
            semantic_score,
            2
        ),
        "skill_score": round(
            skill_score,
            2
        ),
        "experience_score": round(
            experience_score,
            2
        ),
        "matched_keywords":
        matched_skills,
        "missing_keywords":
        missing_skills
    }