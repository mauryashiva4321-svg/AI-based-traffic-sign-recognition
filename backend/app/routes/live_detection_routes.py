from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

import cv2
import numpy as np

from backend.app.controllers.prediction_controller import (
    prediction_controller,
)

from backend.app.middleware.auth_middleware import (
    get_current_user,
)

router = APIRouter(
    prefix="/api/v1/live",
    tags=["Live Detection"],
)


@router.post("/frame")
async def detect_frame(

    image: bytes,

    current_user: dict = Depends(
        get_current_user
    )

):

    try:

        frame = cv2.imdecode(

            np.frombuffer(
                image,
                np.uint8
            ),

            cv2.IMREAD_COLOR

        )

        if frame is None:

            raise HTTPException(

                status_code=400,

                detail="Invalid frame."

            )

        prediction = await prediction_controller.predict_frame(
            frame
        )

        return prediction

    except Exception as error:

        raise HTTPException(

            status_code=500,

            detail=str(error)

        )