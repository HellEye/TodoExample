
from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import Body, security
from jose import jwt, JWTError
from pydantic import BaseModel
from fastapi import Depends, HTTPException, status
from db import DB, Prisma, get_db
from fastapi.security import HTTPBasicCredentials, OAuth2PasswordBearer, OAuth2PasswordRequestForm
import bcrypt
import os

# SECRET_KEY = os.getenv("SECRET_KEY")
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# Token =  Annotated[str, Depends(oauth2_scheme)]

# class User(BaseModel):
#     username: str


# class UserInDB(User):
#     hashed_password: str

# def get_user(db:Prisma, token: str):
#     return db.token.find_unique(where={"token": token}, include={"user": {"password": False}}).user

# def verify_password(plain_password, hashed_password):
#     return bcrypt.checkpw(plain_password, hashed_password)


# def get_password_hash(password):
#     return bcrypt.hashpw(password, bcrypt.gensalt())


# def authenticate_user(db:Prisma, username: str, password: str):
#     user = get_user(db, username)
#     if not user:
#         return False
#     if not verify_password(password, user.hashed_password):
#         return False
#     return user


# def create_access_token(data: dict, expires_delta: timedelta | None = None):
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.now(timezone.utc) + expires_delta
#     else:
#         expire = datetime.now(timezone.utc) + timedelta(minutes=15)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY)
#     return encoded_jwt


# async def get_current_user(token:Token, db:Prisma):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, SECRET_KEY)
#         username: str = payload.get("sub")
#         if username is None:
#             raise credentials_exception
#     except JWTError:
#         raise credentials_exception
#     user = get_user(db, username=username)
#     if user is None:
#         raise credentials_exception
#     return user
# def authenticate_user(db: DB, credentials: HTTPBasicCredentials = Depends(security)):
#   user = db.user.find_unique(where={"username":credentials.username})
#   if user is None or not bcrypt.checkpw(credentials.password, user.password):
#     raise HTTPException(
#       status_code=status.HTTP_401_UNAUTHORIZED,
#       detail="Invalid credentials",
#       headers={"WWW-Authenticate": "Basic"},
#     )
#   return user

from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException
from app import login_manager, app
from generated.prisma.models import User
from db.partials import UserBase
prisma = get_db()
@login_manager.user_loader(db=next(prisma))
def load_user(username: str, db:Prisma):
    # user = db.user.find_unique(where={"username":username}, include={"todos":False, "tokens":False})
    user = UserBase.prisma().find_unique(where={"username":username})
    return user



@app.post('/auth/login')
def login(data: Annotated[OAuth2PasswordRequestForm, Depends()], db:DB):
    username = data.username
    password = data.password

    user = db.user.find_unique(where={"username":username}, include={"todos":False, "tokens":False})  # we are using the same function to retrieve the user
    if not user:
        raise InvalidCredentialsException  # you can also use your own HTTPException
    elif not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
        raise InvalidCredentialsException

    access_token = login_manager.create_access_token(
        data=dict(sub=username)
    )
    return {'access_token': access_token, 'token_type': 'bearer'}

@app.post("/auth/register")
def register(db: DB, username:str=Body(...), password:str=Body(...)):
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    user = db.user.create({"username": username, "password": hashed_password.decode("utf-8")})
    return {"message": "User created successfully"}

@app.get("/users/me")
async def read_users_me(
    current_user: Annotated[UserBase, Depends(login_manager)]
):
    return current_user