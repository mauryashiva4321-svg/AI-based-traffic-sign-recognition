from ml.inference.detector import TrafficSignDetector
from ml.inference.classifier import TrafficSignClassifier

from ml.utils.image_utils import crop_image
from ml.utils.sign_information import get_sign_information


class DetectionPipeline:
    """
    Traffic sign detection + classification pipeline.

    Models are loaded lazily:
    - YOLO detector loads when the first prediction is requested.
    - CNN classifier loads only when a detected sign needs classification.

    This reduces unnecessary memory usage during startup.
    """

    def __init__(self):
        self.detector = None
        self.classifier = None

    # =====================================================
    # LAZY DETECTOR
    # =====================================================

    def _get_detector(self):
        if self.detector is None:
            print("Loading traffic sign detector...")

            self.detector = TrafficSignDetector()

            print("Traffic sign detector loaded.")

        return self.detector

    # =====================================================
    # LAZY CLASSIFIER
    # =====================================================

    def _get_classifier(self):
        if self.classifier is None:
            print("Loading traffic sign classifier...")

            self.classifier = TrafficSignClassifier()

            print("Traffic sign classifier loaded.")

        return self.classifier

    # =====================================================
    # PREDICTION
    # =====================================================

    def predict(self, image) -> dict:

        if image is None:
            raise ValueError("Input image is empty.")

        # -------------------------------------------------
        # Object detection
        # -------------------------------------------------

        detector = self._get_detector()

        detections = detector.detect(image)

        results = []

        # -------------------------------------------------
        # Classification
        # -------------------------------------------------

        for detection in detections:

            try:

                bbox = detection.get("bbox")

                if not bbox:
                    continue

                cropped_sign = crop_image(
                    image,
                    bbox,
                )

                if cropped_sign is None:
                    continue

                classifier = self._get_classifier()

                classification = classifier.predict(
                    cropped_sign
                )

                class_name = classification.get(
                    "class_name",
                    "Unknown",
                )

                information = get_sign_information(
                    class_name
                )

                results.append(
                    {
                        "bbox": bbox,

                        "detector_confidence": detection.get(
                            "detector_confidence",
                            0.0,
                        ),

                        "class_id": classification.get(
                            "class_id",
                            -1,
                        ),

                        "class_name": class_name,

                        "classification_confidence": classification.get(
                            "confidence",
                            0.0,
                        ),

                        "description": information.get(
                            "description",
                            "",
                        ),

                        "recommended_action": information.get(
                            "recommended_action",
                            "",
                        ),
                    }
                )

            except Exception as error:

                print(
                    f"Detection processing error: {error}"
                )

                continue

        return {
            "total_detections": len(results),
            "detections": results,
        }