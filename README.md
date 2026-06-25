# CREDEX.io - Measure What You Can Build

CREDEX is a proof-first credibility platform that measures real skills based on what a person has actually built and solved, rather than what they claim on resumes or profiles. 

Instead of relying on self-declared lists, CREDEX analyzes real work across developer platforms (GitHub, HackerRank, GeeksforGeeks, Unstop, LinkedIn) and parses uploaded resumes to generate a transparent credibility score, actionable feedback, and an automated learning roadmap.

---

## 🚀 Key Features

*   **CREDEX Scoring Engine**: Evaluates professional credibility out of 1000 points based on experience level, resume structure, GitHub metrics, LinkedIn visibility, and custom project portfolios.
*   **ATS Score Checker**: Compares uploaded resumes with job descriptions (or role descriptions) to measure semantic similarity, keyword matching, and experience alignments.
*   **Proof-First Resume Builder**: Parses raw resume texts into clean JSON using GPT-4o-mini, allows direct editing, and generates clean PDFs utilizing customizable HTML templates.
*   **AI Roadmap Builder**: Identifies skill gaps and constructs week-by-week learning goals with conceptual topics, tool focus areas, and specific build tasks.
*   **Platform ID Analyzer**: Directly scrapes and analyzes developer handles from GitHub, LinkedIn, GeeksforGeeks, HackerRank, and Unstop.

---

## 🛠️ Technology Stack

### Frontend
*   **React 19 & React DOM 19**
*   **Vite** (Build Tool/Development Server)
*   **TailwindCSS (v3)** & **Framer Motion** (Styling & Smooth Transitions)
*   **Firebase SDK (v12)** (User Authentication)
*   **jsPDF** & **html2canvas** (Client-side Resume Exports)

### Backend
*   **FastAPI & Uvicorn** (Python ASGI Web Server)
*   **pdfplumber** & **python-docx** (Resume Text Extraction)
*   **Jinja2** (Dynamic Template Rendering)
*   **xhtml2pdf** (Server-side HTML-to-PDF Conversion)
*   **scikit-learn** (TF-IDF & Cosine Similarity Fallbacks)

### AI & Machine Learning Models
*   **BAAI/bge-base-en-v1.5** (Sentence-Transformers Semantic Similarity)
*   **dslim/bert-base-NER** (Named Entity Recognition Skill Extraction)
*   **OpenRouter AI API Integrations**:
    *   `meta-llama/llama-3.1-8b-instruct` (Resume Quality Scoring)
    *   `openai/gpt-4o-mini` (Structured Resume Parsing & Roadmap Generation)
    *   `google/gemini-2.5-flash` (Roadmap Builder Failover Model)
    *   `openai/gpt-3.5-turbo` (Dynamic Credex Scoring Tips & Insights)

---

## 📂 Repository Directory Layout

```
├── BackEnd/
│   ├── app/                    # Helper services (File Readers, Basic Scorers)
│   ├── ats_checker/            # Advanced ATS checking routes & models
│   ├── credex_analyze/         # GitHub, LinkedIn & resume aggregates (CREDEX scoring)
│   ├── idanalyze/              # Web scrapers for developer profiles
│   ├── resume_builder/         # Dynamic resume rendering, editing, and PDF creation
│   │   ├── templates/          # Jinja2 HTML resume themes (classic, creative, modern, minimalist, executive)
│   ├── roadmap_builder/        # AI custom roadmap generators
│   ├── main.py                 # FastAPI app entry point and sub-routers
│   └── run_server.py           # Helper script to start uvicorn
├── src/
│   ├── components/             # Reusable UI elements (Navigation, Cards)
│   ├── pages/                  # Views (ATSChecker, CredexAnalyze, RoadmapBuilder, etc.)
│   ├── App.jsx                 # Route configurations (React Router)
│   └── main.jsx                # Application root mount
├── package.json                # NPM dependency & dev script settings
└── README.md                   # Current documentation
```

---

## ⚙️ Getting Started & Local Setup

CREDEX.io runs a concurrent workspace execution. Ensure you have Node.js and Python 3.10+ installed.

### 1. Configuration (`.env`)
Create a `.env` file in the root workspace directory and add your keys:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 2. Install Dependencies

#### Frontend (Node.js)
```bash
npm install
```

#### Backend (Python)
Ensure Python virtual environment is active, then install the necessary dependencies:
```bash
pip install fastapi uvicorn pdfplumber python-docx jinja2 xhtml2pdf scikit-learn sentence-transformers transformers torch requests python-dotenv pydantic
```

