import re
import pdfplumber
import docx


# -------------------------------
# FILE READERS
# -------------------------------

def extract_text_from_pdf(file_path):
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print("PDF Read Error:", e)
    return text


def extract_text_from_docx(file_path):
    text = ""
    try:
        document = docx.Document(file_path)
        text = "\n".join(p.text for p in document.paragraphs)
    except Exception as e:
        print("DOCX Read Error:", e)
    return text


# -------------------------------
# BASIC EXTRACTORS
# -------------------------------

def extract_name(text):
    lines = text.split("\n")
    for line in lines[:5]:
        line = line.strip()
        if len(line.split()) >= 2 and not any(char.isdigit() for char in line):
            return line
    return "Unknown"


def extract_email(text):
    match = re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)
    return match.group(0) if match else ""


def extract_phone(text):
    match = re.search(r"\+?\d[\d\s\-]{8,15}", text)
    return match.group(0) if match else ""


def extract_linkedin(text):
    match = re.search(r"(https?:\/\/)?(www\.)?linkedin\.com\/[^\s]+", text)
    return match.group(0) if match else ""


def extract_github(text):
    match = re.search(r"(https?:\/\/)?(www\.)?github\.com\/[^\s]+", text)
    return match.group(0) if match else ""


# -------------------------------
# SKILLS EXTRACTION
# -------------------------------

COMMON_SKILLS = [
    # Languages
    "python", "java", "c++", "c#", "c", "javascript", "typescript", "go", "golang", "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "solidity", "dart", "shell", "bash",
    # Frontend
    "react", "angular", "vue", "svelte", "next.js", "nextjs", "nuxt", "gatsby", "html", "css", "sass", "tailwind", "bootstrap", "redux", "jquery", "flutter", "react native",
    # Backend & Frameworks
    "node", "nodejs", "express", "django", "flask", "fastapi", "spring", "spring boot", "laravel", "asp.net", "nest.js", "nestjs", "rails", "graphql", "rest api", "microservices",
    # Databases
    "sql", "mysql", "postgresql", "postgres", "sqlite", "mongodb", "redis", "cassandra", "oracle", "mariadb", "elasticsearch", "firebase", "dynamodb",
    # DevOps, Cloud & Tools
    "git", "docker", "kubernetes", "k8s", "aws", "azure", "gcp", "google cloud", "ci/cd", "jenkins", "github actions", "terraform", "ansible", "linux", "nginx", "heroku",
    # Machine Learning & Data
    "machine learning", "deep learning", "nlp", "computer vision", "pytorch", "tensorflow", "keras", "scikit-learn", "pandas", "numpy", "data analysis", "spark", "hadoop"
]

def extract_skills(text):
    found = []
    text_lower = text.lower()
    
    def has_skill(txt, sk):
        if len(sk) <= 3:
            # Match short skills with custom boundary regex to avoid substring matching (e.g. 'c' matching 'education')
            escaped = re.escape(sk)
            pattern = rf"(?:^|[^a-zA-Z0-9#\+]){escaped}(?:$|[^a-zA-Z0-9#\+])"
            return bool(re.search(pattern, txt))
        else:
            return sk in txt

    for skill in COMMON_SKILLS:
        if has_skill(text_lower, skill):
            # Normalize display for specific aliases/variations
            if skill == "golang":
                found.append("go")
            elif skill == "nodejs":
                found.append("node")
            elif skill == "nextjs":
                found.append("next.js")
            elif skill == "nestjs":
                found.append("nest.js")
            elif skill == "postgres":
                found.append("postgresql")
            elif skill == "k8s":
                found.append("kubernetes")
            else:
                found.append(skill)
                
    return list(set(found))


# -------------------------------
# SECTION PARSER
# -------------------------------

