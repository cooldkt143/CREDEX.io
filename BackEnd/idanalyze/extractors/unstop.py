def extract_unstop(username: str) -> dict:
    return {
        "username": username,
        "note": "Unstop does not allow public data extraction",
        "confidence": "low"
    }
