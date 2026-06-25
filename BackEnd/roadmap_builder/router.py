from fastapi import APIRouter, HTTPException, status
from .schemas import RoadmapRequest, RoadmapResponse
from .service import generate_roadmap_ai

router = APIRouter()

@router.post(
    "/generate",
    response_model=RoadmapResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate AI Roadmap",
    description="Generate a highly detailed learning roadmap to transition from current skills to a target role in a given time limit."
)
async def generate_roadmap(request: RoadmapRequest):
    try:
        # Check inputs
        if isinstance(request.current_skills, list):
            # Remove empty strings
            request.current_skills = [s.strip() for s in request.current_skills if s.strip()]
            if not request.current_skills:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="current_skills list cannot be empty."
                )
        else:
            if not request.current_skills.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="current_skills string cannot be empty."
                )

        if not request.target_role.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="target_role cannot be empty."
            )
            
        if not request.time_limit.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="time_limit cannot be empty."
            )

        # Generate roadmap
        roadmap = generate_roadmap_ai(request)
        return roadmap

    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(val_err)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating the roadmap: {str(e)}"
        )