def extract_section(text, keywords):
    pattern = "|".join(keywords)
    match = re.search(rf"({pattern})(.*?)(\n[A-Z][A-Za-z ]+\n|$)", text, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(2).strip()
    return ""


# -------------------------------
# Education EXTRACTION
# -------------------------------
def count_education_entries(education_text):
    if not education_text:
        return 0

    lines = [line.strip() for line in education_text.split("\n") if line.strip()]
    
    # 1. Look for specific degree keywords (each represents an entry)
    degree_keywords = [
        r"\bb\.?\s?tech\b", r"\bm\.?\s?tech\b", r"\bb\.?\s?s\b", r"\bm\.?\s?s\b",
        r"\bbachelor\b", r"\bmaster\b", r"\bph\.?d\b", r"\bdiploma\b", r"\bdegree\b"
    ]
    
    degree_count = 0
    for line in lines:
        if any(re.search(kw, line.lower()) for kw in degree_keywords):
            degree_count += 1
            
    if degree_count > 0:
        return degree_count

    # 2. Fallback to university/college keywords if no degree keywords matched
    institution_keywords = [r"\buniversity\b", r"\bcollege\b", r"\bschool\b", r"\binstitute\b"]
    inst_count = 0
    for line in lines:
        if any(re.search(kw, line.lower()) for kw in institution_keywords):
            inst_count += 1
            
    if inst_count > 0:
        return inst_count

    # 3. Fallback to double newline blocks
    blocks = [block.strip() for block in education_text.split("\n\n") if block.strip()]
    count = 0
    for block in blocks:
        block_lines = [l for l in block.split("\n") if l.strip()]
        if len(block_lines) >= 2:
            count += 1

    return count if count > 0 else (1 if lines else 0)


# -------------------------------
# Project EXTRACTION
# -------------------------------
def count_projects(project_text):
    if not project_text:
        return 0

    # Let's split by blocks first
    blocks = [block.strip() for block in project_text.split("\n\n") if block.strip()]
    
    # If there are multiple blocks, count how many have bullets or look like projects
    if len(blocks) > 1:
        count = sum(1 for block in blocks if any(bullet in block for bullet in ("•", "-", "*", "✅")))
        if count > 0:
            return count
        return len(blocks)

    # If there's only one block, let's analyze the lines
    lines = [line.strip() for line in project_text.split("\n") if line.strip()]
    
    # Check if lines look like separate projects (e.g. starting with bullets and containing colons or project keywords)
    bullet_projects = 0
    for line in lines:
        if line.startswith(("•", "-", "*", "✅")):
            if ":" in line or any(kw in line.lower() for kw in ["project", "app", "system", "platform", "website", "tool"]):
                bullet_projects += 1
                
    if bullet_projects > 0:
        return bullet_projects
        
    # Fallback to estimation based on bullet count if they exist
    bullet_count = sum(1 for line in lines if line.startswith(("•", "-", "*", "✅")))
    if bullet_count > 0:
        return max(1, round(bullet_count / 3))

    return 1 if lines else 0


# -------------------------------
# Experience EXTRACTION
# -------------------------------
def count_experience_entries(experience_text):
    if not experience_text:
        return 0

    lines = [line.strip() for line in experience_text.split("\n") if line.strip()]
    
    # 1. Count date ranges (most reliable indicator of separate jobs)
    range_pattern = r"\b(?:19|20)\d{2}\s*[-–—]\s*(?:(?:19|20)\d{2}|present|current|now)\b"
    count = sum(1 for line in lines if re.search(range_pattern, line.lower()))
    if count > 0:
        return count

    # 2. Count lines with single years if no ranges found
    year_pattern = r"\b(19|20)\d{2}\b"
    count = sum(1 for line in lines if re.search(year_pattern, line))
    if count > 0:
        return count

    # 3. Fallback to double-newline blocks containing year pattern
    blocks = [block.strip() for block in experience_text.split("\n\n") if block.strip()]
    for block in blocks:
        if re.search(year_pattern, block):
            count += 1

    return count if count > 0 else (1 if lines else 0)


# -------------------------------
# MAIN PARSER
# -------------------------------

def extract_details(text):

    print("\n==============================")
    print("DEBUG: STARTING EXTRACTION")
    print("==============================")
    print("Resume text length:", len(text))

    if not text or len(text) < 50:
        print("WARNING: Resume text too short!")

    name = extract_name(text)
    email = extract_email(text)
    phone = extract_phone(text)
    linkedin = extract_linkedin(text)
    github = extract_github(text)
    skills = extract_skills(text)

    education = extract_section(text, ["Education"])
    experience = extract_section(text, ["Experience", "Work Experience"])
    projects = extract_section(text, ["Projects"])
    
    education_count = count_education_entries(education)
    experience_count = count_experience_entries(experience)
    project_count = count_projects(projects)

    print("Extraction Complete")
    
    print("RESUME DETAILS:")
    print("Name:", name)
    print("Email:", email)
    print("Phone:", phone)
    print("LinkedIn:", linkedin)
    print("GitHub:", github)
    print("Skills Found:", skills)
    print("Education Count:", education_count)
    print("Experience Count:", experience_count)
    print("Project Count:", project_count)
    print("==============================\n")

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,
        "skills": skills,
        "projects": project_count,
        "education": education_count,
        "experience": experience_count
    }