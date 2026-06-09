import logging
from typing import List, Dict, Any
from vector_store.chroma_client import chroma_manager
from vector_store.config import CHUNKS_COLLECTION

logger = logging.getLogger("scholar_assist.vector_store")

class PaperIndexer:
    def __init__(self):
        self.client = chroma_manager.get_client()

    async def index_chunks(self, paper_id: str, chunks: List[Dict[str, Any]]) -> bool:
        logger.info(f"Indexing {len(chunks)} chunks for paper {paper_id}")
        
        try:
            collection = self.client.get_or_create_collection(name=CHUNKS_COLLECTION)
            
            ids = [c["id"] for c in chunks]
            documents = [c["text"] for c in chunks]
            embeddings = [c["embedding"] for c in chunks]
            metadatas = [{"paper_id": paper_id, **c.get("metadata", {})} for c in chunks]
            
            collection.add(
                ids=ids,
                documents=documents,
                embeddings=embeddings,
                metadatas=metadatas
            )
            logger.info("Successfully indexed chunks in vector database.")
            return True
        except Exception as e:
            logger.error(f"Error during chunk indexing: {str(e)}")
            return False

paper_indexer = PaperIndexer()
