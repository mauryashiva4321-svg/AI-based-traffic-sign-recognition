from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
)

from backend.app.controllers.prediction_controller import (
    prediction_controller,
)

from backend.app.middleware.auth_middleware import (
    get_current_user,
)

from backend.app.schemas.prediction import (
    PredictionResponse,
    PredictionListResponse,
    DeletePredictionResponse,
)


router = APIRouter(
    prefix="/api/v1/predictions",
    tags=["Predictions"],
)


# =====================================================
# IMAGE PREDICTION
# =====================================================

@router.post(
    "/image",
    response_model=PredictionResponse,
)
async def predict_image(

    file: UploadFile = File(...),

    current_user: dict = Depends(
        get_current_user
    ),

):

    return await prediction_controller.predict_image(

        file=file,

        user_id=current_user["sub"],

    )


# =====================================================
# VIDEO PREDICTION
# =====================================================

@router.post(
    "/video",
    response_model=PredictionResponse,
)
async def predict_video(

    file: UploadFile = File(...),

    current_user: dict = Depends(
        get_current_user
    ),

):

    return await prediction_controller.predict_video(

        file=file,

        user_id=current_user["sub"],

    )


# =====================================================
# PREDICTION HISTORY
# =====================================================

@router.get(
    "/history",
    response_model=PredictionListResponse,
)
async def prediction_history(

    current_user: dict = Depends(
        get_current_user
    ),

):

    return await prediction_controller.get_history(

        current_user["sub"]

    )


# =====================================================
# DELETE PREDICTION
# =====================================================

@router.delete(
    "/{prediction_id}",
    response_model=DeletePredictionResponse,
)
async def delete_prediction(

    prediction_id: str,

    current_user: dict = Depends(
        get_current_user
    ),

):

    return await prediction_controller.delete_prediction(

        prediction_id=prediction_id,

        user_id=current_user["sub"],

    )


# =====================================================
# HEALTH CHECK
# =====================================================

@router.get(
    "/ping",
)
async def ping():

    return {

        "success": True,

        "message": "Prediction API is running."

    }