from pathlib import Path

from fastapi import HTTPException, status


# ==========================================================
# ALLOWED IMAGE EXTENSIONS
# ==========================================================

IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".webp",
}


# ==========================================================
# ALLOWED VIDEO EXTENSIONS
# ==========================================================

VIDEO_EXTENSIONS = {
    ".mp4",
    ".avi",
    ".mov",
    ".mkv",
    ".wmv",
}


# ==========================================================
# ALLOWED IMAGE MIME TYPES
# ==========================================================

IMAGE_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/bmp",
    "image/webp",
}


# ==========================================================
# ALLOWED VIDEO MIME TYPES
# ==========================================================

VIDEO_CONTENT_TYPES = {
    "video/mp4",
    "video/x-msvideo",
    "video/quicktime",
    "video/x-matroska",
    "video/x-ms-wmv",
}


# ==========================================================
# IMAGE VALIDATION
# ==========================================================

def validate_image_file(
    filename: str,
    content_type: str,
) -> None:

    if not filename:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is required.",
        )

    extension = Path(filename).suffix.lower()

    if extension not in IMAGE_EXTENSIONS:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Unsupported image extension. "
                "Allowed: JPG, JPEG, PNG, BMP, WEBP."
            ),
        )

    if content_type not in IMAGE_CONTENT_TYPES:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image content type.",
        )


# ==========================================================
# VIDEO VALIDATION
# ==========================================================

def validate_video_file(
    filename: str,
    content_type: str,
) -> None:

    if not filename:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is required.",
        )

    extension = Path(filename).suffix.lower()

    if extension not in VIDEO_EXTENSIONS:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Unsupported video extension. "
                "Allowed: MP4, AVI, MOV, MKV, WMV."
            ),
        )

    if content_type not in VIDEO_CONTENT_TYPES:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid video content type.",
        )


# ==========================================================
# FILE SIZE VALIDATION
# ==========================================================

def validate_file_size(
    file_size: int,
    max_size_mb: int,
) -> None:

    max_size_bytes = max_size_mb * 1024 * 1024

    if file_size > max_size_bytes:

        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=(
                f"File size exceeds the maximum "
                f"allowed limit of {max_size_mb} MB."
            ),
        )