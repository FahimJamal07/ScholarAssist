import logging
from fastapi import APIRouter, UploadFile, File, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from backend.config.database import get_db
from backend.models.response_models import APIResponse
from backend.services.upload_service import upload_service

logger = logging.getLogger("scholar_assist.api.upload")
router = APIRouter()

@router.post("/upload", response_model=APIResponse)
async def upload_paper(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Basic validation delegated to route layer before heavy processing
        if not file.filename.lower().endswith(".pdf"):
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"success": False, "error": "Only PDF files are supported for upload."}
            )
            
        result = await upload_service.process_pdf(file, db)
        
        return APIResponse(
            success=True,
            message="Paper uploaded and ingested successfully.",
            data=result
        )
    except ValueError as ve:
        logger.error(f"Validation error during paper upload: {str(ve)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": str(ve)}
        )
    except Exception as e:
        logger.exception(f"Unexpected server error during paper upload: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "error": "An internal error occurred while processing the upload."}
        )
