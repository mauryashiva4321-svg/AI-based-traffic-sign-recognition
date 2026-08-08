import { motion } from "framer-motion";
import {
  FiTarget,
  FiShield,
  FiInfo,
  FiAlertTriangle,
} from "react-icons/fi";

import type { VideoFrameResult } from "../../types/prediction";

interface Props {
  frameResult: VideoFrameResult;
}

export default function VideoResultCard({
  frameResult,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        shadow-lg
        overflow-hidden
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          bg-slate-800
          px-6
          py-4
        "
      >
        <h2 className="text-xl font-bold text-white">
          Frame #{frameResult.frame}
        </h2>

        <span
          className="
            rounded-full
            bg-blue-600
            px-4
            py-1
            text-sm
            font-semibold
          "
        >
          {frameResult.detections.length} Detection
          {frameResult.detections.length !== 1 && "s"}
        </span>
      </div>

      <div className="space-y-6 p-6">
        {frameResult.detections.map((detection, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.01 }}
            className="
              rounded-xl
              border
              border-slate-700
              bg-slate-950
              p-5
            "
          >
            <div className="flex items-center gap-3">
              <FiTarget className="text-2xl text-blue-400" />

              <h3 className="text-2xl font-bold">
                {detection.class_name}
              </h3>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-blue-500/10 p-4">
                <p className="text-sm text-slate-400">
                  Detector Confidence
                </p>

                <p className="mt-2 text-2xl font-bold text-blue-400">
                  {(detection.detector_confidence * 100).toFixed(2)}%
                </p>
              </div>

              <div className="rounded-lg bg-green-500/10 p-4">
                <p className="text-sm text-slate-400">
                  Classification Confidence
                </p>

                <p className="mt-2 text-2xl font-bold text-green-400">
                  {(detection.classification_confidence * 100).toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-slate-800 p-4">
              <div className="flex items-center gap-2">
                <FiShield className="text-yellow-400" />
                <span className="font-semibold">
                  Bounding Box
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-300">
                X1: {detection.bbox.x1} {" | "}
                Y1: {detection.bbox.y1} {" | "}
                X2: {detection.bbox.x2} {" | "}
                Y2: {detection.bbox.y2}
              </p>
            </div>

            <div className="mt-5 rounded-lg bg-slate-800 p-4">
              <div className="flex items-center gap-2">
                <FiInfo className="text-cyan-400" />
                <span className="font-semibold">
                  Description
                </span>
              </div>

              <p className="mt-3 text-slate-300">
                {detection.description}
              </p>
            </div>

            <div
              className="
                mt-5
                rounded-lg
                border
                border-green-500/30
                bg-green-600/10
                p-4
              "
            >
              <div className="flex items-center gap-2">
                <FiAlertTriangle className="text-green-400" />
                <span className="font-semibold">
                  Recommended Driver Action
                </span>
              </div>

              <p className="mt-3 text-green-300">
                {detection.recommended_action}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}