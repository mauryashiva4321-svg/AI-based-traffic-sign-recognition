from datetime import datetime, timezone

from backend.app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from backend.app.database.mongodb import get_database
from backend.app.models.user import (
    serialize_user,
    user_document,
)


class AuthService:

    @staticmethod
    def signup(
        name: str,
        email: str,
        password: str
    ) -> dict:

        database = get_database()
        users = database["users"]

        email = email.lower().strip()

        existing_user = users.find_one({
            "email": email
        })

        if existing_user:
            raise ValueError(
                "An account with this email already exists"
            )

        new_user = user_document(
            name=name.strip(),
            email=email,
            password_hash=hash_password(password)
        )

        result = users.insert_one(new_user)

        created_user = users.find_one({
            "_id": result.inserted_id
        })

        return serialize_user(created_user)

    @staticmethod
    def login(
        email: str,
        password: str
    ) -> dict:

        database = get_database()
        users = database["users"]

        user = users.find_one({
            "email": email.lower().strip()
        })

        if not user:
            raise ValueError(
                "Invalid email or password"
            )

        if not verify_password(
            password,
            user["password_hash"]
        ):
            raise ValueError(
                "Invalid email or password"
            )

        if not user.get("is_active", True):
            raise ValueError(
                "This account is disabled"
            )

        token = create_access_token({
            "sub": str(user["_id"]),
            "email": user["email"],
            "role": user.get("role", "user")
        })

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": serialize_user(user)
        }

    @staticmethod
    def get_user_by_id(user_id: str) -> dict | None:

        from bson import ObjectId

        database = get_database()
        users = database["users"]

        if not ObjectId.is_valid(user_id):
            return None

        user = users.find_one({
            "_id": ObjectId(user_id)
        })

        if not user:
            return None

        return serialize_user(user)