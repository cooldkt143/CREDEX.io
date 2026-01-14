def extract_linkedin(profile_id: str) -> dict:
    return {
        "profile_id": profile_id,
        "note": "LinkedIn requires OAuth or manual data",
        "confidence": "user-provided"
    }