import logging
import psycopg2
from psycopg2.extras import RealDictCursor
from backend.config.settings import settings

logger = logging.getLogger("scholar_assist.database")

class DatabaseConnectionManager:
    def __init__(self):
        self.connection_url = settings.DATABASE_URL
        # Remove sqlite fallback patterns for raw postgres connection
        if self.connection_url.startswith("postgresql+psycopg2://"):
            self.connection_url = self.connection_url.replace("postgresql+psycopg2://", "postgresql://")

    def get_raw_connection(self):
        logger.info("Acquiring raw connection from PostgreSQL")
        try:
            conn = psycopg2.connect(self.connection_url, cursor_factory=RealDictCursor)
            return conn
        except Exception as e:
            logger.error(f"Failed to acquire PostgreSQL connection: {str(e)}")
            raise

db_connection_manager = DatabaseConnectionManager()
