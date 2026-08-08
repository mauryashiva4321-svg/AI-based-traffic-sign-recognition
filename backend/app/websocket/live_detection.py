import base64
import json
import time
import traceback

import cv2
import numpy as np

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from jose import JWTError

from backend.app.core.security import decode_access_token
from backend.app.services.prediction_service import prediction_service

router = APIRouter()


@router.websocket("/ws/live")
async def live_detection(websocket: WebSocket):
    """
    Live Traffic Sign Detection WebSocket
    """

    # Accept ONLY ONCE
    await websocket.accept()

    # --------------------------------------------------
    # Authenticate
    # --------------------------------------------------

    token = websocket.query_params.get("token")

    if not token:
        await websocket.close(code=1008)
        return

    try:
        payload = decode_access_token(token)

        if not payload.get("sub"):
            await websocket.close(code=1008)
            return

    except JWTError:
        await websocket.close(code=1008)
        return

    previous_time = time.time()

    try:

        while True:

            # ------------------------------------------
            # Receive JSON
            # ------------------------------------------

            message = await websocket.receive_text()

            data = json.loads(message)

            image = data.get("image")

            if not image:
                continue

            # ------------------------------------------
            # Remove Base64 Header
            # ------------------------------------------

            if image.startswith("data:image"):
                image = image.split(",", 1)[1]

            # ------------------------------------------
            # Decode Image
            # ------------------------------------------

            try:
                image_bytes = base64.b64decode(image)
            except Exception:
                await websocket.send_json({
                    "total_detections": 0,
                    "detections": [],
                    "fps": 0,
                    "error": "Invalid Base64 image."
                })
                continue

            np_array = np.frombuffer(
                image_bytes,
                dtype=np.uint8
            )

            frame = cv2.imdecode(
                np_array,
                cv2.IMREAD_COLOR
            )

            if frame is None:
                await websocket.send_json({
                    "total_detections": 0,
                    "detections": [],
                    "fps": 0,
                    "error": "Unable to decode image."
                })
                continue

            # ------------------------------------------
            # Prediction
            # ------------------------------------------

            try:
                prediction = prediction_service.predict_frame(frame)

            except Exception as e:

                traceback.print_exc()

                await websocket.send_json({
                    "total_detections": 0,
                    "detections": [],
                    "fps": 0,
                    "error": str(e)
                })

                continue

            # ------------------------------------------
            # FPS
            # ------------------------------------------

            current_time = time.time()

            fps = 1 / max(
                current_time - previous_time,
                0.0001
            )

            previous_time = current_time

            prediction["fps"] = round(fps, 2)

            # ------------------------------------------
            # Send Response
            # ------------------------------------------

            await websocket.send_json(prediction)

    except WebSocketDisconnect:
        print("Live Detection Client Disconnected")

    except Exception:
        traceback.print_exc()

        try:
            await websocket.close(code=1011)
        except Exception:
            pass