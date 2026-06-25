import io
import re
import os
import json
import requests
import pdfplumber
from dotenv import load_dotenv

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity as sk_cosine_similarity

from ats_checker.skill_extractor import extract_skills

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL_LLM = "meta-llama/llama-3.1-8b-instruct"

# Lazy-loaded HF models
_bge_model = None
_ner_pipeline = None

def get_bge_model():
    global _bge_model
    if _bge_model is None:
        try:
            from sentence_transformers import SentenceTransformer
            print("Loading BAAI/bge-base-en-v1.5 model...")
            _bge_model = SentenceTransformer('BAAI/bge-base-en-v1.5')
        except Exception as e:
            print(f"Error loading BAAI/bge-base-en-v1.5: {e}")
    return _bge_model

def get_ner_pipeline():
    global _ner_pipeline
    if _ner_pipeline is None:
        try:
            from transformers import pipeline
            print("Loading dslim/bert-base-NER pipeline...")
            _ner_pipeline = pipeline("ner", model="dslim/bert-base-NER")
        except Exception as e:
            print(f"Error loading dslim/bert-base-NER: {e}")
    return _ner_pipeline


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


def generate_llm_quality_scores(resume_text, word_count, sections_found):
    if not OPENROUTER_API_KEY:
        return None
        
    prompt = f"""
    You are an expert resume reviewer and ATS quality assessor.
    Analyze the following resume text:
    
    --- RESUME TEXT ---
    {resume_text[:4000]}
    -------------------
    
    Based on the text, grade the resume in two specific areas:
    1. "impact_score" (out of 25): How strong, achievement-oriented, and active the language is (use of action verbs, avoiding passive tasks).
    2. "metrics_score" (out of 25): The presence and effectiveness of quantified results (percentages, revenue, latency, size, scale, savings).
    
    Programmatic stats for context:
    - Word count: {word_count}
    - Standard sections found: {sections_found}
    
    Return ONLY a JSON object in this format:
    {{
        "impact_score": <int 0-25>,
        "metrics_score": <int 0-25>,
        "suggestions": [
            "Actionable suggestion 1",
            "Actionable suggestion 2"
        ]
    }}
    """
    
    for attempt in range(2):
        try:
            response = requests.post(
                OPENROUTER_URL,
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": MODEL_LLM,
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a strict resume grading assistant. You must return strictly valid JSON matching the schema. No explanations, no markdown blocks.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.2,
                },
                timeout=25,
            )

            if response.status_code == 200:
                result = response.json()
                raw_content = result["choices"][0]["message"]["content"]
                cleaned = raw_content.replace("```json", "").replace("```", "").strip()
                match = re.search(r"\{.*\}", cleaned, re.DOTALL)
                if match:
                    parsed = json.loads(match.group(0))
                    impact_score = parsed.get("impact_score", 12)
                    metrics_score = parsed.get("metrics_score", 12)
                    impact_score = max(0, min(25, int(impact_score)))
                    metrics_score = max(0, min(25, int(metrics_score)))
                    suggestions = parsed.get("suggestions", [])
                    return {
                        "impact_score": impact_score,
                        "metrics_score": metrics_score,
                        "suggestions": suggestions
                    }
        except Exception as e:
            print(f"OpenRouter resume quality grading attempt {attempt+1} failed: {e}")
            
    return None


