import pytest
from fastapi.testclient import TestClient
from .test_init import db, client
from .conftest import test_user, test_user_register


def test_not_logged_in():
    res = client.get("/users/me")
    assert res.status_code == 401
    assert res.json() == {"detail": "Not authenticated"}


def test_login_no_user():
    res = client.post("/auth/login", data=test_user)
    assert res.status_code == 422
    assert res.json() == {
        "message": "Invalid input",
        "fields": {
            "username": "Invalid credentials",
            "password": "Invalid credentials",
        },
    }


def test_register():
    res = client.post("/auth/register", json=test_user_register)
    assert res.status_code == 200
    assert res.json() == {"message": "User created successfully"}


def test_login(create_user):
    res = client.post("/auth/login", data=test_user)
    assert res.status_code == 200
    assert res.json()["access_token"] is not None
    assert res.json()["token_type"] == "bearer"
    assert res.json()["expires_in"] > 0
