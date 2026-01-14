from pydantic import BaseModel
from typing import Any, List, Dict

class AnalyzeRequest(BaseModel):
    platform: str
    profile_id: str

class AnalyzeResponse(BaseModel):
    platform: str
    profile: Dict[str, Any]
    score: int
    insights: List[str]