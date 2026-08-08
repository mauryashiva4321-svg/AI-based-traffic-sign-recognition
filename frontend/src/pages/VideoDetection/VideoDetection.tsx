import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiUploadCloud } from "react-icons/fi";
import { motion } from "framer-motion";

import VideoUploader from "./VideoUploader";
import VideoPlayer from "./VideoPlayer";
import VideoResultCard from "./VideoResultCard";
import VideoStatistics from "./VideoStatistics";

import predictionService from "../../services/predictionService";

import type { VideoPredictionResponse } from "../../types/prediction";

export default function VideoDetection() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const [result, setResult] =
    useState<VideoPredictionResponse | null>(null);

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const handleSelectVideo = (file: File) => {
    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const handlePredict = async () => {
    if (!videoFile) {
      toast.error("Please choose a video first.");
      return;
    }

    try {
      setLoading(true);

      const response =
        await predictionService.predictVideo(videoFile);

      setResult(response);

      toast.success("Video processed successfully.");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ??
          "Prediction failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-8">
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-4xl font-bold"
      >
        Video Traffic Sign Detection
      </motion.h1>

      <VideoUploader
        inputRef={inputRef}
        onBrowse={handleBrowse}
        onSelect={handleSelectVideo}
      />

      {previewUrl && (
        <VideoPlayer videoUrl={previewUrl} />
      )}

      {videoFile && (
        <button
          onClick={handlePredict}
          disabled={loading}
          className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700 disabled:opacity-60"
        >
          <FiUploadCloud />
          {loading ? "Processing..." : "Start Detection"}
        </button>
      )}

      {result && (
        <>
          <VideoStatistics result={result} />

          <div className="mt-8 space-y-6">
            {result.results.map((frameResult, index) => (
              <VideoResultCard
                key={index}
                frameResult={frameResult}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}