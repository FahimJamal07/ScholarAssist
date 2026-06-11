import json
import logging
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.request_models import NoveltyRequest
from backend.adapters.vector_adapter import vector_adapter
from backend.adapters.embedding_adapter import embedding_adapter
from backend.adapters.claude_adapter import claude_adapter

logger = logging.getLogger("scholar_assist.services.novelty")

class NoveltyService:
    async def analyze_novelty(self, request: NoveltyRequest, db: Optional[AsyncSession] = None) -> Dict[str, Any]:
        """
        Analyzes the novelty of a target paper against existing literature using semantic vector
        similarity and LLM-driven research gap analysis.
        """
        logger.info(f"Starting novelty detection analysis for paper_id: {request.paper_id}")
        
        # 1. Fetch Target Abstract (Mock)
        # In a real system, query the database using the paper_id.
        try:
            # Mocking the target paper abstract
            target_abstract = (
                f"This is a mock abstract for paper {request.paper_id} proposing a "
                f"novel low-latency attention mechanism that scales linearly rather than quadratically."
            )
        except Exception as e:
            logger.error(f"Failed to fetch abstract for paper {request.paper_id}: {str(e)}")
            raise ValueError("Could not find the target paper abstract.")

        # 2. Vector Similarity Search
        try:
            logger.info("Generating embedding for the target abstract.")
            abstract_embedding = await embedding_adapter.generate_embedding(target_abstract)
            
            logger.info("Querying vector store for semantically similar literature.")
            similar_chunks = await vector_adapter.query_similarity(
                query_embedding=abstract_embedding,
                limit=5
            )
        except Exception as e:
            logger.error(f"Vector search failed during novelty analysis: {str(e)}")
            raise ValueError("Failed to retrieve comparable literature from the vector store.")

        # 3. Context Builder for Analysis
        similar_papers_context = ""
        similar_papers_list = []
        
        if not similar_chunks:
            logger.info("No similar chunks found in vector search.")
            return {
                "novelty_score": 100,
                "similar_papers": [],
                "overlap_analysis": "No similar literature found in the database.",
                "research_gap_identified": "Completely novel within the scope of the current knowledge base.",
                "summary": "This paper represents entirely distinct research within the current corpus."
            }
            
        for idx, chunk in enumerate(similar_chunks, 1):
            text = chunk.get("text", "")
            chunk_id = chunk.get("id", f"unknown_chunk_{idx}")
            score = chunk.get("score", 0.0)
            
            similar_papers_context += f"Similar Paper Context {idx} (Similarity Score: {score}):\n{text}\n\n"
            similar_papers_list.append({
                "id": chunk_id,
                "similarity_score": score,
                "snippet": text[:150] + "..." if len(text) > 150 else text
            })

        # 4. Semantic Similarity & Novelty Analysis via LLM
        schema_dict = {
            "novelty_score": "Integer (0-100, where 100 is completely novel and 0 is entirely derivative)",
            "overlap_explanation": "String (Detailed explanation of conceptual overlap with existing literature)",
            "research_gap_identification": "String (Identification of the specific gaps this paper fills)",
            "summary": "String (Short executive summary of the novelty assessment)"
        }
        
        prompt = (
            f"Analyze the novelty of the following Target Abstract against the Similar Papers Context.\n\n"
            f"Target Abstract:\n{target_abstract}\n"
        )

        try:
            logger.info("Calling LLM adapter for structured novelty scoring and analysis.")
            json_response_str = await claude_adapter.generate_structured_json(
                prompt=prompt,
                schema_dict=schema_dict,
                context=similar_papers_context
            )
            
            analysis_data = json.loads(json_response_str)
            
        except json.JSONDecodeError as jde:
            logger.error(f"LLM failed to return a valid JSON structure: {str(jde)}\nResponse was: {json_response_str}")
            raise ValueError("The AI model failed to format the novelty analysis output correctly.")
        except Exception as e:
            logger.error(f"Novelty analysis generation failed: {str(e)}")
            raise ValueError("The AI model failed to evaluate the novelty of the paper.")
            
        # 5. Compile and Return Final Structured Output
        return {
            "novelty_score": analysis_data.get("novelty_score", 0),
            "similar_papers": similar_papers_list,
            "overlap_analysis": analysis_data.get("overlap_explanation", "Overlap analysis missing."),
            "research_gap_identified": analysis_data.get("research_gap_identification", "Gaps analysis missing."),
            "summary": analysis_data.get("summary", "Summary missing.")
        }

novelty_service = NoveltyService()
