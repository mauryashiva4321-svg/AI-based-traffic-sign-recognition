from fastapi import HTTPException, status

from backend.app.schemas.auth import (
    LoginRequest,
    SignupRequest,
)
from backend.app.services.auth_service import AuthService


class AuthController:

    @staticmethod
    def signup(payload: SignupRequest):

        try:
            user = AuthService.signup(
                name=payload.name,
                email=payload.email,
                password=payload.password
            )

            return {
                "success": True,
                "message": "Account created successfully",
                "user": user
            }

        except ValueError as error:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(error)
            )

    @staticmethod
    def login(payload: LoginRequest):

        try:
            return {
                "success": True,
                **AuthService.login(
                    email=payload.email,
                    password=payload.password
                )
            }

        except ValueError as error:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=str(error)
            )