import logging
from typing import List, Dict, Any
from vector_store.chroma_client import chroma_manager
from vector_store.config import CHUNKS_COLLECTION

logger = logging.getLogger("scholar_assist.vector_store")

class PaperRetriever:
    def __init__(self):
        self.client = chroma_manager.get_client()

    async def retrieve_matches(self, query_embedding: List[float], limit: int = 5, paper_filter: List[str] = None) -> List[Dict[str, Any]]:
        logger.info(f"Querying Chroma for matches (limit={limit})")
        
        try:
            collection = self.client.get_collection(name=CHUNKS_COLLECTION)
            
            where_clause = {}
            if paper_filter:
                where_clause = {"paper_id": {"$in": paper_filter}}
                
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=limit,
                where=where_clause if where_clause else None
            )
            
            formatted_results = []
            if results and "documents" in results and results["documents"]:
                docs = results["documents"][0]
                ids = results["ids"][0]
                metadatas = results["metadatas"][0]
                distances = results["distances"][0] if "distances" in results else [0.0] * len(docs)
                
                for i in range(len(docs)):
                    formatted_results.append({
                        "id": ids[i],
                        "text": docs[i],
                        "metadata": metadatas[i],
                        "distance": distances[i]
                    })
            return formatted_results
        except Exception as e:
            logger.error(f"Failed to query vector database: {str(e)}")
            return []

paper_retriever = PaperRetriever()
