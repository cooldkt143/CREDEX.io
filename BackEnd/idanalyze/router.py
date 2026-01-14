from fastapi import APIRouter, HTTPException
from idanalyze.schemas import AnalyzeRequest, AnalyzeResponse

from idanalyze.extractors.github import extract_github
from idanalyze.extractors.hackerrank import extract_hackerrank
from idanalyze.extractors.geeksforgeeks import extract_gfg
from idanalyze.extractors.unstop import extract_unstop
from idanalyze.extractors.linkedin import extract_linkedin

from idanalyze.analyzer.score import generate_score
from idanalyze.analyzer.insights import generate_insights

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_id(payload: AnalyzeRequest):
    platform = payload.platform.lower()
    pid = payload.profile_id

    if platform == "github":
        profile = extract_github(pid)
    elif platform == "hackerrank":
        profile = extract_hackerrank(pid)
    elif platform == "geeksforgeeks":
        profile = extract_gfg(pid)
    elif platform == "unstop":
        profile = extract_unstop(pid)
    elif platform == "linkedin":
        profile = extract_linkedin(pid)
    else:
        raise HTTPException(status_code=400, detail="Unsupported platform")

    score = generate_score(platform, profile)
    insights = generate_insights(platform, profile)

    return {
        "platform": payload.platform,
        "profile": profile,
        "score": score,
        "insights": insights
    }
