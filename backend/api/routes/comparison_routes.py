import logging
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from backend.config.database import get_db
from backend.models.request_models import ComparisonRequest
from backend.models.response_models import APIResponse
from backend.services.comparison_service import comparison_service

logger = logging.getLogger("scholar_assist.api.compare")
router = APIRouter()

@router.post("/compare", response_model=APIResponse)
async def compare_papers(
    request: ComparisonRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        comparison_results = await comparison_service.run_comparison(request, db)
        return APIResponse(
            success=True,
            message="Comparison completed successfully.",
            data=comparison_results
        )
    except ValueError as ve:
        logger.error(f"Validation error during paper comparison: {str(ve)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": str(ve)}
        )
    except Exception as e:
        logger.exception(f"Unexpected error during comparison: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "error": "Internal server error during paper comparison."}
        )
