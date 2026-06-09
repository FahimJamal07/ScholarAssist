import logging
from backend.models.request_models import NoveltyRequest
from backend.orchestrator.task_router import task_router

logger = logging.getLogger("scholar_assist")

class NoveltyService:
    async def analyze_novelty(self, request: NoveltyRequest):
        logger.info(f"Analyzing novelty for paper: {request.paper_id}")
        
        prompt = (
            f"Inspect the research paper '{request.paper_id}'. Identify potential research gaps, "
            f"methodological improvements, and evaluate the novelty score relative to existing literature."
        )
        
        report = await task_router.route_task(
            task_type="novelty_detection",
            prompt=prompt
        )
        
        return {
            "paper_id": request.paper_id,
            "novelty_score": 8.5,  # Mock rating out of 10
            "report": report
        }

novelty_service = NoveltyService()
