from bson import ObjectId

from fastapi import (
    HTTPException,
    UploadFile,
    status,
)

from backend.app.config.settings import settings
from backend.app.database.mongodb import get_predictions_collection
from backend.app.services.file_service import file_service
from backend.app.services.prediction_service import prediction_service
from backend.app.utils.file_validation import (
    validate_file_size,
    validate_image_file,
    validate_video_file,
)


class PredictionController:
    """
    Controller for Traffic Sign Prediction APIs.
    Handles:
        - Image Prediction
        - Video Prediction
        - Live Prediction
        - Prediction History
        - Delete Prediction
    """

    # =====================================================
    # IMAGE PREDICTION
    # =====================================================

    async def predict_image(
        self,
        file: UploadFile,
        user_id: str,
    ) -> dict:

        try:

            validate_image_file(
                file.filename,
                file.content_type,
            )

            file_content = await file.read()

            validate_file_size(
                len(file_content),
                settings.max_file_size_mb,
            )

            await file.seek(0)

            saved_file = await file_service.save_image(file)

            return prediction_service.predict_image(
                image_path=saved_file["path"],
                user_id=user_id,
            )

        except FileNotFoundError as error:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(error),
            )

        except ValueError as error:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(error),
            )

        except HTTPException:
            raise

        except Exception as error:

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Image prediction failed: {error}",
            )

    # =====================================================
    # VIDEO PREDICTION
    # =====================================================

    async def predict_video(
        self,
        file: UploadFile,
        user_id: str,
    ) -> dict:

        try:

            validate_video_file(
                file.filename,
                file.content_type,
            )

            file_content = await file.read()

            validate_file_size(
                len(file_content),
                settings.max_file_size_mb,
            )

            await file.seek(0)

            saved_file = await file_service.save_video(file)

            return prediction_service.predict_video(
                video_path=saved_file["path"],
                user_id=user_id,
            )

        except FileNotFoundError as error:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(error),
            )

        except ValueError as error:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(error),
            )

        except HTTPException:
            raise

        except Exception as error:

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Video prediction failed: {error}",
            )

    # =====================================================
    # LIVE FRAME PREDICTION
    # =====================================================

    async def predict_frame(
        self,
        frame,
    ) -> dict:

        try:

            return prediction_service.predict_frame(frame)

        except Exception as error:

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Live prediction failed: {error}",
            )

    # =====================================================
    # GET USER HISTORY
    # =====================================================

    async def get_history(
        self,
        user_id: str,
    ) -> dict:

        try:

            history = prediction_service.get_history(user_id)

            return {
                "success": True,
                "total": len(history),
                "predictions": history,
            }

        except Exception as error:

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(error),
            )

    # =====================================================
    # DELETE PREDICTION
    # =====================================================

    async def delete_prediction(
        self,
        prediction_id: str,
        user_id: str,
    ) -> dict:

        if not ObjectId.is_valid(prediction_id):

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid prediction ID.",
            )

        predictions_collection = get_predictions_collection()

        result = predictions_collection.delete_one(
            {
                "_id": ObjectId(prediction_id),
                "user_id": user_id,
            }
        )

        if result.deleted_count == 0:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Prediction not found.",
            )

        return {
            "success": True,
            "message": "Prediction deleted successfully.",
        }


prediction_controller = PredictionController()