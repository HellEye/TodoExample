from fastapi import APIRouter
from auth import AuthUser

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
async def read_users_me(current_user: AuthUser):
    return current_user
