import api from "./api";

import type {
  DetectionResponse,
  PredictionHistoryResponse,
  DeletePredictionResponse,
  VideoPredictionResponse,
} from "../types/prediction";

class PredictionService {

  // ==========================================
  // IMAGE PREDICTION
  // ==========================================

  async predictImage(
    file: File
  ): Promise<DetectionResponse> {

    const formData = new FormData();

    formData.append(
      "file",
      file
    );

    const response = await api.post<DetectionResponse>(
      "/predictions/image",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return response.data;
  }

  // ==========================================
  // VIDEO PREDICTION
  // ==========================================

  async predictVideo(
    file: File
  ): Promise<VideoPredictionResponse> {

    const formData = new FormData();

    formData.append(
      "file",
      file
    );

    const response = await api.post<VideoPredictionResponse>(
      "/predictions/video",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return response.data;
  }

  // ==========================================
  // PREDICTION HISTORY
  // ==========================================

  async getHistory(): Promise<PredictionHistoryResponse> {

    const response = await api.get<PredictionHistoryResponse>(
      "/predictions/history"
    );

    return response.data;
  }

  // ==========================================
  // DELETE PREDICTION
  // ==========================================

  async deletePrediction(
    predictionId: string
  ): Promise<DeletePredictionResponse> {

    const response =
      await api.delete<DeletePredictionResponse>(
        `/predictions/${predictionId}`
      );

    return response.data;
  }

  // ==========================================
  // DOWNLOAD IMAGE
  // ==========================================

  async downloadImage(
    filename: string
  ): Promise<Blob> {

    const response = await api.get(

      `/uploads/images/${filename}`,

      {
        responseType: "blob",
      }

    );

    return response.data;
  }

  // ==========================================
  // DOWNLOAD VIDEO
  // ==========================================

  async downloadVideo(
    filename: string
  ): Promise<Blob> {

    const response = await api.get(

      `/uploads/videos/${filename}`,

      {
        responseType: "blob",
      }

    );

    return response.data;
  }

}

const predictionService =
  new PredictionService();

export default predictionService;