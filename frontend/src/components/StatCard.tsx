import {
  TrendingUp
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  motion
} from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon
}: StatCardProps) {

  return (

    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        p-6
        transition
        hover:border-blue-500/50
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
        "
      >

        <div>

          <p
            className="
              text-sm
              text-slate-400
            "
          >
            {title}
          </p>

          <h3
            className="
              mt-3
              text-3xl
              font-bold
            "
          >
            {value}
          </h3>

        </div>

        <div
          className="
            rounded-xl
            bg-blue-500/10
            p-3
            text-blue-400
          "
        >

          <Icon size={24} />

        </div>

      </div>

      <div
        className="
          mt-5
          flex
          items-center
          gap-2
          text-sm
        "
      >

        <TrendingUp
          size={16}
          className="text-green-400"
        />

        <span
          className="
            text-green-400
          "
        >
          {description}
        </span>

      </div>

    </motion.div>

  );
}