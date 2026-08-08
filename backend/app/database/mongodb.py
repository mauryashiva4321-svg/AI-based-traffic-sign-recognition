from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection

from backend.app.config.settings import settings


class MongoDB:
    """
    MongoDB connection manager.
    """

    client: MongoClient | None = None
    database: Database | None = None

    users_collection: Collection | None = None
    predictions_collection: Collection | None = None
    uploads_collection: Collection | None = None
    feedback_collection: Collection | None = None
    logs_collection: Collection | None = None


mongodb = MongoDB()


def connect_to_mongodb() -> None:
    """
    Connect to MongoDB and initialize collections.
    """

    try:
        mongodb.client = MongoClient(settings.mongodb_url)

        mongodb.client.admin.command("ping")

        mongodb.database = mongodb.client[
            settings.mongodb_database
        ]

        mongodb.users_collection = mongodb.database["users"]

        mongodb.predictions_collection = mongodb.database["predictions"]

        mongodb.uploads_collection = mongodb.database["uploads"]

        mongodb.feedback_collection = mongodb.database["feedback"]

        mongodb.logs_collection = mongodb.database["system_logs"]

        print("✅ MongoDB connected successfully")

    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        raise


def close_mongodb_connection() -> None:
    """
    Close MongoDB connection.
    """

    if mongodb.client is not None:
        mongodb.client.close()
        print("✅ MongoDB connection closed")


def get_database() -> Database:
    """
    Return database instance.
    """

    if mongodb.database is None:
        raise RuntimeError(
            "MongoDB database is not initialized."
        )

    return mongodb.database


def check_database_connection() -> bool:
    """
    Check whether MongoDB is connected.
    """

    try:

        if mongodb.client is None:
            return False

        mongodb.client.admin.command("ping")

        return True

    except Exception:
        return False


def get_users_collection() -> Collection:
    if mongodb.users_collection is None:
        raise RuntimeError("Users collection not initialized.")
    return mongodb.users_collection


def get_predictions_collection() -> Collection:
    if mongodb.predictions_collection is None:
        raise RuntimeError("Predictions collection not initialized.")
    return mongodb.predictions_collection


def get_uploads_collection() -> Collection:
    if mongodb.uploads_collection is None:
        raise RuntimeError("Uploads collection not initialized.")
    return mongodb.uploads_collection


def get_feedback_collection() -> Collection:
    if mongodb.feedback_collection is None:
        raise RuntimeError("Feedback collection not initialized.")
    return mongodb.feedback_collection


def get_logs_collection() -> Collection:
    if mongodb.logs_collection is None:
        raise RuntimeError("System Logs collection not initialized.")
    return mongodb.logs_collection