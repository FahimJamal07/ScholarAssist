import logging
import asyncio
from typing import List, Any

logger = logging.getLogger("scholar_assist.orchestrator.response_aggregator")

class ResponseAggregator:
    """Aggregates multiple parallel model outputs or merges disparate textual chunks into unified streams."""
    
    async def aggregate_parallel_tasks(self, tasks: List[asyncio.Task]) -> List[Any]:
        """Awaits and aggregates results from parallel asynchronous operations securely, bypassing distinct failures."""
        logger.info(f"Aggregating {len(tasks)} parallel asynchronous task branches.")
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Log and filter out exceptions to maintain partial operability
        successful_results = []
        for index, result in enumerate(results):
            if isinstance(result, Exception):
                logger.error(f"Async Task branch {index} failed during aggregation: {str(result)}")
            else:
                successful_results.append(result)
                
        return successful_results
        
    def format_combined_context(self, text_chunks: List[str], citations: List[str] = None) -> str:
        """Fuses disparate textual chunks into a unified context block optimized for strict LLM ingestion."""
        if citations and len(citations) == len(text_chunks):
            combined = "\n\n".join([f"[Source Segment: {cit}]\n{chunk}" for cit, chunk in zip(citations, text_chunks)])
        else:
            combined = "\n\n---\n\n".join(text_chunks)
        return combined

response_aggregator = ResponseAggregator()
