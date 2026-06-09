import logging
import logging.config
import sys

def setup_logging() -> None:
    from backend.config.settings import settings

    log_level = "DEBUG" if settings.DEBUG else "INFO"
    
    logging_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "standard": {
                "format": "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "stream": sys.stdout,
                "formatter": "standard",
            },
        },
        "loggers": {
            "scholar_assist": {
                "handlers": ["console"],
                "level": log_level,
                "propagate": False,
            },
            "uvicorn": {
                "handlers": ["console"],
                "level": "INFO",
                "propagate": False,
            },
            "uvicorn.error": {
                "level": "INFO",
            },
            "uvicorn.access": {
                "handlers": ["console"],
                "level": "INFO",
                "propagate": False,
            },
            "sqlalchemy.engine": {
                "handlers": ["console"],
                "level": "WARNING",
                "propagate": False,
            }
        },
        "root": {
            "level": log_level,
            "handlers": ["console"],
        }
    }
    
    logging.config.dictConfig(logging_config)
    logger = logging.getLogger("scholar_assist")
    logger.info("Logging configured successfully.")