### 3. Run the Application
You can launch both the frontend and backend servers simultaneously:
```bash
npm run dev
```
*   **Frontend Web App**: Runs on [http://localhost:5173](http://localhost:5173) (Vite)
*   **Backend API Service**: Runs on [http://localhost:8000](http://localhost:8000) (Uvicorn)

---

## 📊 Evaluation & Scoring Criteria

### 1. CREDEX Score Calculation (Max 1000)
Used to rank developers on the platform based on multi-source signals.
*   **Experience Level (Max 100)**: Student (20), Fresher (40), Junior 1-3 Yrs (70), Senior 3+ Yrs (100).
*   **Resume Quality (Max 300)**: Contact info completeness (75), keyword skill counts (75), project counts (50), education counts (50), and work experience history (50).
*   **Project Portfolio (Max 150)**: Evaluates up to 6 custom projects (+25 max each). Rewards base links (+5), repository link presence (+10), and live deployment proof (+10).
*   **GitHub Profile (Max 250)**: Measures bio details, repository count, commit activity logs, star and follower ratios, and languages.
*   **LinkedIn Profile (Max 200)**: Measures profile image presence, headline/summary metrics, career experience positions, network size, and endorsements.

#### Developer Level Thresholds
Based on the final CREDEX score, developers are grouped into the following tiers:
*   **$\ge 800$**: Elite Developer
*   **$650 - 799$**: Advanced Developer
*   **$450 - 649$**: Growing Professional
*   **$< 450$**: Early Stage Developer

---

### 2. Platform-Specific ID Scoring (Max 1000 each)
Independent profile scores calculated when pasting platform handles:

#### A. GitHub Scorer
*   **Followers**: $\min(\text{followers} \times 3, 100)$
*   **Follower/Following Ratio**: $\min(\text{ratio} \times 20, 50)$
*   **Profile Completeness**: $\min(\text{fields} \times 10, 50)$ (checks bio, company, location, blog, avatar)
*   **Public Repositories**: $\min(\text{repos} \times 4, 120)$
*   **Account Age**: $\min(\text{years} \times 8, 80)$
*   **Stars & Forks**: $\min(\text{stars} \times 1.5, 180) + \min(\text{avg stars per repo} \times 10, 60) + \min(\text{forks} \times 2, 60) + \min(\text{avg forks per repo} \times 10, 25)$
*   **Code Quality**: $\min(\text{repos with README} \times 8, 100) + \min(\text{repos with license} \times 8, 100) + \min(\text{languages} \times 25, 75)$

#### B. LinkedIn Scorer
*   **Profile Completeness**: Profile visible (+100), Scraping quality check (+50), Profile photo (+50), Headline (+100), Summary (+150)
*   **Experience & Education**: positions count * 60 (max 180), Education present (+60), Experience count $\ge 2$ (+60)
*   **Proof of Work & Skills**: Project/portfolio links present (+120), Skills count * 10 (max 80)
*   **Engagement & Activity**: Active in the last 30 days (+100)

#### C. GeeksforGeeks Scorer
*   **Profile Presence**: Profile visible (+150), Username (+50)
*   **Problem Solving Depth**: Solved count * 4 (max 300), $\ge 100$ solved (+50), $\ge 300$ solved (+50)
*   **Knowledge Contribution**: Articles written * 40 (max 200)
*   **Consistency**: Active in the last 30 days (+200)

#### D. HackerRank Scorer
*   **Profile Presence**: Profile visible (+120), Username (+50), Profile completed (+30)
*   **Practice Badges**: $\ge 1$ badges (+80), $\ge 5$ badges (+100), $\ge 10$ badges (+120)
*   **Certifications**: Certifications count * 120 (max 240), verified badges (+60)
*   **Growth & Recency**: Active in the last 30 days (+100), new badge recent (+50), first cert recent (+50)

#### E. Unstop Scorer
*   **Profile Presence**: Profile visible (+200), Username (+100)
*   **Participation**: Active (+150), Contest participation count * 80 (max 250)
*   **Readiness**: Uploaded resume visible (+150), Hackathons (+50), Hiring challenges (+50)

---

### 3. ATS Score Match Weighting
*   **Resume Quality (30% weight)**: Measures formatting, action verbs, and structure completeness.
*   **Job Match Score (70% weight)**: Combined matching scores:
    *   **40% Semantic Similarity**: Encoded with BGE-base semantic models.
    *   **40% Skills Score**: Overlaps between resume skills and job specifications.
    *   **20% Experience Score**: Relative comparison of years of experience.

---

## 🎨 Resume Builder Themes
The Resume Builder supports 5 customized, printable HTML/CSS styles rendered dynamically via Jinja2:
1.  **Classic**: Standard academic format, structured, and formal.
2.  **Creative**: Dynamic, stylish layout highlighting skill boxes and achievements.
3.  **Modern**: Clean, sleek layout with dark headings and sidebar elements.
4.  **Minimalist**: Highly structured layout emphasizing whitespace and typography.
5.  **Executive**: Elegant layout designed for senior or experienced engineers.

---

## 🗺️ AI Roadmap Builder
The AI Roadmap Builder generates customized, sequential week-by-week curriculum plans to help candidates transition from their current skillset to a targeted industry role within a designated timeline.

### Study Strategy Parameters
*   **Current Skills Input**: Accepts user's verified skills either as a structured list or a single comma-separated string (e.g. `"React, JavaScript"`).
*   **Target Role Input**: Specifies the desired career destination (e.g. `"Full Stack Engineer"`, `"Machine Learning Developer"`).
*   **Time Limit Input**: Adjusts course length based on time bounds (e.g. `"3 months"`, `"6 weeks"`).

### AI Generation Output Schema
The AI outputs a strictly validated JSON structure mapping:
```json
{
  "target_role": "string",
  "time_limit": "string",
  "current_skills_recognized": ["string"],
  "skill_gaps": ["string"],
  "weekly_hours_recommended": 15,
  "roadmap_months": [
    {
      "month_number": 1,
      "month_title": "string",
      "weeks": [
        {
          "week_number": 1,
          "week_title": "string",
          "topics": ["string"],
          "learn": ["string"],
          "project": "string"
        }
      ]
    }
  ],
  "general_tips": ["string"]
}
```

*   **Months & Weeks Layout**: Each month is centered around a themed focus (e.g. *Foundations of Generative AI*).
*   **Weekly Study Topics**: Lists key concepts, tools (libraries, frameworks), and a **hands-on mini-project** to construct as concrete proof of work.