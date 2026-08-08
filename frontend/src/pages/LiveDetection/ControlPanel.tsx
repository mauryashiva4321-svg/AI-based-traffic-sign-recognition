import { motion } from "framer-motion";

import {
  FiPlay,
  FiSquare,
  FiRefreshCw,
  FiWifi,
  FiCamera,
  FiCpu,
} from "react-icons/fi";

interface ControlPanelProps {
  connected: boolean;
  running: boolean;
  loading: boolean;
  onStart: () => void;
  onStop: () => void;
  onReconnect?: () => void;
}

export default function ControlPanel({
  connected,
  running,
  loading,
  onStart,
  onStop,
  onReconnect,
}: ControlPanelProps) {

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        p-6
      "
    >
      <h2
        className="
          text-2xl
          font-bold
        "
      >
        Live Detection Controls
      </h2>

      {/* Status */}

      <div
        className="
          mt-6
          space-y-4
        "
      >
        {/* WebSocket */}

        <div
          className="
            flex
            items-center
            justify-between
            rounded-xl
            bg-slate-800
            p-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <FiWifi
              className={
                connected
                  ? "text-green-400"
                  : "text-red-400"
              }
              size={22}
            />

            <span>
              WebSocket
            </span>
          </div>

          <span
            className={
              connected
                ? "text-green-400 font-semibold"
                : "text-red-400 font-semibold"
            }
          >
            {connected
              ? "Connected"
              : "Disconnected"}
          </span>
        </div>

        {/* Camera */}

        <div
          className="
            flex
            items-center
            justify-between
            rounded-xl
            bg-slate-800
            p-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <FiCamera
              className="text-blue-400"
              size={22}
            />

            <span>Camera</span>
          </div>

          <span
            className="
              font-semibold
              text-green-400
            "
          >
            Ready
          </span>
        </div>

        {/* AI */}

        <div
          className="
            flex
            items-center
            justify-between
            rounded-xl
            bg-slate-800
            p-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <FiCpu
              className="text-purple-400"
              size={22}
            />

            <span>AI Model</span>
          </div>

          <span
            className="
              font-semibold
              text-green-400
            "
          >
            Loaded
          </span>
        </div>
      </div>

      {/* Buttons */}

      <div
        className="
          mt-8
          grid
          gap-4
        "
      >
        <button
          disabled={
            running ||
            !connected ||
            loading
          }
          onClick={onStart}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-green-600
            px-5
            py-3
            font-semibold
            transition
            hover:bg-green-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <FiPlay />

          Start Detection
        </button>

        <button
          disabled={
            !running
          }
          onClick={onStop}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-red-600
            px-5
            py-3
            font-semibold
            transition
            hover:bg-red-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <FiSquare />

          Stop Detection
        </button>

        <button
          onClick={onReconnect}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-600
            px-5
            py-3
            font-semibold
            transition
            hover:bg-blue-700
          "
        >
          <FiRefreshCw />

          Reconnect
        </button>
      </div>

      {/* Information */}

      <div
        className="
          mt-8
          rounded-xl
          border
          border-slate-800
          bg-slate-950
          p-4
        "
      >
        <p
          className="
            text-sm
            text-slate-400
            leading-7
          "
        >
          This module streams live webcam frames to the
          FastAPI backend through a WebSocket connection.
          YOLOv8 detects traffic signs, the CNN classifies
          them, and the detected results are returned in
          real time with confidence scores and driver
          recommendations.
        </p>
      </div>
    </motion.div>
  );
}