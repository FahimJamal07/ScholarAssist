import logging
import chromadb
from vector_store.config import CHROMA_DB_PATH

logger = logging.getLogger("scholar_assist.vector_store")

class ChromaClientManager:
    def __init__(self):
        self._client = None

    def get_client(self) -> chromadb.API:
        if not self._client:
            logger.info(f"Initializing ChromaDB PersistentClient at path: {CHROMA_DB_PATH}")
            try:
                self._client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
            except Exception as e:
                logger.error(f"Failed to connect to ChromaDB: {str(e)}")
                raise
        return self._client

chroma_manager = ChromaClientManager()
