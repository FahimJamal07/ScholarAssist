def test_health_check(client):
    """Test health check route."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["message"] == "System is healthy"

def test_upload_invalid_extension(client):
    """Test PDF validator extension rejection."""
    # Send a plain text file payload
    files = {"file": ("test.txt", b"some dummy text", "text/plain")}
    response = client.post("/api/upload", files=files)
    assert response.status_code == 400
    assert response.json()["success"] is False
    assert "PDF" in response.json()["error"]
