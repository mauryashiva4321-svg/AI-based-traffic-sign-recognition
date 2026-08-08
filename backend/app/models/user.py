from datetime import datetime, timezone
from bson import ObjectId


def user_document(
    name: str,
    email: str,
    password_hash: str
) -> dict:
    return {
        "name": name,
        "email": email.lower(),
        "password_hash": password_hash,
        "role": "user",
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }


def serialize_user(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user.get("role", "user"),
        "is_active": user.get("is_active", True),
        "created_at": user.get("created_at"),
    }