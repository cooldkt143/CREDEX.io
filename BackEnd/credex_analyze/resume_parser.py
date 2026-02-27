import re
import pdfplumber
import docx
from collections import Counter


# ---------------- File Readers ----------------

def extract_text_from_pdf(file_path):
    """Extract text from PDF with better error handling"""
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text if text.strip() else None
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return None


def extract_text_from_docx(file_path):
    """Extract text from DOCX with better error handling"""
    try:
        doc = docx.Document(file_path)
        text = "\n".join(p.text for p in doc.paragraphs)
        return text if text.strip() else None
    except Exception as e:
        print(f"Error reading DOCX: {e}")
        return None


# ---------------- Text Utilities ----------------

def normalize_text(text: str) -> str:
    """Improved text normalization"""
    if not text:
        return ""
    
    # Replace various unicode spaces with regular space
    text = re.sub(r'[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000]', ' ', text)
    text = text.replace("\r", "\n")
    
    # Normalize whitespace while preserving single newlines
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)  # Max 2 newlines
    
    return text.strip()


def extract_section(text: str, section_names, next_sections):
    """Improved section extraction with better regex"""
    # More flexible section header matching
    section_pattern = r"(?im)^\s*(?:{})\s*[:\-]?\s*$".format(
        "|".join(map(re.escape, section_names))
    )

    stop_pattern = r"(?im)^\s*(?:{})\s*[:\-]?\s*$".format(
        "|".join(map(re.escape, next_sections))
    )

    match = re.search(section_pattern, text)
    if not match:
        return ""

    start = match.end()
    stop_match = re.search(stop_pattern, text[start:])
    end = start + stop_match.start() if stop_match else len(text)

    return text[start:end].strip()


# ---------------- Basic Field Extraction ----------------

def extract_name(text: str):
    """Improved name extraction with better heuristics"""
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    if not lines:
        return "Unknown"

    # Patterns to avoid (likely not names)
    bad_patterns = [
        r"@",                    # Email
        r"http",                 # URL
        r"www\.",                # URL
        r"\+?\d[\d\s-]{8,}\d",  # Phone
        r"resume",               # Word "resume"
        r"curriculum",           # Word "curriculum vitae"
        r"^\d+$",               # Just numbers
        r"^[A-Z]{2,}$",         # All caps acronyms
    ]

    # Look in first 10 lines for name
    for line in lines[:10]:
        # Skip if matches bad patterns
        if any(re.search(p, line, re.I) for p in bad_patterns):
            continue
        
        # Skip if too long (likely not a name)
        if len(line) > 50:
            continue
            
        # Clean and check if looks like a name (2-4 words, starts with capital)
        cleaned = re.sub(r"[^A-Za-z\s]", " ", line)
        cleaned = re.sub(r"\s{2,}", " ", cleaned).strip()
        
        words = cleaned.split()
        if 2 <= len(words) <= 4 and cleaned[0].isupper():
            return cleaned.title()

    # Fallback: return first non-empty line that's not too long
    for line in lines[:5]:
        if 5 < len(line) < 40:
            cleaned = re.sub(r"[^A-Za-z\s]", " ", line)
            cleaned = re.sub(r"\s{2,}", " ", cleaned).strip()
            if cleaned:
                return cleaned.title()
    
    return "Unknown"


def extract_email(text: str):
    """Improved email extraction"""
    # More robust email regex
    emails = re.findall(
        r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', 
        text
    )
    
    # Return first valid-looking email
    for email in emails:
        if not email.startswith('.') and not email.endswith('.'):
            return email.lower()
    
    return ""


def extract_phone(text: str):
    """Improved phone extraction with multiple formats"""
    # Match various phone formats
    patterns = [
        r'\+\d{1,3}[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}',  # +1 (123) 456-7890
        r'\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}',                   # (123) 456-7890
        r'\d{10}',                                                 # 1234567890
        r'\+\d{10,15}',                                           # International
    ]
    
    for pattern in patterns:
        phones = re.findall(pattern, text)
        if phones:
            # Clean up the phone number
            phone = re.sub(r'[\s.-]', '', phones[0])
            return phone
    
    return ""


