from pathlib import Path
import json


PROJECT_ROOT = Path(__file__).resolve().parents[2]

CLASS_FILE = (
    PROJECT_ROOT
    / "dataset"
    / "classes.json"
)


def load_class_names():

    with open(
        CLASS_FILE,
        "r",
        encoding="utf-8"
    ) as file:

        data = json.load(file)

    return {
        int(key): value
        for key, value in data.items()
    }