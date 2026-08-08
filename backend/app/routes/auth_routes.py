from fastapi import APIRouter

from backend.app.controllers.auth_controller import AuthController
from backend.app.schemas.auth import (
    LoginRequest,
    SignupRequest,
)


router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)


@router.post("/signup")
def signup(payload: SignupRequest):
    return AuthController.signup(payload)


@router.post("/login")
def login(payload: LoginRequest):
    return AuthController.login(payload)