import json
import logging
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.request_models import LiteratureReviewRequest
from backend.adapters.claude_adapter import claude_adapter

logger = logging.getLogger("scholar_assist.services.literature")

class LiteratureService:
    async def create_review(self, request: LiteratureReviewRequest, db: Optional[AsyncSession] = None) -> Dict[str, Any]:
        """
        Generates a structured literature review using Claude based on the provided theme and papers.
        Output matches strict academic formatting requirements.
        """
        logger.info(f"Generating literature review for theme: '{request.prompt}'")
        
        # 1. Retrieve papers context
        # In a fully integrated environment, we would query the database/vector store
        # to fetch summaries or full texts for `request.paper_ids`.
        try:
            # Mocking context aggregation based on requested paper IDs
            context_snippets = []
            if request.paper_ids:
                for pid in request.paper_ids:
                    context_snippets.append(f"Paper {pid} discusses significant advancements and methodologies relevant to {request.prompt}.")
            else:
                context_snippets.append(f"General context regarding recent research on {request.prompt}.")
                
            papers_context = "\n".join(context_snippets)
            
        except Exception as e:
            logger.error(f"Failed to retrieve paper contexts: {str(e)}")
            raise ValueError("Failed to gather context for the requested papers.")
            
        # 2. Define the exact JSON schema requested by the requirements
        schema_dict = {
            "introduction": "A thorough introduction to the topic based on the sources.",
            "methodology_trends": "Analysis of the different methods used across the papers.",
            "comparative_analysis": "A critical comparison of results and claims.",
            "research_gaps": "Identification of what is missing or unexplored.",
            "conclusion": "A comprehensive summary of the literature and future directions."
        }
        
        # 3. Generate structured review via Claude adapter
        try:
            logger.info("Calling Claude adapter for structured literature review generation.")
            json_response_str = await claude_adapter.generate_structured_json(
                prompt=f"Generate a rigorous, source-grounded academic literature review focusing on the theme: '{request.prompt}'.",
                schema_dict=schema_dict,
                context=papers_context
            )
            
            # Parse the JSON response strictly
            review_data = json.loads(json_response_str)
            
            # Validate that all required keys are present
            required_keys = ["introduction", "methodology_trends", "comparative_analysis", "research_gaps", "conclusion"]
            for key in required_keys:
                if key not in review_data:
                    review_data[key] = "Content generation failed for this section."
            
            return review_data
            
        except json.JSONDecodeError as jde:
            logger.error(f"Claude failed to return a valid JSON structure: {str(jde)}\nResponse was: {json_response_str}")
            raise ValueError("The AI model failed to produce a valid structured literature review.")
        except Exception as e:
            logger.error(f"Claude generation failed: {str(e)}")
            raise ValueError("An error occurred during literature review generation.")

literature_service = LiteratureService()
