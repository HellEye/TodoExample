from datetime import datetime, timezone, timedelta
import os
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel
from db.partials import UserBase

from db import DB

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
ALGORITHM = "HS256"
SECRET_KEY = os.getenv("SECRET_KEY")


class TokenData(BaseModel):
    username: str | None = None


class TokenUser(BaseModel):
    username: str | None = None


def create_access_token(data: TokenUser, expires_delta: timedelta | None = None):
    to_encode = dict(data).copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: DB):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    user = UserBase.prisma(db).find_unique(where={"username": token_data.username})

    if user is None:
        raise credentials_exception
    return user


AuthUser = Annotated[UserBase, Depends(get_current_user)]
