import logging
from typing import List

logger = logging.getLogger("scholar_assist")

class EmbeddingAdapter:
    async def generate_embedding(self, text: str) -> List[float]:
        logger.info(f"Generating embedding vector for text length: {len(text)}")
        # In a real environment, call Gemini Embedding API or sentence-transformers
        # E.g. genai.embed_content(model="models/embedding-001", content=text)
        return [0.1] * 768  # Return 768-dimension mock vector

embedding_adapter = EmbeddingAdapter()
