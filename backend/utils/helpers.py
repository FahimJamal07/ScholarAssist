import re

def clean_text(text: str) -> str:
    """Basic text cleanup function for indexing."""
    if not text:
        return ""
    # Replace multiple spaces/newlines with single ones
    text = re.sub(r'\s+', ' ', text)
    return text.strip()
