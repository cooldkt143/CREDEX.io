from fastapi import APIRouter
from .schemas import CredexAnalyzeRequest, CredexAnalyzeResponse
from .service import analyze_profile

router = APIRouter()


@router.post("/analyze", response_model=CredexAnalyzeResponse)
def credex_analyze(payload: CredexAnalyzeRequest):
    result = analyze_profile(payload)
    return result