import logging
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.request_models import ChatRequest
from backend.adapters.vector_adapter import vector_adapter
from backend.adapters.embedding_adapter import embedding_adapter
from backend.adapters.gemini_adapter import gemini_adapter

logger = logging.getLogger("scholar_assist.services.chat")

class ChatService:
    async def generate_response(self, request: ChatRequest, db: Optional[AsyncSession] = None) -> Dict[str, Any]:
        """
        RAG-based Chat Flow:
        User Query -> Vector Retrieval -> Context Builder -> Gemini -> Response
        """
        logger.info(f"Generating RAG chat response for query: '{request.message}'")
        
        # 1. Generate Embedding for the User Query
        try:
            query_embedding = await embedding_adapter.generate_embedding(request.message)
        except Exception as e:
            logger.error(f"Failed to generate embedding for query: {str(e)}")
            raise ValueError("Failed to process query for vector retrieval.")

        # 2. Retrieve top-k context from Vector DB
        top_k = 5
        try:
            # We fetch relevant chunks from vector db
            relevant_chunks = await vector_adapter.query_similarity(
                query_embedding=query_embedding,
                limit=top_k
            )
        except Exception as e:
            logger.error(f"Failed to retrieve vectors: {str(e)}")
            raise ValueError("Failed to retrieve context from vector store.")
            
        logger.info(f"Retrieved context matches: {len(relevant_chunks)} items")
        
        # 3. Context Builder & Chunk Aggregation
        if not relevant_chunks:
            return {
                "answer": "I could not find any relevant context in the uploaded papers to answer your question.",
                "citations": []
            }
            
        context_texts = []
        citations = []
        
        # Aggregate chunks into a single context block while tracking citations
        for idx, chunk in enumerate(relevant_chunks, 1):
            text = chunk.get("text", "")
            chunk_id = chunk.get("id", f"unknown_chunk_{idx}")
            score = chunk.get("score", 0.0)
            
            # Format with explicit citation markers to help reduce hallucination
            context_texts.append(f"[Citation {idx}] {text}")
            citations.append({
                "citation_index": idx,
                "id": chunk_id,
                "text_snippet": text[:100] + "..." if len(text) > 100 else text,
                "relevance_score": score
            })
            
        context_block = "\n\n".join(context_texts)
        
        # 4. Generate Response via Gemini 
        # Hallucination reduction is handled by gemini_adapter's strict system instruction
        try:
            answer = await gemini_adapter.question_answering(
                context=context_block,
                question=request.message
            )
        except Exception as e:
            logger.error(f"Gemini generation failed: {str(e)}")
            raise ValueError("Failed to generate response using the AI model.")
            
        # 5. Citation-Aware Response
        return {
            "answer": answer.strip(),
            "citations": citations
        }

chat_service = ChatService()
