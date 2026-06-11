import logging
from typing import Callable, Any

logger = logging.getLogger("scholar_assist.orchestrator.fallback_handler")

class FallbackHandler:
    """Provides resilient execution by routing failed tasks cleanly to alternative AI engines if applicable."""
    
    async def execute_with_fallback(
        self, 
        primary_callable: Callable, 
        fallback_callable: Callable, 
        primary_args: dict, 
        fallback_args: dict, 
        task_name: str
    ) -> Any:
        """
        Executes a primary async operation. On exception, seamlessly redirects identical 
        domain logic to a secondary adapter configuration.
        """
        try:
            logger.info(f"Attempting primary execution for orchestration task: {task_name}")
            return await primary_callable(**primary_args)
        except Exception as e:
            logger.error(f"Primary execution failed critically for {task_name}: {str(e)}")
            logger.info(f"Initiating fallback engine execution for task: {task_name}")
            try:
                return await fallback_callable(**fallback_args)
            except Exception as fallback_error:
                logger.error(f"Fallback execution cascaded into failure for {task_name}: {str(fallback_error)}")
                raise Exception(
                    f"Task '{task_name}' failed completely. "
                    f"Primary Error: {str(e)}, Fallback Error: {str(fallback_error)}"
                )

fallback_handler = FallbackHandler()
