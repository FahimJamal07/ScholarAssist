import logging
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from backend.config.database import get_db
from backend.models.request_models import ChatRequest
from backend.models.response_models import APIResponse
from backend.services.chat_service import chat_service

logger = logging.getLogger("scholar_assist.api.chat")
router = APIRouter()

@router.post("/chat", response_model=APIResponse)
async def chat_with_papers(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        response_text = await chat_service.generate_response(request, db)
        return APIResponse(
            success=True,
            message="Chat response generated successfully.",
            data={"response": response_text}
        )
    except ValueError as ve:
        logger.error(f"Validation error in chat request: {str(ve)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": str(ve)}
        )
    except Exception as e:
        logger.exception(f"Unexpected error during chat processing: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "error": "Internal server error during chat processing."}
        )
