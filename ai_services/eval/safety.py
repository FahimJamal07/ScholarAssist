import logging

logger = logging.getLogger("scholar_assist.ai_services.eval")

def evaluate_response_safety(response_text: str) -> bool:
    """Run sanity checks on output to prevent hallucination or toxicity leaks."""
    if not response_text:
        logger.warning("Empty response generated.")
        return False
        
    blocked_keywords = ["unprofessional_word_here", "dummy_toxic_phrase"]
    for word in blocked_keywords:
        if word in response_text.lower():
            logger.error(f"Response failed safety check due to keyword: '{word}'")
            return False
            
    return True
