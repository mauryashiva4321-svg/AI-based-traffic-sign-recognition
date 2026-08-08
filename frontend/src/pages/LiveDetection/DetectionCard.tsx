import { motion } from "framer-motion";
import {
  FiTarget,
  FiInfo,
  FiShield,
  FiAlertTriangle,
} from "react-icons/fi";

import type { DetectionResponse } from "../../types/prediction";

interface Props {
  prediction: DetectionResponse | null;
}

export default function DetectionCard({
  prediction,
}: Props) {
  if (!prediction) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-bold">Live Detection</h2>

        <p className="mt-4 text-slate-400">
          Waiting for camera...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Detection Result
        </h2>

        <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold">
          {prediction.total_detections}
        </span>
      </div>

      {prediction.total_detections === 0 && (
        <div className="mt-6 rounded-xl bg-slate-800 p-5 text-center">
          <FiTarget className="mx-auto text-5xl text-slate-500" />

          <p className="mt-4 text-slate-400">
            No traffic sign detected.
          </p>
        </div>
      )}

      <div className="mt-6 space-y-5">
        {prediction.detections.map((detection, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-slate-700 bg-slate-950 p-5"
          >
            <div className="flex items-center gap-3">
              <FiTarget className="text-xl text-blue-400" />

              <h3 className="text-xl font-bold">
                {detection.class_name}
              </h3>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <p className="text-xs text-slate-400">
                  Detector
                </p>

                <p className="mt-2 text-lg font-bold text-blue-400">
                  {(detection.detector_confidence * 100).toFixed(2)}%
                </p>
              </div>

              <div className="rounded-lg bg-green-500/10 p-3">
                <p className="text-xs text-slate-400">
                  Classifier
                </p>

                <p className="mt-2 text-lg font-bold text-green-400">
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
                x1: {detection.bbox.x1},
                {" "}y1: {detection.bbox.y1},
                {" "}x2: {detection.bbox.x2},
                {" "}y2: {detection.bbox.y2}
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

            <div className="mt-5 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
              <div className="flex items-center gap-2">
                <FiAlertTriangle className="text-green-400" />

                <span className="font-semibold">
                  Recommended Action
                </span>
              </div>

              <p className="mt-3 text-green-300">
                {detection.recommended_action}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}