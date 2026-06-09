import logging
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from backend.config.settings import settings
from backend.config.logging_config import setup_logging
from backend.config.database import get_db, Base, engine

# Ensure models are imported so Base metadata is populated
import backend.models.database_models 

from backend.api.routes import (
    upload_routes,
    chat_routes,
    comparison_routes,
    literature_routes,
    novelty_routes,
    analytics_routes,
)
from backend.api.middleware.request_logger import RequestLoggerMiddleware
from backend.api.middleware.rate_limiter import RateLimiterMiddleware

setup_logging()
logger = logging.getLogger("scholar_assist")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database schema...")
    try:
        async with engine.begin() as conn:
            # For production, we should ideally use Alembic migrations instead of create_all
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database schema initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize database schema: {e}")
        # Not halting startup to allow API to launch even if DB is unavailable initially
    
    logger.info(f"Starting {settings.PROJECT_NAME}...")
    yield
    logger.info(f"Shutting down {settings.PROJECT_NAME}...")
    await engine.dispose()
    logger.info("Database connection closed.")

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="Full-stack AI Research Intelligence Platform API Layer",
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url=f"{settings.API_V1_STR}/docs",
        redoc_url=f"{settings.API_V1_STR}/redoc",
        lifespan=lifespan
    )

    # CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Logging and Rate Limiting Middleware
    app.add_middleware(RequestLoggerMiddleware)
    app.add_middleware(RateLimiterMiddleware, limit=100, window=60)

    # Custom Exception Handlers
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        logger.error(f"Validation error on {request.method} {request.url.path}: {exc.errors()}")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"success": False, "error": "Validation Error", "details": exc.errors()},
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        logger.exception(f"Unhandled server error on {request.method} {request.url.path}: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "error": "Internal Server Error"},
        )

    # Health Check Endpoint
    @app.get("/health", tags=["System"])
    async def health_check(db: AsyncSession = Depends(get_db)):
        db_status = "ok"
        try:
            await db.execute(text("SELECT 1"))
        except Exception:
            db_status = "unavailable"
            
        return {
            "success": True, 
            "message": "System is healthy", 
            "data": {
                "status": "running", 
                "version": settings.VERSION,
                "database": db_status
            }
        }

    # API Routes Registration
    app.include_router(upload_routes.router, prefix=settings.API_V1_STR, tags=["Upload"])
    app.include_router(chat_routes.router, prefix=settings.API_V1_STR, tags=["Chat"])
    app.include_router(comparison_routes.router, prefix=settings.API_V1_STR, tags=["Compare"])
    app.include_router(literature_routes.router, prefix=settings.API_V1_STR, tags=["Literature Review"])
    app.include_router(novelty_routes.router, prefix=settings.API_V1_STR, tags=["Novelty Detection"])
    app.include_router(analytics_routes.router, prefix=settings.API_V1_STR, tags=["Analytics"])

    return app

app = create_app()

if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
