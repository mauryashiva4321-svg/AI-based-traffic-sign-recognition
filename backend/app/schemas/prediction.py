from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


# ==========================================================
# BOUNDING BOX
# ==========================================================

class BoundingBox(BaseModel):
    x1: int
    y1: int
    x2: int
    y2: int


# ==========================================================
# SINGLE DETECTION
# ==========================================================

class Detection(BaseModel):
    bbox: Optional[BoundingBox] = None

    detector_confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0
    )

    class_id: int

    class_name: str

    classification_confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0
    )

    description: str

    recommended_action: str


# ==========================================================
# IMAGE / VIDEO / LIVE PREDICTION RESPONSE
# ==========================================================

class PredictionResponse(BaseModel):

    success: bool = True

    prediction_type: str

    total_detections: int

    detections: List[Detection]


# ==========================================================
# SINGLE PREDICTION HISTORY
# ==========================================================

class PredictionHistory(BaseModel):

    id: Optional[str] = None

    user_id: str

    prediction_type: str

    filename: str

    total_detections: int

    detections: List[Detection]

    created_at: datetime


# ==========================================================
# HISTORY LIST RESPONSE
# ==========================================================

class PredictionListResponse(BaseModel):

    total: int

    predictions: List[PredictionHistory]


# ==========================================================
# DELETE RESPONSE
# ==========================================================

class DeletePredictionResponse(BaseModel):

    success: bool

    message: str


# ==========================================================
# GENERIC RESPONSE
# ==========================================================

class ApiResponse(BaseModel):

    success: bool

    message: str