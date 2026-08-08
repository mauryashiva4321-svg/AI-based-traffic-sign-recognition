import { motion } from "framer-motion";

import {
  FiActivity,
  FiCpu,
  FiZap,
} from "react-icons/fi";

interface FPSCounterProps {
  fps: number;
}

export default function FPSCounter({
  fps,
}: FPSCounterProps) {

  const getStatus = () => {

    if (fps >= 25) {

      return {
        text: "Excellent",
        color: "text-green-400",
        bg: "bg-green-500/10",
        progress: 100,
      };

    }

    if (fps >= 15) {

      return {
        text: "Good",
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        progress: 70,
      };

    }

    if (fps > 0) {

      return {
        text: "Low",
        color: "text-red-400",
        bg: "bg-red-500/10",
        progress: 40,
      };

    }

    return {
      text: "Waiting",
      color: "text-slate-400",
      bg: "bg-slate-700",
      progress: 0,
    };

  };

  const status = getStatus();

  return (

    <motion.div

      initial={{
        opacity: 0,
        y: 15,
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

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <h2
          className="
            text-xl
            font-bold
          "
        >
          Performance
        </h2>

        <FiCpu
          className="
            text-blue-400
            text-2xl
          "
        />

      </div>

      <div
        className="
          mt-6
          flex
          items-center
          justify-center
        "
      >

        <div
          className="
            flex
            h-28
            w-28
            items-center
            justify-center
            rounded-full
            border-4
            border-blue-500
          "
        >

          <div
            className="
              text-center
            "
          >

            <p
              className="
                text-3xl
                font-bold
              "
            >
              {fps}
            </p>

            <p
              className="
                text-xs
                text-slate-400
              "
            >
              FPS
            </p>

          </div>

        </div>

      </div>

      <div
        className="
          mt-8
          space-y-4
        "
      >

        <div
          className={`
            rounded-xl
            p-4
            ${status.bg}
          `}
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <FiActivity
              className={status.color}
            />

            <span
              className="
                text-sm
                text-slate-300
              "
            >
              Detection Status
            </span>

          </div>

          <p
            className={`
              mt-2
              text-xl
              font-bold
              ${status.color}
            `}
          >
            {status.text}
          </p>

        </div>

        <div>

          <div
            className="
              mb-2
              flex
              justify-between
              text-sm
            "
          >

            <span>
              Performance
            </span>

            <span>
              {status.progress}%
            </span>

          </div>

          <div
            className="
              h-3
              overflow-hidden
              rounded-full
              bg-slate-700
            "
          >

            <motion.div

              initial={{
                width: 0,
              }}

              animate={{
                width: `${status.progress}%`,
              }}

              transition={{
                duration: 0.4,
              }}

              className="
                h-full
                rounded-full
                bg-blue-500
              "

            />

          </div>

        </div>

        <div
          className="
            rounded-xl
            border
            border-slate-800
            bg-slate-950
            p-4
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <FiZap
              className="
                text-yellow-400
              "
            />

            <span
              className="
                font-semibold
              "
            >
              AI Inference Speed
            </span>

          </div>

          <p
            className="
              mt-3
              text-sm
              text-slate-400
            "
          >
            Real-time processing using
            YOLOv8 object detection and
            CNN traffic sign classification.
          </p>

        </div>

      </div>

    </motion.div>

  );

}