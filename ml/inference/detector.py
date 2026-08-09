from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]

MODEL_PATH = (
    PROJECT_ROOT
    / "ml"
    / "models"
    / "yolo"
    / "traffic_sign_yolo.pt"
)


class TrafficSignDetector:
    """
    YOLO-based traffic sign detector.

    Ultralytics/YOLO is imported and initialized lazily.
    This prevents the YOLO runtime from being loaded when
    FastAPI starts.
    """

    def __init__(
        self,
        model_path: str | None = None,
    ):

        # --------------------------------------------------
        # Determine model path
        # --------------------------------------------------

        if model_path:
            self.model_path = Path(model_path)

        else:
            self.model_path = MODEL_PATH

        # --------------------------------------------------
        # Validate model
        # --------------------------------------------------

        if not self.model_path.exists():

            raise FileNotFoundError(
                f"YOLO model not found: "
                f"{self.model_path}"
            )

        # --------------------------------------------------
        # Model is initially unloaded
        # --------------------------------------------------

        self.model = None

    # =====================================================
    # LAZY YOLO MODEL
    # =====================================================

    def _get_model(self):
        """
        Load Ultralytics YOLO only when the first detection
        request is received.
        """

        if self.model is None:

            print("Loading Ultralytics YOLO...")

            # Lazy import.
            from ultralytics import YOLO

            self.model = YOLO(
                str(self.model_path)
            )

            print(
                "YOLO model loaded successfully."
            )

        return self.model

    # =====================================================
    # DETECTION
    # =====================================================

    def detect(
        self,
        image,
        confidence: float = 0.25,
    ):
        """
        Detect traffic signs in an image.

        Returns:
            [
                {
                    "bbox": {
                        "x1": int,
                        "y1": int,
                        "x2": int,
                        "y2": int,
                    },
                    "detector_confidence": float,
                    "class_id": int,
                }
            ]
        """

        if image is None:
            raise ValueError(
                "Input image is empty."
            )

        model = self._get_model()

        # --------------------------------------------------
        # YOLO inference
        # --------------------------------------------------

        results = model.predict(
            source=image,
            conf=confidence,
            verbose=False,
            device="cpu",
        )

        detections = []

        # --------------------------------------------------
        # Process results
        # --------------------------------------------------

        for result in results:

            if result.boxes is None:
                continue

            if len(result.boxes) == 0:
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

            # ----------------------------------------------
            # Build detection response
            # ----------------------------------------------

            for box, score, class_id in zip(
                boxes,
                confidences,
                class_ids,
            ):

                x1, y1, x2, y2 = map(
                    int,
                    box,
                )

                detections.append(
                    {
                        "bbox": {
                            "x1": x1,
                            "y1": y1,
                            "x2": x2,
                            "y2": y2,
                        },
                        "detector_confidence": float(
                            score
                        ),
                        "class_id": int(
                            class_id
                        ),
                    }
                )

        return detections