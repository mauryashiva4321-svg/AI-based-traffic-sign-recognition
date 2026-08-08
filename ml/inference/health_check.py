from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]

MODEL_PATH = (
    PROJECT_ROOT
    / "ml"
    / "models"
    / "cnn"
    / "traffic_sign_cnn.keras"
)


def main():

    if MODEL_PATH.exists():

        print(
            "CNN model is available."
        )

        print(
            MODEL_PATH
        )

    else:

        print(
            "CNN model is not available."
        )

        print(
            "Train the model first."
        )


if __name__ == "__main__":

    main()