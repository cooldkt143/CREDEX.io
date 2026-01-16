def generate_insights(score: int):
    if score >= 85:
        return {
            "level": "Elite Developer",
            "description": "Strong real world signals across platforms and projects.",
            "strengths": [
                "Consistent project work",
                "Visible professional presence",
                "Balanced developer profile",
            ],
            "tips": [
                "Start mentoring or writing technical blogs",
                "Contribute to well known open source projects",
                "Highlight impact metrics in your resume",
            ],
        }

    if score >= 70:
        return {
            "level": "Growing Professional",
            "description": "Good foundation with room for visibility improvement.",
            "strengths": [
                "Hands-on project experience",
                "Platform presence established",
            ],
            "tips": [
                "Add more deployed projects",
                "Improve GitHub README quality",
                "Showcase achievements on LinkedIn",
            ],
        }

    return {
        "level": "Early Stage Developer",
        "description": "You are building momentum. Focus on consistency.",
        "strengths": [
            "Willingness to learn",
        ],
        "tips": [
            "Build 2 to 3 solid projects",
            "Maintain a regular GitHub contribution streak",
            "Create a clear LinkedIn headline",
        ],
    }