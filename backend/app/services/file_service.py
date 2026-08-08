from pathlib import Path
from uuid import uuid4

import aiofiles
from fastapi import UploadFile

from backend.app.config.settings import settings


class FileService:
    """
    Handles file operations including:
    - Saving images
    - Saving videos
    - Deleting files
    - Checking file existence
    """

    def __init__(self):

        # Upload directory from settings
        self.upload_root = Path(settings.upload_dir)

        self.images_dir = self.upload_root / "images"
        self.videos_dir = self.upload_root / "videos"

        self.images_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        self.videos_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

    # =====================================================
    # SAVE IMAGE
    # =====================================================

    async def save_image(
        self,
        file: UploadFile,
    ) -> dict:

        extension = Path(file.filename).suffix.lower()

        filename = f"{uuid4().hex}{extension}"

        filepath = self.images_dir / filename

        content = await file.read()

        async with aiofiles.open(
            filepath,
            "wb",
        ) as buffer:

            await buffer.write(content)

        await file.seek(0)

        return {
            "filename": filename,
            "path": str(filepath),
            "size": len(content),
        }

    # =====================================================
    # SAVE VIDEO
    # =====================================================

    async def save_video(
        self,
        file: UploadFile,
    ) -> dict:

        extension = Path(file.filename).suffix.lower()

        filename = f"{uuid4().hex}{extension}"

        filepath = self.videos_dir / filename

        content = await file.read()

        async with aiofiles.open(
            filepath,
            "wb",
        ) as buffer:

            await buffer.write(content)

        await file.seek(0)

        return {
            "filename": filename,
            "path": str(filepath),
            "size": len(content),
        }

    # =====================================================
    # DELETE FILE
    # =====================================================

    def delete_file(
        self,
        filepath: str,
    ) -> bool:

        path = Path(filepath)

        if path.exists():

            path.unlink()

            return True

        return False

    # =====================================================
    # CHECK FILE EXISTS
    # =====================================================

    def exists(
        self,
        filepath: str,
    ) -> bool:

        return Path(filepath).exists()


# =====================================================
# Singleton Instance
# =====================================================

file_service = FileService()