import { motion } from "framer-motion";
import {
  FiFilm,
  FiTarget,
  FiCheckCircle,
  FiActivity,
} from "react-icons/fi";

import type { VideoPredictionResponse } from "../../types/prediction";

interface Props {
  result: VideoPredictionResponse;
}

export default function VideoStatistics({
  result,
}: Props) {
  const totalSigns = result.results.reduce(
    (total, frame) => total + frame.detections.length,
    0
  );

  const detectionRate =
    result.frames_processed > 0
      ? (
          (result.frames_with_detections /
            result.frames_processed) *
          100
        ).toFixed(2)
      : "0.00";

  const averageSigns =
    result.frames_with_detections > 0
      ? (
          totalSigns /
          result.frames_with_detections
        ).toFixed(2)
      : "0.00";

  const cards = [
    {
      title: "Frames Processed",
      value: result.frames_processed,
      icon: <FiFilm size={26} />,
      color: "bg-blue-500/10",
      text: "text-blue-400",
    },
    {
      title: "Frames With Detections",
      value: result.frames_with_detections,
      icon: <FiCheckCircle size={26} />,
      color: "bg-green-500/10",
      text: "text-green-400",
    },
    {
      title: "Traffic Signs Detected",
      value: totalSigns,
      icon: <FiTarget size={26} />,
      color: "bg-purple-500/10",
      text: "text-purple-400",
    },
    {
      title: "Detection Rate",
      value: `${detectionRate}%`,
      icon: <FiActivity size={26} />,
      color: "bg-orange-500/10",
      text: "text-orange-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-10"
    >
      <h2 className="mb-6 text-3xl font-bold">
        Detection Statistics
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <motion.div
            key={card.title}
            whileHover={{ scale: 1.03 }}
            className={`rounded-2xl border border-slate-800 ${card.color} p-6`}
          >
            <div className="flex items-center justify-between">
              <div className={card.text}>{card.icon}</div>

              <span className="text-xs uppercase tracking-widest text-slate-400">
                Statistics
              </span>
            </div>

            <p className="mt-6 text-sm text-slate-400">
              {card.title}
            </p>

            <h3 className={`mt-2 text-4xl font-bold ${card.text}`}>
              {card.value}
            </h3>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-2xl font-bold">
          Detection Summary
        </h3>

        <div className="mt-6 space-y-4">
          <div>
            <div className="mb-2 flex justify-between">
              <span>Detection Rate</span>
              <span>{detectionRate}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-green-500"
                style={{
                  width: `${detectionRate}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex justify-between">
              <span>Average Signs Per Frame</span>
              <span>{averageSigns}</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{
                  width: `${Math.min(
                    Number(averageSigns) * 20,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}