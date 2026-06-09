import logging
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from backend.config.database import get_db
from backend.models.request_models import NoveltyRequest
from backend.models.response_models import APIResponse
from backend.services.novelty_service import novelty_service

logger = logging.getLogger("scholar_assist.api.novelty")
router = APIRouter()

@router.post("/novelty", response_model=APIResponse)
async def detect_novelty(
    request: NoveltyRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        novelty_report = await novelty_service.analyze_novelty(request, db)
        return APIResponse(
            success=True,
            message="Novelty detection report compiled successfully.",
            data=novelty_report
        )
    except ValueError as ve:
        logger.error(f"Validation error during novelty detection: {str(ve)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": str(ve)}
        )
    except Exception as e:
        logger.exception(f"Unexpected error during novelty detection: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "error": "Internal server error during novelty detection."}
        )
