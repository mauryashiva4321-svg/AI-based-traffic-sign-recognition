from pathlib import Path

import cv2

from ml.inference.classifier import (
    TrafficSignClassifier
)


PROJECT_ROOT = Path(__file__).resolve().parents[2]

TEST_IMAGE = (
    PROJECT_ROOT
    / "test-sign.jpg"
)


def main():

    if not TEST_IMAGE.exists():

        print(
            "Place a traffic sign image at:"
        )

        print(
            TEST_IMAGE
        )

        return

    image = cv2.imread(
        str(TEST_IMAGE)
    )

    classifier = (
        TrafficSignClassifier()
    )

    result = (
        classifier.predict(
            image
        )
    )

    print(
        result
    )


if __name__ == "__main__":

    main()