from pathlib import Path

import cv2
import numpy as np
import tensorflow as tf

from ml.utils.class_names import (
    load_class_names
)


PROJECT_ROOT = Path(__file__).resolve().parents[2]

MODEL_PATH = (
    PROJECT_ROOT
    / "ml"
    / "models"
    / "cnn"
    / "traffic_sign_cnn.keras"
)


class TrafficSignClassifier:

    def __init__(self):

        if not MODEL_PATH.exists():

            raise FileNotFoundError(
                f" CNN model not found:"
                f"{MODEL_PATH}"
            )

        self.model = (
            tf.keras.models.load_model(
                MODEL_PATH
            )
        )

        self.class_names = (
            load_class_names()
        )

    def preprocess(
        self,
        image: np.ndarray
    ) -> np.ndarray:

        image = cv2.resize(
            image,
            (32, 32)
        )

        image = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2RGB
        )

        image = image.astype(
            np.float32
        ) / 255.0

        image = np.expand_dims(
            image,
            axis=0
        )

        return image

    def predict(
        self,
        image: np.ndarray
    ) -> dict:

        processed_image = (
            self.preprocess(image)
        )

        predictions = (
            self.model.predict(
                processed_image,
                verbose=0
            )
        )

        class_id = int(
            np.argmax(
                predictions[0]
            )
        )

        confidence = float(
            np.max(
                predictions[0]
            )
        )

        class_name = (
            self.class_names
            .get(
                class_id,
                "Unknown Traffic Sign"
            )
        )

        return {

            "class_id": class_id,

            "class_name": class_name,

            "confidence": confidence

        }