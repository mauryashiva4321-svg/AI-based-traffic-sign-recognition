export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at?: string;
}

export interface Prediction {
  id: string;
  source_type: "image" | "video" | "webcam";
  sign_name: string;
  confidence: number;
  created_at: string;
}

export interface DashboardStats {
  total_predictions: number;
  average_confidence: number;
  signs_detected: number;
  recent_predictions: number;
}