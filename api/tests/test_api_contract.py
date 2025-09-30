from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_beaches_list_contract():
    response = client.get("/beaches")
    assert response.status_code == 200
    body = response.json()
    assert "data" in body and isinstance(body["data"], list)
    assert "meta" in body and "count" in body["meta"]
