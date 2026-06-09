import logging
from backend.models.request_models import ChatRequest
from backend.adapters.vector_adapter import vector_adapter
from backend.orchestrator.task_router import task_router

logger = logging.getLogger("scholar_assist")

class ChatService:
    async def generate_response(self, request: ChatRequest) -> str:
        logger.info(f"Generating RAG chat response for query: '{request.message}'")
        
        # 1. Retrieve match context from Vector DB
        query_embedding = [0.0] * 768  # Mock query embedding
        relevant_chunks = await vector_adapter.query_similarity(
            query_embedding=query_embedding,
            limit=3
        )
        
        # 2. Build RAG prompt context
        context_text = "\n".join([chunk["text"] for chunk in relevant_chunks])
        logger.debug(f"Retrieved context matches: {len(relevant_chunks)} items")
        
        # 3. Formulate structural task payload
        prompt = (
            f"Use the following retrieved context to answer the user request.\n"
            f"Context:\n{context_text}\n\n"
            f"User Request: {request.message}"
        )
        
        # 4. Route task to LLM orchestrator
        response_data = await task_router.route_task(
            task_type="qa",
            prompt=prompt
        )
        
        return response_data

chat_service = ChatService()
