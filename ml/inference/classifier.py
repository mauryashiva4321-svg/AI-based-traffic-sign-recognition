from pathlib import Path

import cv2
import numpy as np

from ml.utils.class_names import load_class_names


PROJECT_ROOT = Path(__file__).resolve().parents[2]

MODEL_PATH = (
    PROJECT_ROOT
    / "ml"
    / "models"
    / "cnn"
    / "traffic_sign_cnn.keras"
)


class TrafficSignClassifier:
    """
    CNN-based traffic sign classifier.

    TensorFlow is imported lazily so that simply starting
    the FastAPI application does not immediately load the
    TensorFlow runtime.

    The CNN model itself is loaded only when the classifier
    is first created.
    """

    def __init__(self):

        # --------------------------------------------------
        # Validate model
        # --------------------------------------------------

        if not MODEL_PATH.exists():

            raise FileNotFoundError(
                f"CNN model not found: {MODEL_PATH}"
            )

        # --------------------------------------------------
        # Lazy TensorFlow import
        # --------------------------------------------------

        print("Loading TensorFlow...")

        import tensorflow as tf

        self.tf = tf

        print("TensorFlow loaded.")

        # --------------------------------------------------
        # Load CNN model
        # --------------------------------------------------

        print(
            f"Loading CNN model from: {MODEL_PATH}"
        )

        self.model = (
            tf.keras.models.load_model(
                MODEL_PATH
            )
        )

        print("CNN model loaded successfully.")

        # --------------------------------------------------
        # Load class names
        # --------------------------------------------------

        self.class_names = load_class_names()

    # =====================================================
    # PREPROCESS IMAGE
    # =====================================================

    def preprocess(
        self,
        image: np.ndarray,
    ) -> np.ndarray:

        if image is None:
            raise ValueError(
                "Input image is empty."
            )

        image = cv2.resize(
            image,
            (32, 32),
            interpolation=cv2.INTER_AREA,
        )

        image = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2RGB,
        )

        image = image.astype(
            np.float32
        ) / 255.0

        image = np.expand_dims(
            image,
            axis=0,
        )

        return image

    # =====================================================
    # PREDICT
    # =====================================================

    def predict(
        self,
        image: np.ndarray,
    ) -> dict:

        processed_image = self.preprocess(
            image
        )

        predictions = self.model.predict(
            processed_image,
            verbose=0,
        )

        probabilities = predictions[0]

        class_id = int(
            np.argmax(
                probabilities
            )
        )

        confidence = float(
            np.max(
                probabilities
            )
        )

        class_name = (
            self.class_names.get(
                class_id,
                "Unknown Traffic Sign",
            )
        )

        return {
            "class_id": class_id,
            "class_name": class_name,
            "confidence": confidence,
        }