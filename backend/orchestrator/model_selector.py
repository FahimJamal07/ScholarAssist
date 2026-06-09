import logging

logger = logging.getLogger("scholar_assist")

class ModelSelector:
    def __init__(self):
        # Maps task types to model providers
        self.routes = {
            "qa": "gemini",
            "summarization": "gemini",
            "explanation": "gemini",
            "literature_review": "claude",
            "comparison": "claude",
            "novelty_detection": "claude",
        }

    def select_model(self, task_type: str) -> str:
        provider = self.routes.get(task_type.lower())
        if not provider:
            logger.warning(f"Unknown task type '{task_type}', defaulting to Gemini")
            return "gemini"
        return provider

model_selector = ModelSelector()
