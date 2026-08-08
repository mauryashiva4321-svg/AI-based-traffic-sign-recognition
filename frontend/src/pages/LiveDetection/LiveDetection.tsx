import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import WebcamCanvas from "./WebcamCanvas";
import DetectionCard from "./DetectionCard";
import DetectionOverlay from "./DetectionOverlay";
import FPSCounter from "./FPSCounter";
import ControlPanel from "./ControlPanel";

import { websocketService } from "../../services/websocket.service";

import type { DetectionResponse } from "../../types/prediction";

export default function LiveDetection() {
  const [connected, setConnected] = useState(false);
  const [running, setRunning] = useState(false);
  const [loading] = useState(false);
  const [fps, setFps] = useState(0);

  const [prediction, setPrediction] =
    useState<DetectionResponse | null>(null);

  // ==========================================
  // CONNECT WEBSOCKET
  // ==========================================

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    websocketService.connect(
      token,

      (data: DetectionResponse & { fps?: number }) => {
        setPrediction(data);

        if (typeof data.fps === "number") {
          setFps(data.fps);
        }
      },

      (status: boolean) => {
        setConnected(status);

        if (status) {
          toast.success("Connected to AI Server");
        } else {
          toast.error("Disconnected");
        }
      }
    );

    return () => {
      websocketService.disconnect();
    };
  }, []);

  // ==========================================
  // START
  // ==========================================

  const startDetection = () => {
    if (!connected) {
      toast.error("WebSocket not connected");
      return;
    }

    setRunning(true);

    toast.success("Live Detection Started");
  };

  // ==========================================
  // STOP
  // ==========================================

  const stopDetection = () => {
    setRunning(false);

    toast.success("Detection Stopped");
  };

  // ==========================================
  // SEND FRAME
  // ==========================================

  const sendFrame = (image: string) => {
    if (!running) return;

    websocketService.sendFrame(image);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Live Traffic Sign Detection
        </h1>

        <p className="mt-2 text-slate-400">
          AI-powered real-time traffic sign recognition using
          YOLOv8 & CNN.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-3">
        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">
          <div className="relative">
            <WebcamCanvas
              running={running}
              onFrame={sendFrame}
            />

            <DetectionOverlay
              detections={prediction?.detections ?? []}
              imageWidth={1280}
              imageHeight={720}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <ControlPanel
            connected={connected}
            running={running}
            loading={loading}
            onStart={startDetection}
            onStop={stopDetection}
          />

          <FPSCounter fps={fps} />

          <DetectionCard prediction={prediction} />
        </div>
      </div>
    </div>
  );
}