def calculate_intrinsic_resume_score(resume_text, cleaned_text):
    # 1. Structure Check (max 30 points)
    sections = {
        "experience": r"\b(?:experience|employment|work history|professional history|professional background|career history|work experience)\b",
        "education": r"\b(?:education|academic|university|college|degrees|academic background)\b",
        "skills": r"\b(?:skills|technologies|technical skills|expertise|competencies|strengths)\b",
        "projects": r"\b(?:projects|key projects|personal projects|academic projects|portfolio)\b",
        "summary": r"\b(?:summary|objective|profile|about me|professional summary)\b"
    }
    
    sections_found = []
    sections_missing = []
    structure_score = 0
    
    for section_name, pattern in sections.items():
        if re.search(pattern, resume_text.lower()):
            sections_found.append(section_name)
            structure_score += 6
        else:
            sections_missing.append(section_name)
            
    # Programmatic fallbacks for action verbs and metrics
    action_verbs = [
        "led", "developed", "managed", "designed", "created", "built", 
        "implemented", "optimized", "improved", "increased", "decreased", 
        "spearheaded", "engineered", "collaborated", "achieved", "executed", 
        "architected", "delivered", "mentored", "streamlined", "solved", 
        "formulated", "coordinated", "initiated"
    ]
    verb_count = 0
    for verb in action_verbs:
        verb_count += len(re.findall(rf"\b{verb}\b", cleaned_text))
            
    if verb_count >= 10:
        prog_impact_score = 25
    elif verb_count >= 6:
        prog_impact_score = 18
    elif verb_count >= 3:
        prog_impact_score = 12
    elif verb_count >= 1:
        prog_impact_score = 6
    else:
        prog_impact_score = 0
        
    metric_patterns = [
        r"\b\d+(?:\.\d+)?%",             # Percentages
        r"\$\s*\d+(?:\.\d+)?",           # Dollar amounts
        r"\b\d+\s*x\b",                  # X scale
        r"\b\d+(?:\.\d+)?\s*(?:k|m|b)\b",# K, M, B abbreviations
        r"\b\d+\+\s*(?:users|clients|projects|developers|percent|months|years)\b"
    ]
    metric_count = 0
    for pattern in metric_patterns:
        metric_count += len(re.findall(pattern, resume_text.lower()))
    all_numbers = re.findall(r"\b\d+\b", resume_text)
    non_year_numbers = [num for num in all_numbers if not (len(num) == 4 and (num.startswith("19") or num.startswith("20")))]
    metric_count += len(non_year_numbers)
    
    if metric_count >= 5:
        prog_metrics_score = 25
    elif metric_count >= 3:
        prog_metrics_score = 18
    elif metric_count >= 1:
        prog_metrics_score = 10
    else:
        prog_metrics_score = 0

    # 4. Resume Length & Formatting (max 10 points)
    words = resume_text.split()
    word_count = len(words)
    
    if 450 <= word_count <= 950:
        length_score = 10
    elif 300 <= word_count < 450 or 950 < word_count <= 1400:
        length_score = 7
    elif 150 <= word_count < 300 or 1400 < word_count <= 1800:
        length_score = 4
    else:
        length_score = 1

    # 5. Contact Info & Professional Profile (max 10 points)
    contact_score = 0
    has_email = False
    has_phone = False
    has_links = False
    
    if re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", resume_text):
        contact_score += 4
        has_email = True
    if re.search(r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b", resume_text):
        contact_score += 3
        has_phone = True
    if any(domain in resume_text.lower() for domain in ["linkedin.com", "github.com", "portfolio", "personal website", "behance.net", "gitlab.com"]):
        contact_score += 3
        has_links = True

    # Attempt to query LLM for qualitative grading
    llm_grading = generate_llm_quality_scores(resume_text, word_count, sections_found)
    
    if llm_grading:
        impact_score = llm_grading["impact_score"]
        metrics_score = llm_grading["metrics_score"]
        suggestions = llm_grading["suggestions"]
    else:
        # Fallback to programmatic scores and rules
        impact_score = prog_impact_score
        metrics_score = prog_metrics_score
        suggestions = []
        if "experience" not in sections_found:
            suggestions.append("Add a Work Experience section to showcase your professional history.")
        if "education" not in sections_found:
            suggestions.append("Add an Education section to list your academic credentials.")
        if "skills" not in sections_found:
            suggestions.append("Add a dedicated Skills section to list your core competencies.")
        if "projects" not in sections_found:
            suggestions.append("Add a Projects section to highlight relevant personal or professional work.")
        if "summary" not in sections_found:
            suggestions.append("Add a brief Professional Summary or Objective at the top of your resume.")
        if verb_count < 6:
            suggestions.append("Use more strong action verbs (e.g. 'designed', 'optimized', 'engineered') to describe your achievements.")
        if metric_count < 3:
            suggestions.append("Quantify your achievements by adding concrete numbers, percentages, or dollar values.")
            
    # Add general formatting warnings
    if word_count < 300:
        suggestions.append("Your resume seems brief. Consider expanding your descriptions to provide more context about your contributions.")
    elif word_count > 1200:
        suggestions.append("Your resume is quite long. Consider condensing it to keep it focused and concise (ideal is 450-900 words).")
    if not has_email:
        suggestions.append("Provide a professional email address for contact information.")
    if not has_phone:
        suggestions.append("Include a contact phone number.")
    if not has_links:
        suggestions.append("Add a link to your LinkedIn profile, GitHub, or online portfolio.")

    total_score = structure_score + impact_score + metrics_score + length_score + contact_score
    
    return {
        "score": round(total_score, 2),
        "structure_score": structure_score,
        "impact_score": impact_score,
        "metrics_score": metrics_score,
        "length_score": length_score,
        "contact_score": contact_score,
        "suggestions": list(set(suggestions)),
        "details": {
            "sections_found": sections_found,
            "sections_missing": sections_missing,
            "word_count": word_count,
            "verb_count": verb_count,
            "metric_count": metric_count,
            "has_email": has_email,
            "has_phone": has_phone,
            "has_links": has_links
        }
    }


def extract_ner_entities(text):
    nlp = get_ner_pipeline()
    if not nlp:
        return []
    
    # Process chunks of 1000 characters to prevent max sequence length errors on long resumes
    chunk_size = 1000
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    
    extracted = set()
    for chunk in chunks:
        try:
            results = nlp(chunk)
            for res in results:
                word = res.get("word", "")
                entity_type = res.get("entity", "")
                clean_word = word.replace("##", "").strip()
                if len(clean_word) > 1 and entity_type in ["B-ORG", "I-ORG", "B-MISC", "I-MISC"]:
                    extracted.add(clean_word.lower())
        except Exception as e:
            print(f"Error in NER processing: {e}")
            
    return list(extracted)


def semantic_similarity_hf(resume_text, job_description):
    model = get_bge_model()
    if not model:
        # Fallback to TF-IDF similarity
        return semantic_similarity(resume_text, job_description)
    
    try:
        from sentence_transformers import util
        embeddings = model.encode([resume_text, job_description], normalize_embeddings=True)
        similarity = util.cos_sim(embeddings[0], embeddings[1]).item()
        # Scale to 0-100 (util.cos_sim value ranges from -1 to 1; BGE matches typically range from 0.4 to 0.9)
        normalized_score = max(0.0, min(100.0, (similarity - 0.4) * (100.0 / 0.5)))
        return normalized_score
    except Exception as e:
        print(f"Error calculating HuggingFace similarity: {e}")
        return semantic_similarity(resume_text, job_description)


def generate_llm_feedback(resume_text, job_description=None, mode="resume"):
    if not OPENROUTER_API_KEY:
        print("Warning: OPENROUTER_API_KEY is missing. Skipping LLM feedback.")
        return None
        
    if mode == "resume":
        prompt = f"""
        You are an expert ATS (Applicant Tracking System) parser and resume optimizer.
        Analyze the following resume text:
        
        --- RESUME TEXT ---
        {resume_text[:4000]}
        -------------------
        
        Generate a list of 4-6 specific, highly actionable improvements for this resume to make it more professional, reader-friendly, and impactful. Focus on structure, actions verbs, quantified achievements, and profile links.
        Return ONLY a JSON object in this format:
        {{
            "suggestions": [
                "Detailed suggestion 1",
                "Detailed suggestion 2",
                "Detailed suggestion 3"
            ]
        }}
        """
    else:
        prompt = f"""
        You are an expert ATS (Applicant Tracking System) parser and resume optimizer.
        Compare the resume text with the target job description below:
        
        --- RESUME TEXT ---
        {resume_text[:4000]}
        -------------------
        
        --- JOB DESCRIPTION ---
        {job_description[:3000]}
        ------------------------
        
        Identify gaps, missing technical skills/keywords, and formatting issues.
        Generate a list of 5-7 specific, highly actionable improvements for this resume to align it perfectly with the target role.
        Return ONLY a JSON object in this format:
        {{
            "suggestions": [
                "Detailed suggestion 1",
                "Detailed suggestion 2",
                "Detailed suggestion 3"
            ]
        }}
        """

    for attempt in range(2):
        try:
            response = requests.post(
                OPENROUTER_URL,
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": MODEL_LLM,
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a strict resume advisor. You must return strictly valid JSON matching the schema. No explanations, no markdown blocks.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.3,
                },
                timeout=25,
            )

            if response.status_code == 200:
                result = response.json()
                raw_content = result["choices"][0]["message"]["content"]
                cleaned = raw_content.replace("```json", "").replace("```", "").strip()
                match = re.search(r"\{.*\}", cleaned, re.DOTALL)
                if match:
                    parsed = json.loads(match.group(0))
                    if isinstance(parsed.get("suggestions"), list) and len(parsed["suggestions"]) > 0:
                        return parsed["suggestions"]
        except Exception as e:
            print(f"OpenRouter feedback attempt {attempt+1} failed: {e}")
            
    return None


