def validate_pdf_file(filename: str, size: int) -> bool:
    """Validate that the uploaded file is indeed a PDF and is under 50MB."""
    if not filename.lower().endswith(".pdf"):
        return False
    if size > 50 * 1024 * 1024:
        return False
    return True