def extract_linkedin(text: str):
    """Extract LinkedIn profile URL"""
    linkedin_patterns = [
        r'(?:https?://)?(?:www\.)?linkedin\.com/in/[\w-]+/?',
        r'linkedin\.com/in/[\w-]+',
    ]
    
    for pattern in linkedin_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            url = matches[0]
            if not url.startswith('http'):
                url = 'https://' + url
            return url
    
    return ""


def extract_github(text: str):
    """Extract GitHub profile URL"""
    github_patterns = [
        r'(?:https?://)?(?:www\.)?github\.com/[\w-]+/?',
        r'github\.com/[\w-]+',
    ]
    
    for pattern in github_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            url = matches[0]
            if not url.startswith('http'):
                url = 'https://' + url
            # Filter out common GitHub pages that aren't profiles
            if '/repos/' not in url and '/issues/' not in url:
                return url
    
    return ""


# ---------------- Skills ----------------

def extract_skills(text: str):
    """Enhanced skill extraction with categories"""
    skills_database = {
        # Programming Languages
        "Python", "Java", "JavaScript", "TypeScript", "C", "C++", "C#", 
        "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Dart",
        
        # Web Frontend
        "React", "Angular", "Vue", "Vue.js", "Svelte", "Next.js", "Nuxt.js",
        "HTML", "CSS", "SASS", "SCSS", "Tailwind", "Bootstrap",
        
        # Web Backend
        "Node", "Node.js", "Express", "FastAPI", "Django", "Flask",
        "Spring", "Spring Boot", ".NET", "Laravel", "Rails",
        
        # Databases
        "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra",
        "SQLite", "Oracle", "DynamoDB", "Firebase",
        
        # Cloud & DevOps
        "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Jenkins",
        "CI/CD", "Terraform", "Ansible",
        
        # Mobile
        "React Native", "Flutter", "Android", "iOS", "Xamarin",
        
        # Data Science & ML
        "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", 
        "Keras", "Scikit-learn", "Pandas", "NumPy", "OpenCV",
        
        # Tools
        "Git", "GitHub", "GitLab", "Jira", "Confluence", "Postman",
        
        # Other
        "GraphQL", "REST", "API", "Microservices", "Agile", "Scrum"
    }

    text_lower = text.lower()
    found_skills = set()
    
    for skill in skills_database:
        # Case-insensitive whole word matching
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.add(skill)
    
    return sorted(list(found_skills))


# ---------------- Projects ----------------

def extract_links(text: str):
    """Extract all URLs from text"""
    # More comprehensive URL pattern
    urls = re.findall(
        r'https?://[^\s<>"{}|\\^`\[\]]+',
        text
    )
    return [url.rstrip('.,;:)') for url in urls]  # Remove trailing punctuation


def classify_links(links):
    """Classify links into GitHub repos and live deployments"""
    repo = None
    live = None
    
    for link in links:
        link_lower = link.lower()
        
        # GitHub repo detection
        if "github.com" in link_lower and "/repos/" not in link_lower:
            if not repo:  # Take first GitHub link
                repo = link
        
        # Live deployment detection (common hosting platforms)
        elif any(domain in link_lower for domain in [
            "vercel.app", "netlify.app", "herokuapp.com", 
            "render.com", "railway.app", "fly.io",
            "firebase.app", "web.app", "azurewebsites.net"
        ]):
            if not live:  # Take first live deployment
                live = link
        
        # If no GitHub repo yet, take any other link as live
        elif not live and repo:
            live = link
    
    return repo, live


