import logging

logger = logging.getLogger("scholar_assist")

class FallbackHandler:
    def __init__(self):
        # Maps failed model provider to fallback provider
        self.fallbacks = {
            "gemini": "claude",
            "claude": "gemini"
        }

    def get_fallback(self, failed_provider: str) -> str:
        fallback = self.fallbacks.get(failed_provider.lower())
        logger.info(f"Fallback determined for '{failed_provider}': '{fallback}'")
        return fallback

fallback_handler = FallbackHandler()
