from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def register_and_login(email="taskuser@example.com", password="123456"):
    client.post("/api/users/register", json={"email": email, "password": password})
    res = client.post("/api/users/login", data={"username": email, "password": password})
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def create_task(token, title="Test Task", description="Some description"):
    response = client.post("/api/tasks/", headers=token, json={
        "title": title,
        "description": description
    })
    return response


def test_create_and_list_tasks():
    token = register_and_login()
    response = create_task(token)
    assert response.status_code == 200
    task = response.json()
    assert task["title"] == "Test Task"
    assert not task["completed"]

    list_response = client.get("/api/tasks/", headers=token)
    assert list_response.status_code == 200
    assert isinstance(list_response.json(), list)
    assert any(t["id"] == task["id"] for t in list_response.json())

def test_update_task():
    token = register_and_login("updater@example.com")
    task = create_task(token).json()
    task_id = task["id"]

    update_data = {
    "title": "Updated title",
    "description": "Actualizada",
    "completed": True
    }
    response = client.put(f"/api/tasks/{task_id}", headers=token, json=update_data)
    assert response.status_code == 200
    updated = response.json()
    assert updated["title"] == "Updated title"
    assert updated["completed"]
    assert updated["completed_at"] is not None

def test_delete_task_logically():
    token = register_and_login("deleter@example.com")
    task = create_task(token).json()
    task_id = task["id"]

    delete_response = client.delete(f"/api/tasks/{task_id}", headers=token)
    assert delete_response.status_code == 200

 
    list_response = client.get("/api/tasks/", headers=token)
    ids = [t["id"] for t in list_response.json()]
    assert task_id not in ids

def test_get_single_task():
    token = register_and_login("single@example.com")
    task = create_task(token).json()
    task_id = task["id"]

    get_response = client.get(f"/api/tasks/{task_id}", headers=token)
    assert get_response.status_code == 200
    assert get_response.json()["id"] == task_id

def test_error_accessing_other_user_task():
    token1 = register_and_login("user1@example.com")
    token2 = register_and_login("user2@example.com")

    task = create_task(token1).json()
    task_id = task["id"]

    response = client.get(f"/api/tasks/{task_id}", headers=token2)
    assert response.status_code == 404

def test_error_task_not_found():
    token = register_and_login("nonexistent@example.com")
    response = client.get("/api/tasks/99999", headers=token)
    assert response.status_code == 404
