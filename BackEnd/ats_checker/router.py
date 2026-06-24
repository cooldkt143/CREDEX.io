from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException
)

from ats_checker.ats_service import (
    analyze_resume
)

from ats_checker.job_roles import (
    JOB_ROLE_DESCRIPTIONS
)

router = APIRouter()


@router.post("/check")
async def check_resume(
    resume: UploadFile = File(...),
    job_role: str = Form(""),
    job_description: str = Form("")
):

    try:

        if (
            not job_description
            and job_role
        ):
            job_description = (
                JOB_ROLE_DESCRIPTIONS.get(
                    job_role,
                    job_role
                )
            )

        result = await analyze_resume(
            resume,
            job_description
        )

        return {
            "success": True,
            "data": result
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )