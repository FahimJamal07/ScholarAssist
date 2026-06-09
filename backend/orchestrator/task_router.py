import logging
from backend.orchestrator.model_selector import model_selector
from backend.orchestrator.fallback_handler import fallback_handler
from backend.adapters.gemini_adapter import gemini_adapter
from backend.adapters.claude_adapter import claude_adapter

logger = logging.getLogger("scholar_assist")

class TaskRouter:
    async def route_task(self, task_type: str, prompt: str) -> str:
        logger.info(f"Task router analyzing task: '{task_type}'")
        
        # 1. Determine model based on task type
        model_choice = model_selector.select_model(task_type)
        logger.info(f"Task router selected: {model_choice} for {task_type}")
        
        try:
            # 2. Invoke appropriate model adapter
            if model_choice == "gemini":
                return await gemini_adapter.generate_text(prompt)
            elif model_choice == "claude":
                return await claude_adapter.generate_text(prompt)
            else:
                raise ValueError(f"Unsupported model provider: {model_choice}")
        except Exception as e:
            logger.warning(f"Primary adapter failed for {model_choice}: {str(e)}")
            # 3. Fallback routing if first model fails
            fallback_provider = fallback_handler.get_fallback(model_choice)
            logger.info(f"Routing task to fallback provider: {fallback_provider}")
            
            if fallback_provider == "gemini":
                return await gemini_adapter.generate_text(prompt)
            elif fallback_provider == "claude":
                return await claude_adapter.generate_text(prompt)
            else:
                raise RuntimeError("Primary model failed and no fallback available.") from e

task_router = TaskRouter()
