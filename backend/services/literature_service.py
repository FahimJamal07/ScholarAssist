import logging
from backend.models.request_models import LiteratureReviewRequest
from backend.orchestrator.task_router import task_router

logger = logging.getLogger("scholar_assist")

class LiteratureService:
    async def create_review(self, request: LiteratureReviewRequest) -> str:
        logger.info(f"Generating literature review on theme: '{request.prompt}'")
        
        # Build systematic review prompt
        prompt = (
            f"You are a research review assistant. Generate a long-form thematic literature review "
            f"analyzing the following user theme: '{request.prompt}'.\n"
            f"Cross-reference references where appropriate."
        )
        
        # Route to Orchestrator (literature review uses Claude)
        review_content = await task_router.route_task(
            task_type="literature_review",
            prompt=prompt
        )
        
        return review_content

literature_service = LiteratureService()
