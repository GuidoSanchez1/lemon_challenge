from fastapi.testclient import TestClient
from app.main import app
import pytest

client = TestClient(app)

@pytest.fixture
def test_user():
    return {
        "email": "testuser@example.com",
        "password": "123456"
    }

def test_register_user(test_user):
    response = client.post("/api/users/register", json=test_user)
    assert response.status_code in [200, 400]  # Puede fallar si ya existe
    if response.status_code == 200:
        data = response.json()
        assert data["email"] == test_user["email"]

def test_login_user(test_user):
    response = client.post(
        "/api/users/login",
        data={"username": test_user["email"], "password": test_user["password"]}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
