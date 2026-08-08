// ======================================================
// Bounding Box
// ======================================================

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// ======================================================
// Single Detection Result
// ======================================================

export interface DetectionResult {
  bbox: BoundingBox;

  detector_confidence: number;

  class_id: number;

  class_name: string;

  classification_confidence: number;

  description: string;

  recommended_action: string;
}

// ======================================================
// Live / Image Detection API Response
// ======================================================

export interface DetectionResponse {
  success?: boolean;

  prediction_type?: string;

  total_detections: number;

  detections: DetectionResult[];
}

// ======================================================
// Prediction History Item
// ======================================================

export interface PredictionResult {
  id?: string;

  user_id: string;

  prediction_type: "image" | "video" | "live";

  filename: string;

  total_detections: number;

  detections: DetectionResult[];

  created_at: string;
}

// ======================================================
// Prediction History API Response
// ======================================================

export interface PredictionHistoryResponse {
  success: boolean;

  total: number;

  predictions: PredictionResult[];
}

// ======================================================
// Delete Prediction Response
// ======================================================

export interface DeletePredictionResponse {
  success: boolean;

  message: string;
}

// ======================================================
// Video Prediction
// ======================================================

export interface VideoFrameResult {
  frame: number;

  detections: DetectionResult[];
}

export interface VideoPredictionResponse {
  success: boolean;

  prediction_type: "video";

  frames_processed: number;

  frames_with_detections: number;

  results: VideoFrameResult[];
}