from pathlib import Path

import cv2
import numpy as np
from ultralytics import YOLO


IMAGE_SIZE = (32, 32)

PROJECT_ROOT = Path(__file__).resolve().parents[2]

MODEL_PATH = (
    PROJECT_ROOT
    / "ml"
    / "models"
    / "yolo"
    / "traffic_sign_yolo.pt"
)


def preprocess_image(image: np.ndarray) -> np.ndarray:
    """
    Preprocess image for CNN classification.
    """

    if image is None:
        raise ValueError("Image could not be loaded.")

    image = cv2.resize(image, IMAGE_SIZE)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = image.astype(np.float32) / 255.0

    return image


def crop_image(image, bbox):
    """
    Crop an image using a bounding box.
    Args:image: openCV image(numpy.ndarray)
    bbox: Dictionary with keys x1, y1, x2, y2
    Returns:Cropped image
    """
    if image is None:
        raise ValueError("Image could not be loaded.")
    x1 = max(0, int(bbox["x1"]))
    y1 = max(0, int(bbox["y1"]))
    x2 = min(image.shape[1], int(bbox["x2"]))
    y2 = min(image.shape[0], int(bbox["y2"]))
    if x2<=x1 or y2<=y1:
        raise ValueError("Invalid bounding box.")
    return image[y1:y2, x1:x2]


class TrafficSignDetector:

    def __init__(self, model_path: str | None = None):

        if model_path:
            self.model = YOLO(model_path)

        elif MODEL_PATH.exists():
            self.model = YOLO(str(MODEL_PATH))

        else:
            raise FileNotFoundError(
                f"YOLO model not found: {MODEL_PATH}\n"
                "Train your YOLO model first."
            )

    def detect(self, image, confidence: float = 0.25):

        if isinstance(image, str):
            image = cv2.imread(image)

        if image is None:
            raise ValueError("Image could not be loaded.")

        results = self.model.predict(
            source=image,
            conf=confidence,
            verbose=False,
        )

        detections = []

        for result in results:

            if result.boxes is None:
                continue

            boxes = result.boxes.xyxy.cpu().numpy()
            scores = result.boxes.conf.cpu().numpy()
            class_ids = result.boxes.cls.cpu().numpy().astype(int)

            for box, score, class_id in zip(boxes, scores, class_ids):

                x1, y1, x2, y2 = map(int, box)

                detections.append(
                    {
                        "bbox": {
                            "x1": x1,
                            "y1": y1,
                            "x2": x2,
                            "y2": y2,
                        },
                        "detector_confidence": float(score),
                        "class_id": int(class_id),
                    }
                )

        return detections


if __name__ == "__main__":

    detector = TrafficSignDetector()

    image = cv2.imread("test-sign.jpg")

    detections = detector.detect(image)

    print("Detections:")
    print(detections)