import logging
from backend.models.request_models import ComparisonRequest
from backend.orchestrator.task_router import task_router

logger = logging.getLogger("scholar_assist")

class ComparisonService:
    async def run_comparison(self, request: ComparisonRequest):
        logger.info(f"Comparing papers: {request.paper_ids}")
        
        # In a real environment, we retrieve the text contents of the requested papers from DB/Vector Store
        prompt = (
            f"Compare the methodology, datasets, and limitations of papers: {', '.join(request.paper_ids)}.\n"
            f"Summarize the comparison in a structured table or outline format."
        )
        
        # Route to Orchestrator (specifically targeting Claude/long-form routing)
        comparison_text = await task_router.route_task(
            task_type="comparison",
            prompt=prompt
        )
        
        return {
            "paper_ids": request.paper_ids,
            "comparison_report": comparison_text
        }

comparison_service = ComparisonService()
