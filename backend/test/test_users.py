from app import app
from fastapi.testclient import TestClient
from .conftest import client


def setup_function():
    pass


def test_user(log_in):
    res = client.get("/users/me")
    assert res.status_code == 200
    json = res.json()
    assert json["username"] == "test"
