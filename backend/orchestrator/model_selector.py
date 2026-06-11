import logging
from enum import Enum

logger = logging.getLogger("scholar_assist.orchestrator.model_selector")

class ModelType(Enum):
    GEMINI = "gemini"
    CLAUDE = "claude"
    VECTOR_SEARCH = "vector_search"

class ModelSelector:
    """Maps domain-specific AI tasks to their optimal backend engine."""
    
    def __init__(self):
        # Strict mapping logic anchoring architectures optimally based on instructions.md
        self.task_mappings = {
            "qa": ModelType.GEMINI,
            "summarize": ModelType.GEMINI,
            "explain": ModelType.GEMINI,
            "literature_review": ModelType.CLAUDE,
            "comparative_analysis": ModelType.CLAUDE,
            "scientific_synthesis": ModelType.CLAUDE,
            "semantic_search": ModelType.VECTOR_SEARCH,
        }

    def get_target_model(self, task_type: str) -> ModelType:
        """Resolves the required engine based on abstract task context."""
        target = self.task_mappings.get(task_type.lower())
        if not target:
            logger.warning(f"Unknown task type '{task_type}', defaulting to GEMINI processing.")
            return ModelType.GEMINI
        
        logger.debug(f"Task '{task_type}' cleanly routed to {target.value}.")
        return target

model_selector = ModelSelector()
