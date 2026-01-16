from pydantic import BaseModel
from typing import List, Optional


class Project(BaseModel):
    name: str
    repo: Optional[str] = None
    live: Optional[str] = None


class PlatformProfile(BaseModel):
    username: Optional[str] = None
    link: Optional[str] = None


class CredexAnalyzeRequest(BaseModel):
    fullName: str
    experience: str
    github: PlatformProfile
    linkedin: PlatformProfile
    projects: List[Project]
    otherPlatforms: Optional[list] = []
    resume_text: Optional[str] = None


class CredexAnalyzeResponse(BaseModel):
    credex_score: int
    level: str
    description: str
    strengths: List[str]
    improvement_tips: List[str]
    share_text: str
