import logging
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from backend.config.database import get_db
from backend.models.request_models import LiteratureReviewRequest
from backend.models.response_models import APIResponse
from backend.services.literature_service import literature_service

logger = logging.getLogger("scholar_assist.api.literature")
router = APIRouter()

@router.post("/literature-review", response_model=APIResponse)
async def generate_literature_review(
    request: LiteratureReviewRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        review = await literature_service.create_review(request, db)
        return APIResponse(
            success=True,
            message="Literature review generated successfully.",
            data={"review": review}
        )
    except ValueError as ve:
        logger.error(f"Validation error during literature review generation: {str(ve)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": str(ve)}
        )
    except Exception as e:
        logger.exception(f"Unexpected error during literature review generation: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "error": "Internal server error during literature review generation."}
        )
