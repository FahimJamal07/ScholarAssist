import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # App Settings
    PROJECT_NAME: str = "ScholarAssist API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Environment
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    DEBUG: bool = False

    # CORS Settings
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    # Database Configuration - Defaults to asyncpg driver
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/scholar_assist"

    # Vector Store Configuration
    CHROMA_DB_PATH: str = "./chroma_data"
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8000

    # Authentication Configuration
    JWT_SECRET: str = "super-secret-scholar-assist-key-change-this-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # AI API Keys
    GEMINI_API_KEY: str = ""
    CLAUDE_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
