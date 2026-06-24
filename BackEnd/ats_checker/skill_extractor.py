import re

COMMON_SKILLS = [
    "python",
    "java",
    "javascript",
    "react",
    "node",
    "mongodb",
    "mysql",
    "sql",
    "docker",
    "aws",
    "git",
    "html",
    "css",
    "typescript",
    "machine learning",
    "deep learning",
    "tensorflow",
    "pytorch",
    "pandas",
    "numpy",
    "tableau",
    "power bi",
    "excel",
    "fastapi",
    "django",
    "flask",
]

def extract_skills(text):

    text = text.lower()

    found = []

    for skill in COMMON_SKILLS:

        if re.search(
            rf"\b{re.escape(skill)}\b",
            text
        ):
            found.append(skill)

    return list(set(found))