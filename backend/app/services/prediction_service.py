from datetime import datetime
from pathlib import Path

import cv2
from bson import ObjectId

from backend.app.database.mongodb import get_predictions_collection
from ml.inference.pipeline import DetectionPipeline


class PredictionService:
    """
    Handles all AI prediction operations including:
    - Image prediction
    - Video prediction
    - Live webcam prediction
    - Prediction history
    """

    def __init__(self):
        self.pipeline = DetectionPipeline()
        self.predictions = None

    def _get_predictions_collection(self):
        """
        Initialize MongoDB collection only after
        FastAPI has connected to MongoDB.
        """
        if self.predictions is None:
            self.predictions = get_predictions_collection()

        return self.predictions

    # =====================================================
    # IMAGE PREDICTION
    # =====================================================

    def predict_image(
        self,
        image_path: str,
        user_id: str = "guest",
    ) -> dict:

        predictions = self._get_predictions_collection()

        path = Path(image_path)

        if not path.exists():
            raise FileNotFoundError(
                f"Image file not found: {image_path}"
            )

        image = cv2.imread(str(path))

        if image is None:
            raise ValueError(
                "Unable to read image."
            )

        prediction = self.pipeline.predict(image)

        history = {
            "user_id": user_id,
            "filename": path.name,
            "prediction_type": "image",
            "detections": prediction.get("detections", []),
            "total_detections": prediction.get(
                "total_detections", 0
            ),
            "created_at": datetime.utcnow(),
        }

        predictions.insert_one(history)

        return {
            "success": True,
            "prediction_type": "image",
            **prediction,
        }

    # =====================================================
    # VIDEO PREDICTION
    # =====================================================

    def predict_video(
        self,
        video_path: str,
        user_id: str = "guest",
    ) -> dict:

        predictions = self._get_predictions_collection()

        path = Path(video_path)

        if not path.exists():
            raise FileNotFoundError(
                f"Video file not found: {video_path}"
            )

        capture = cv2.VideoCapture(str(path))

        if not capture.isOpened():
            raise ValueError(
                "Unable to open video."
            )

        results = []
        frame_number = 0

        while True:

            success, frame = capture.read()

            if not success:
                break

            frame_number += 1

            # Process every 10th frame
            if frame_number % 10 != 0:
                continue

            prediction = self.pipeline.predict(frame)

            if prediction.get("total_detections", 0) > 0:

                results.append(
                    {
                        "frame": frame_number,
                        "detections": prediction["detections"],
                    }
                )

        capture.release()

        history = {
            "user_id": user_id,
            "filename": path.name,
            "prediction_type": "video",
            "frames_processed": frame_number,
            "frames_with_detections": len(results),
            "results": results,
            "created_at": datetime.utcnow(),
        }

        predictions.insert_one(history)

        return {
            "success": True,
            "prediction_type": "video",
            "frames_processed": frame_number,
            "frames_with_detections": len(results),
            "results": results,
        }

    # =====================================================
    # LIVE FRAME PREDICTION
    # =====================================================

    def predict_frame(self, frame) -> dict:

        if frame is None:
            raise ValueError(
                "Frame is empty."
            )

        return self.pipeline.predict(frame)

    # =====================================================
    # PREDICTION HISTORY
    # =====================================================

    def get_history(self, user_id: str):

        predictions = self._get_predictions_collection()

        history = list(
            predictions.find(
                {"user_id": user_id},
                {"_id": 0},
            ).sort("created_at", -1)
        )

        return history

    # =====================================================
    # DELETE HISTORY
    # =====================================================

    def delete_prediction(
        self,
        prediction_id: str,
    ) -> bool:

        predictions = self._get_predictions_collection()

        result = predictions.delete_one(
            {
                "_id": ObjectId(prediction_id)
            }
        )

        return result.deleted_count > 0


# =====================================================
# Singleton Instance
# =====================================================

prediction_service = PredictionService()