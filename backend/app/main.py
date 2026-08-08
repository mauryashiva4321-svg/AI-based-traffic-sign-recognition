from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.config.settings import settings

from backend.app.database.mongodb import (
    connect_to_mongodb,
    close_mongodb_connection,
    check_database_connection,
)

from backend.app.routes.auth_routes import (
    router as auth_router,
)

from backend.app.routes.user_routes import (
    router as user_router,
)

from backend.app.routes.prediction_routes import (
    router as prediction_router,
)

from backend.app.routes.live_detection_routes import (
    router as live_detection_router,
)

from backend.app.websocket.live_detection import (
    router as live_ws_router
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown events.
    """

    print("Starting AI Traffic Sign Recognition API...")

    connect_to_mongodb()

    if check_database_connection():
        print("MongoDB connection established.")
    else:
        print("MongoDB connection failed.")

    yield

    print("Shutting down API...")

    close_mongodb_connection()


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="AI-Based Traffic Sign Recognition System API",
    lifespan=lifespan,
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# ROUTES
# --------------------------------------------------

app.include_router(auth_router)

app.include_router(user_router)

app.include_router(prediction_router)

app.include_router(
    live_detection_router
)

app.include_router(
    live_ws_router
)
# --------------------------------------------------
# ROOT
# --------------------------------------------------

@app.get("/", tags=["Root"])
def root():

    return {
        "success": True,
        "application": settings.app_name,
        "version": "1.0.0",
        "message": "AI Traffic Sign Recognition API is running",
    }


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/health", tags=["Health"])
def health():

    database_status = check_database_connection()

    return {
        "status": "healthy",
        "database": (
            "connected"
            if database_status
            else "disconnected"
        ),
        "service": "traffic-sign-recognition-api",
    }