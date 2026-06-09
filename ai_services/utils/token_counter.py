def count_tokens_approx(text: str) -> int:
    """Approximate token counts when actual tokenizer models are offline (1 token ~ 4 characters)."""
    if not text:
        return 0
    return len(text) // 4
