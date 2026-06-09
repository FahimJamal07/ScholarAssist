import os

# ChromaDB configurations
CHROMA_HOST = os.getenv("CHROMA_HOST", "localhost")
CHROMA_PORT = int(os.getenv("CHROMA_PORT", 8000))
CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_data")

# Collections
PAPERS_COLLECTION = "academic_papers"
CHUNKS_COLLECTION = "paper_chunks"
