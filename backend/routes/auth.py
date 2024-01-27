from typing import Annotated

import bcrypt
from app import app
from fastapi import Body, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from auth.user import User, UserInDB,  get_current_user
from db import DB

# @app.post("/auth/register")
# def register(db: DB, username:str=Body(...), password:str=Body(...)):
#     hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
#     user = db.user.create({"username": username, "hashed_password": hashed_password})
#     return {"message": "User created successfully"}

# @app.post("/auth/login")
# async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: DB):
#     user = db.user.find_unique(where= {"username": form_data.username})
#     if not user:
#         raise HTTPException(status_code=400, detail="Incorrect username or password")
#     hashed_password = bcrypt.checkpw(form_data.password, user.password)
#     if not hashed_password == user.hashed_password:
#         raise HTTPException(status_code=400, detail="Incorrect username or password")
#     token = db.token.create({"user": {"connect": {"id": user.id}},"token":"" })
#     return {"access_token": user.username, "token_type": "bearer"}


# @app.get("/users/me")
# async def read_users_me(
#     current_user: Annotated[User, Depends(get_current_user)]
# ):
#     return current_user