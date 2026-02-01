from pydantic import BaseModel
from typing import List, Optional


class Project(BaseModel):
    name: str
    repo: Optional[str] = None
    live: Optional[str] = None


class PlatformProfile(BaseModel):
    username: str | None = None
    link: str | None = None
    
    
class Project(BaseModel):
    name: str | None = None
    repo: str | None = None
    live: str | None = None


class CredexAnalyzeRequest(BaseModel):
    fullName: str
    experience: str
    github: PlatformProfile | None = None
    linkedin: PlatformProfile | None = None
    projects: list[Project] = []
    otherPlatforms: list = []
    resume_text: str | None = None 


class CredexAnalyzeResponse(BaseModel):
    credex_score: int
    level: str
    description: str
    strengths: List[str]
    improvement_tips: List[str]
    share_text: str