def parse_projects(projects_text: str):
    """Improved project parsing with better structure detection"""
    if not projects_text:
        return []
    
    projects = []
    
    # Try to split by common project delimiters
    blocks = re.split(
        r'\n(?=(?:[•\-\*]|\d+\.)\s+[A-Z])|'  # Bullet points or numbers
        r'\n(?=[A-Z][A-Za-z0-9\s\-:&]+(?:\n|$))',  # Title lines
        projects_text
    )

    for block in blocks:
        lines = [l.strip() for l in block.split("\n") if l.strip()]
        if len(lines) < 1:
            continue

        # Extract project name (first substantial line)
        name = lines[0]
        # Clean up common prefixes
        name = re.sub(r'^(?:[•\-\*]|\d+\.)\s+', '', name)
        
        # Skip if name is too short or looks like a section header
        if len(name) < 3 or name.lower() in ['projects', 'project']:
            continue
        
        # Extract links and description
        block_text = "\n".join(lines)
        links = extract_links(block_text)
        repo, live = classify_links(links)
        
        # Extract description (text without URLs)
        description = re.sub(r'https?://[^\s]+', '', block_text)
        description = " ".join(description.split())  # Normalize whitespace
        
        projects.append({
            "name": name,
            "description": description[:200] if len(description) > 200 else description,
            "repo": repo,
            "live": live
        })

    return projects


# ---------------- Experience ----------------

