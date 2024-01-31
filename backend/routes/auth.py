from datetime import timedelta
from typing import Annotated

import bcrypt
from auth import AuthUser, create_access_token
from db import DB
from errors import InputException, InvalidCredentialsException
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from models.auth import RegisterUser

router = APIRouter(prefix="/auth", tags=["auth"])
EXPIRE_IN = timedelta(minutes=30).seconds


@router.post("/login")
def login(data: Annotated[OAuth2PasswordRequestForm, Depends()], db: DB):
    username = data.username
    password = data.password
    try:
        user = db.user.find_unique(
            where={"username": username}, include={"todos": False, "tokens": False}
        )
    except:
        raise InvalidCredentialsException
    if not user:
        raise InvalidCredentialsException
    elif not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
        raise InvalidCredentialsException

    access_token = create_access_token(
        data=dict(sub=user.username),
    )
    response = JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": EXPIRE_IN,
        },
    )
    return response


@router.post("/register")
def register(db: DB, user: RegisterUser):
    if user.password != user.repeatPassword:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match"
        )
    hashed_password = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())
    try:
        user = db.user.create(
            {"username": user.username, "password": hashed_password.decode("utf-8")}
        )
    except:
        raise InputException().add("username", "Username already exists")
    return {"message": "User created successfully"}


@router.post("/refresh")
def refresh(user: AuthUser):
    access_token = create_access_token(
        data={"user": user.username},
    )
    response = JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": EXPIRE_IN,
        },
    )
    return response


# Doesn't really do anything since we're not storing tokens
# In reality, we'd store the token in the database and delete it from there on logout
@router.post("/logout", response_class=HTMLResponse)
def logout(user: AuthUser):
    res = HTMLResponse(status_code=status.HTTP_200_OK)
    return res
