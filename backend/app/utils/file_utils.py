import shutil
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile


# ==========================================================
# PROJECT PATHS
# ==========================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]

UPLOADS_DIR = PROJECT_ROOT / "uploads"

IMAGES_DIR = UPLOADS_DIR / "images"

VIDEOS_DIR = UPLOADS_DIR / "videos"


IMAGES_DIR.mkdir(
    parents=True,
    exist_ok=True
)

VIDEOS_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ==========================================================
# ALLOWED FILE TYPES
# ==========================================================

ALLOWED_IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp"
}

ALLOWED_VIDEO_EXTENSIONS = {
    ".mp4",
    ".avi",
    ".mov",
    ".mkv"
}


# ==========================================================
# VALIDATION
# ==========================================================

def validate_image(file: UploadFile):

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_IMAGE_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail="Unsupported image format."
        )


def validate_video(file: UploadFile):

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_VIDEO_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail="Unsupported video format."
        )


# ==========================================================
# UNIQUE FILE NAME
# ==========================================================

def generate_filename(filename: str) -> str:

    extension = Path(filename).suffix.lower()

    return f"{uuid.uuid4().hex}{extension}"


# ==========================================================
# SAVE IMAGE
# ==========================================================

def save_image(file: UploadFile) -> Path:

    validate_image(file)

    filename = generate_filename(file.filename)

    destination = IMAGES_DIR / filename

    with destination.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return destination


# ==========================================================
# SAVE VIDEO
# ==========================================================

def save_video(file: UploadFile) -> Path:

    validate_video(file)

    filename = generate_filename(file.filename)

    destination = VIDEOS_DIR / filename

    with destination.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return destination


# ==========================================================
# DELETE FILE
# ==========================================================

def delete_file(path: str | Path):

    file_path = Path(path)

    if file_path.exists():

        file_path.unlink()


# ==========================================================
# FILE INFORMATION
# ==========================================================

def get_file_information(path: str | Path):

    file_path = Path(path)

    return {

        "filename": file_path.name,

        "extension": file_path.suffix,

        "size_bytes": file_path.stat().st_size,

        "absolute_path": str(file_path.resolve())

    }