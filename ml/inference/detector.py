from pathlib import Path

import cv2

from ultralytics import YOLO


PROJECT_ROOT = Path(
    __file__
).resolve().parents[2]


MODEL_PATH = (
    PROJECT_ROOT
    / "ml"
    / "models"
    / "yolo"
    / "traffic_sign_yolo.pt"
)


class TrafficSignDetector:

    def __init__(
        self,
        model_path: str | None = None
    ):

        if model_path:

            self.model = YOLO(
                model_path
            )

        elif MODEL_PATH.exists():

            self.model = YOLO(
                str(MODEL_PATH)
            )

        else:

            raise FileNotFoundError(

                "YOLO model not found. "
                "Train or download a YOLO "
                "traffic sign model first."

            )


    def detect(

        self,

        image,

        confidence: float = 0.25

    ):

        results = self.model.predict(

            source=image,

            conf=confidence,

            verbose=False

        )

        detections = []

        for result in results:

            if result.boxes is None:

                continue


            boxes = (
                result.boxes.xyxy
                .cpu()
                .numpy()
            )

            confidences = (
                result.boxes.conf
                .cpu()
                .numpy()
            )

            class_ids = (
                result.boxes.cls
                .cpu()
                .numpy()
                .astype(int)
            )


            for box, score, class_id in zip(

                boxes,

                confidences,

                class_ids

            ):

                x1, y1, x2, y2 = (

                    map(
                        int,
                        box
                    )

                )


                detections.append({

                    "bbox": {

                        "x1": x1,

                        "y1": y1,

                        "x2": x2,

                        "y2": y2

                    },

                    "detector_confidence":
                    float(score),

                    "class_id":
                    int(class_id)

                })


        return detections