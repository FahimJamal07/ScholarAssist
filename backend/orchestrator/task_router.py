import logging
from typing import Any

from backend.adapters.gemini_adapter import gemini_adapter
from backend.adapters.claude_adapter import claude_adapter
from backend.orchestrator.model_selector import model_selector, ModelType
from backend.orchestrator.fallback_handler import fallback_handler

logger = logging.getLogger("scholar_assist.orchestrator.task_router")

class TaskRouter:
    """
    Central orchestration layer. Intercepts service requests, maps domain logic to ModelSelector, 
    and securely dispatches operations to explicit adapter bindings alongside fallback boundaries.
    """
    
    async def route_task(self, task_type: str, **kwargs) -> Any:
        """Intelligently dispatches an abstracted task type resolving arguments downstream."""
        target_model = model_selector.get_target_model(task_type)
        logger.info(f"Orchestrator mapped task '{task_type}' natively to {target_model.name}")
        
        if target_model == ModelType.GEMINI:
            return await self._execute_gemini_task(task_type, **kwargs)
        elif target_model == ModelType.CLAUDE:
            return await self._execute_claude_task(task_type, **kwargs)
        elif target_model == ModelType.VECTOR_SEARCH:
            return await self._execute_vector_search(**kwargs)
        else:
            raise ValueError(f"Critical execution error: Unsupported routing model target: {target_model}")

    async def _execute_gemini_task(self, task_type: str, **kwargs) -> Any:
        if task_type == "qa":
            context = kwargs.get("context", "")
            question = kwargs.get("question") or kwargs.get("prompt", "")
            
            # Critical Task Mapping: Utilize cross-provider fallback logic securely
            return await fallback_handler.execute_with_fallback(
                primary_callable=gemini_adapter.question_answering,
                fallback_callable=claude_adapter.generate_scientific_synthesis,
                primary_args={"context": context, "question": question},
                fallback_args={"context": context, "focus_area": question},
                task_name=f"Gemini_QA"
            )
        elif task_type == "summarize":
            return await gemini_adapter.summarize_text(text=kwargs.get("text", ""))
        elif task_type == "explain":
            return await gemini_adapter.generate_explanation(
                text=kwargs.get("text", ""),
                target_audience=kwargs.get("target_audience", "undergraduate student")
            )
        else:
            raise ValueError(f"Unmapped internal Gemini task execution requested: {task_type}")

    async def _execute_claude_task(self, task_type: str, **kwargs) -> Any:
        if task_type == "literature_review":
            theme = kwargs.get("theme") or kwargs.get("prompt", "General Synthesis")
            context = kwargs.get("papers_context") or kwargs.get("context", "")
            
            # Utilize cross-provider fallback routing Claude -> Gemini for catastrophic API failure
            return await fallback_handler.execute_with_fallback(
                primary_callable=claude_adapter.generate_literature_review,
                fallback_callable=gemini_adapter.question_answering,
                primary_args={"theme": theme, "papers_context": context},
                fallback_args={"context": context, "question": f"Synthesize a literature review extensively on: {theme}"},
                task_name="Claude_Literature_Review"
            )
            
        elif task_type == "comparative_analysis":
            return await claude_adapter.run_comparative_analysis(
                aspects=kwargs.get("aspects", []), 
                papers_context=kwargs.get("papers_context", "")
            )
        elif task_type == "scientific_synthesis":
            return await claude_adapter.generate_scientific_synthesis(
                context=kwargs.get("context", ""), 
                focus_area=kwargs.get("focus_area", "")
            )
        else:
            raise ValueError(f"Unmapped internal Claude task execution requested: {task_type}")

    async def _execute_vector_search(self, **kwargs) -> Any:
        # Conceptual placeholder tying to upcoming Vector retrieval endpoints
        logger.info("Executing vector semantic search placeholder resolution.")
        query = kwargs.get("query", "")
        # Anticipated: await vector_adapter.retrieve_semantic_chunks(query=query)
        return [{"source": "mock_chunk", "content": f"Mock semantic search extraction results for '{query}'"}]

task_router = TaskRouter()