def extract_experience_years(text: str):
    """Extract years of experience from text"""
    # Look for patterns like "3 years", "5+ years", "2-3 years"
    patterns = [
        r'(\d+)\+?\s*(?:years?|yrs?)\s+(?:of\s+)?experience',
        r'experience[:\s]+(\d+)\+?\s*(?:years?|yrs?)',
        r'(\d+)-(\d+)\s*(?:years?|yrs?)',
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            if isinstance(matches[0], tuple):
                # Range like "2-3 years"
                return max(int(x) for x in matches[0] if x.isdigit())
            else:
                return int(matches[0])
    
    return None


def parse_work_experience(experience_text: str):
    """Parse work experience entries"""
    if not experience_text:
        return []
    
    experiences = []
    
    # Split by common job entry patterns
    blocks = re.split(
        r'\n(?=[A-Z][A-Za-z\s&]+ (?:at|@) [A-Z])|'  # "Engineer at Company"
        r'\n(?=[A-Z][A-Za-z\s&]+\n[A-Z][A-Za-z\s&]+)',  # Title\nCompany
        experience_text
    )
    
    for block in blocks:
        lines = [l.strip() for l in block.split("\n") if l.strip()]
        if len(lines) < 1:
            continue
        
        # Try to extract job title, company, duration
        title = lines[0] if lines else ""
        company = lines[1] if len(lines) > 1 else ""
        
        # Look for dates
        date_patterns = [
            r'\d{4}\s*[-–]\s*\d{4}',
            r'\d{4}\s*[-–]\s*(?:Present|Current)',
            r'(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}'
        ]
        
        dates = ""
        for pattern in date_patterns:
            match = re.search(pattern, block, re.IGNORECASE)
            if match:
                dates = match.group(0)
                break
        
        experiences.append({
            "title": title,
            "company": company,
            "duration": dates
        })
    
    return experiences


def infer_experience_level(text: str, parsed_experience):
    """Improved experience level inference"""
    text_lower = text.lower()
    
    # Check for explicit experience statements
    years = extract_experience_years(text)
    if years:
        if years >= 3:
            return "3+ Years"
        elif years >= 1:
            return "1-3 Years"
        else:
            return "Fresher"
    
    # Check parsed work experience
    if parsed_experience and len(parsed_experience) >= 2:
        return "1-3 Years"
    elif parsed_experience and len(parsed_experience) == 1:
        return "Fresher"
    
    # Keyword-based inference
    senior_keywords = ["senior", "lead", "manager", "architect", "principal"]
    mid_keywords = ["developer", "engineer", "analyst", "consultant"]
    junior_keywords = ["intern", "trainee", "junior", "associate"]
    student_keywords = ["student", "pursuing", "undergraduate", "bachelor", "currently studying"]
    
    senior_count = sum(1 for k in senior_keywords if k in text_lower)
    mid_count = sum(1 for k in mid_keywords if k in text_lower)
    junior_count = sum(1 for k in junior_keywords if k in text_lower)
    student_count = sum(1 for k in student_keywords if k in text_lower)
    
    if senior_count >= 2:
        return "3+ Years"
    elif mid_count >= 2 or junior_count >= 2:
        return "1-3 Years"
    elif junior_count >= 1:
        return "Fresher"
    elif student_count >= 1:
        return "Student"
    
    # Default
    return "Student"


# ---------------- Education ----------------

def parse_education(education_text: str):
    """Parse education details"""
    if not education_text:
        return []
    
    education_entries = []
    
    # Common degree patterns
    degree_patterns = [
        r'(?:Bachelor|B\.?[ASTech]*\.?|Master|M\.?[ASTech]*\.?|PhD|Ph\.D\.?)',
        r'(?:B\.Sc|M\.Sc|B\.E|M\.E|B\.Tech|M\.Tech)',
    ]
    
    # Find degree mentions
    for pattern in degree_patterns:
        matches = re.finditer(pattern, education_text, re.IGNORECASE)
        for match in matches:
            # Extract surrounding context
            start = max(0, match.start() - 100)
            end = min(len(education_text), match.end() + 100)
            context = education_text[start:end]
            
            # Try to find institution
            institution = ""
            # Look for capitalized words after degree
            inst_match = re.search(r'(?:from|at)\s+([A-Z][A-Za-z\s&]+)', context)
            if inst_match:
                institution = inst_match.group(1).strip()
            
            # Try to find year
            year_match = re.search(r'\b(19|20)\d{2}\b', context)
            year = year_match.group(0) if year_match else ""
            
            education_entries.append({
                "degree": match.group(0),
                "institution": institution,
                "year": year
            })
    
    return education_entries

# ---------------- Main Extractor ----------------

def extract_details(resume_text: str):
    """Main extraction function with improved logic"""
    if not resume_text:
        return None
    
    resume_text = normalize_text(resume_text)
    
    # Basic information
    name = extract_name(resume_text)
    email = extract_email(resume_text)
    phone = extract_phone(resume_text)
    linkedin = extract_linkedin(resume_text)
    github = extract_github(resume_text)
    
    # Skills
    skills = extract_skills(resume_text)
    
    # Projects
    projects_text = extract_section(
        resume_text,
        ["Projects", "Project", "Personal Projects", "Academic Projects"],
        ["Experience", "Work Experience", "Education", "Skills", "Achievements", "Awards", "Certifications"]
    )
    projects = parse_projects(projects_text)
    
    # Education
    education_text = extract_section(
        resume_text,
        ["Education", "Academic Background", "Qualification"],
        ["Experience", "Work Experience", "Skills", "Projects", "Achievements", "Awards"]
    )
    education = parse_education(education_text)
    
    # Experience
    experience_text = extract_section(
        resume_text,
        ["Experience", "Work Experience", "Professional Experience", "Internship", "Internships"],
        ["Education", "Skills", "Projects", "Achievements", "Awards", "Certifications"]
    )
    parsed_experience = parse_work_experience(experience_text)
    experience_level = infer_experience_level(resume_text, parsed_experience)
    
    # Achievements
    achievements_text = extract_section(
        resume_text,
        ["Achievements", "Key Achievements", "Awards", "Honors", "Certifications"],
        ["Experience", "Work Experience", "Education", "Skills", "Projects"]
    )
    
    return {
        "name": name,
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,
        "skills": skills,
        "projects": projects,
        "education": education,
        "experience": parsed_experience,
        "experience_level": experience_level,
        "achievements": achievements_text if achievements_text else "",
        "raw_text_length": len(resume_text),
        "parsing_success": bool(name and email and skills)
    }