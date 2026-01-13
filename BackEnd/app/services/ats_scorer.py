def calculate_ats_score(resume_text, jd_text):
    resume_words = set(resume_text.split())
    jd_words = set(jd_text.lower().split())

    matched = resume_words.intersection(jd_words)
    missing = jd_words - resume_words

    score = int((len(matched) / len(jd_words)) * 100) if jd_words else 0

    return {
        "ats_score": score,
        "matched_keywords": list(matched),
        "missing_keywords": list(missing),
        "matched_count": len(matched),
        "total_jd_keywords": len(jd_words)
    }
