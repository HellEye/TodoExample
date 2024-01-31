from fastapi import HTTPException
from starlette import status
from errors import InputException

UnauthenticatedException = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Not authenticated",
)

InvalidCredentialsException = (
    InputException()
    .add("username", "Invalid credentials")
    .add("password", "Invalid credentials")
)
