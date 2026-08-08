from fastapi import APIRouter, Depends, HTTPException

from backend.app.middleware.auth_middleware import get_current_user
from backend.app.services.auth_service import AuthService


router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"]
)


@router.get("/profile")
def get_profile(
    current_user: dict = Depends(get_current_user)
):

    user = AuthService.get_user_by_id(
        current_user["sub"]
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "success": True,
        "user": user
    }