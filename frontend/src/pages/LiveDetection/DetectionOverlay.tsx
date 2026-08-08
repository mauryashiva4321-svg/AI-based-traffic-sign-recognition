import { motion } from "framer-motion";
import type { DetectionResult } from "../../types/prediction";

interface DetectionOverlayProps {
  detections: DetectionResult[];
  imageWidth: number;
  imageHeight: number;
}

export default function DetectionOverlay({
  detections,
  imageWidth,
  imageHeight,
}: DetectionOverlayProps) {
  if (
    detections.length === 0 ||
    imageWidth <= 0 ||
    imageHeight <= 0
  ) {
    return null;
  }

  return (
    <div
      className="
        absolute
        inset-0
        pointer-events-none
        overflow-hidden
      "
    >
      {detections.map((detection, index) => {
        const { x1, y1, x2, y2 } = detection.bbox;

        const left = (x1 / imageWidth) * 100;
        const top = (y1 / imageHeight) * 100;
        const width = ((x2 - x1) / imageWidth) * 100;
        const height = ((y2 - y1) / imageHeight) * 100;

        return (
          <motion.div
            key={`${detection.class_name}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="
              absolute
              border-4
              border-green-400
              rounded-lg
              shadow-lg
            "
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${width}%`,
              height: `${height}%`,
            }}
          >
            <div
              className="
                absolute
                -top-10
                left-0
                rounded-md
                bg-green-500
                px-3
                py-1
                text-xs
                font-semibold
                text-white
                whitespace-nowrap
              "
            >
              {detection.class_name} •{" "}
              {(detection.classification_confidence * 100).toFixed(1)}%
            </div>

            <div
              className="
                absolute
                top-0
                left-0
                h-3
                w-3
                rounded-full
                bg-green-400
              "
            />

            <div
              className="
                absolute
                bottom-0
                right-0
                h-3
                w-3
                rounded-full
                bg-green-400
              "
            />
          </motion.div>
        );
      })}
    </div>
  );
}