async def analyze_resume(
    resume,
    job_description="",
    mode="resume"
):

    file_bytes = await resume.read()

    resume_text = extract_text_from_pdf(
        file_bytes
    )

    if not resume_text.strip():
        raise Exception(
            "Could not extract resume text"
        )

    cleaned_resume = clean_text(
        resume_text
    )

    # Intrinsic Quality Score
    intrinsic_result = calculate_intrinsic_resume_score(resume_text, cleaned_resume)

    # Skill candidate extraction (Regex + NER pipeline merge)
    regex_skills = extract_skills(cleaned_resume)
    ner_entities = extract_ner_entities(cleaned_resume)
    
    # Filter and merge NER entities that are valid skill candidates
    merged_skills = set(regex_skills)
    for entity in ner_entities:
        clean_ent = re.sub(r'[^a-z0-9 ]', '', entity).strip()
        if 2 <= len(clean_ent) <= 15 and not clean_ent.isdigit():
            merged_skills.add(clean_ent)
    resume_skills = list(merged_skills)

    # Generate LLM Feedback
    llm_suggestions = generate_llm_feedback(resume_text, job_description, mode)

    if mode == "resume" or not job_description.strip():
        suggestions = llm_suggestions if llm_suggestions else intrinsic_result["suggestions"]
        return {
            "ats_score": intrinsic_result["score"],
            "semantic_score": round(intrinsic_result["metrics_score"] * 4, 2),
            "skill_score": round(intrinsic_result["structure_score"] * 3.33, 2),
            "experience_score": round(intrinsic_result["contact_score"] * 10, 2),
            "matched_keywords": resume_skills,
            "missing_keywords": [],
            "suggestions": suggestions,
            "details": intrinsic_result
        }

    # Job Match Mode
    cleaned_jd = clean_text(
        job_description
    )

    # Semantic Similarity (BAAI/bge-base-en-v1.5)
    semantic_score = semantic_similarity_hf(
        cleaned_resume,
        cleaned_jd
    )

    # Skill Matching
    (
        skill_score,
        matched_skills,
        missing_skills
    ) = calculate_skill_score(
        cleaned_resume,
        cleaned_jd
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

    # Calculate job match score (weights: 40% similarity, 40% skills, 20% experience)
    job_match_score = (
        semantic_score * 0.40
        +
        skill_score * 0.40
        +
        experience_score * 0.20
    )

    # Combine intrinsic score (30%) & job match score (70%)
    ats_score = round(
        (
            intrinsic_result["score"] * 0.30
            +
            job_match_score * 0.70
        ),
        2
    )

    # Combine suggestions
    suggestions = []
    if llm_suggestions:
        suggestions = llm_suggestions
    else:
        # Fallback to python custom templates
        if skill_score < 50:
            suggestions.append("Your resume is missing key technical skills requested in the job description.")
        if experience_score < 70 and jd_exp > 0:
            suggestions.append(f"The job requires about {jd_exp} years of experience, while your resume indicates about {resume_exp} years.")
        suggestions.extend(intrinsic_result["suggestions"])

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
        missing_skills,
        "suggestions": suggestions,
        "details": intrinsic_result
    }