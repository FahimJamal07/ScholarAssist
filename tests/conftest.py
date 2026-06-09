import pytest
from fastapi.testclient import TestClient
from backend.main import app

@pytest.fixture(scope="module")
def client():
    """Get a FastAPI client instance for integration tests."""
    with TestClient(app) as c:
        yield c
