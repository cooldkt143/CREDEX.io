from pydantic import BaseModel, Field
from typing import List, Union

class RoadmapRequest(BaseModel):
    current_skills: Union[List[str], str] = Field(
        ..., 
        description="The user's current skills. Can be a list of strings or a single comma-separated string."
    )
    target_role: str = Field(
        ..., 
        description="The desired career role or target job (e.g., 'Full Stack Developer', 'Data Scientist')."
    )
    time_limit: str = Field(
        ..., 
        description="The amount of time available to complete the roadmap (e.g., '3 months', '6 weeks')."
    )

class WeeklyPlan(BaseModel):
    week_number: int = Field(..., description="The week number (e.g., 1, 2, 3)")
    week_title: str = Field(..., description="Title of the week (e.g., 'Python for AI Development')")
    topics: List[str] = Field(..., description="Conceptual topics to learn (e.g., ['Advanced Python', 'OOP Concepts'])")
    learn: List[str] = Field(..., description="Libraries, tools, or frameworks to learn (e.g., ['FastAPI', 'Requests'])")
    project: str = Field(..., description="Specific project or hands-on practice assignment for this week")

class MonthPlan(BaseModel):
    month_number: int = Field(..., description="The month number (e.g., 1, 2)")
    month_title: str = Field(..., description="Focus theme of the month (e.g., 'Foundations of Generative AI')")
    weeks: List[WeeklyPlan] = Field(..., description="The weekly breakdown for this month")

class RoadmapResponse(BaseModel):
    target_role: str
    time_limit: str
    current_skills_recognized: List[str] = Field(default=[])
    skill_gaps: List[str] = Field(default=[])
    weekly_hours_recommended: int = Field(default=15)
    roadmap_months: List[MonthPlan] = Field(..., description="Month-by-month roadmap details")
    general_tips: List[str] = Field(default=[])
