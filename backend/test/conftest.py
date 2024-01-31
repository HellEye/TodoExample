from fastapi.testclient import TestClient
import pytest
from .test_init import db, client


test_user = {"username": "test", "password": "1234"}
test_user_register = {
    "username": "test",
    "password": "1234",
    "repeatPassword": "1234",
}


@pytest.fixture(autouse=True, scope="function")
def setup_function():
    yield
    db.todo.delete_many()
    db.user.delete_many()


@pytest.fixture(scope="function")
def create_user(setup_function):
    client.post("/auth/register", json=test_user_register)


@pytest.fixture(scope="function")
def log_in(create_user):
    res = client.post("/auth/login", data=test_user)
    default_headers = client.headers
    client.headers = {
        **default_headers,
        "Authorization": f"Bearer {res.json()['access_token']}",
    }
    yield
    client.headers = default_headers
