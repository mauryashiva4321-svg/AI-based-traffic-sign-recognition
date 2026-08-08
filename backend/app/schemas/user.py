from pydantic import BaseModel, EmailStr, Field


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    is_active: bool


class UpdateProfileRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)