import {
  Activity,
  Camera,
  FileImage,
  ScanLine,
  Video
} from "lucide-react";

import {
  motion
} from "framer-motion";

import {
  Link
} from "react-router-dom";

import StatCard
  from "../components/StatCard";

export default function Dashboard() {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (

    <div
      className="
        mx-auto
        max-w-7xl
      "
    >

      <motion.div
        initial={{
          opacity: 0,
          y: -20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
      >

        <p
          className="
            text-sm
            text-slate-400
          "
        >
          Welcome back
        </p>

        <h1
          className="
            mt-2
            text-3xl
            font-bold
            sm:text-4xl
          "
        >
          Hello, {user.name || "User"} 👋
        </h1>

        <p
          className="
            mt-3
            text-slate-400
          "
        >
          Monitor and analyze traffic signs
          using artificial intelligence.
        </p>

      </motion.div>

      <div
        className="
          mt-8
          grid
          gap-5
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        <StatCard
          title="Total Predictions"
          value="0"
          description="Start detecting"
          icon={ScanLine}
        />

        <StatCard
          title="Average Confidence"
          value="0%"
          description="No data yet"
          icon={Activity}
        />

        <StatCard
          title="Signs Detected"
          value="0"
          description="No predictions yet"
          icon={FileImage}
        />

        <StatCard
          title="Live Sessions"
          value="0"
          description="Ready to start"
          icon={Camera}
        />

      </div>

      <section
        className="
          mt-8
          grid
          gap-6
          lg:grid-cols-3
        "
      >

        <div
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-6
            lg:col-span-2
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <h2
                className="
                  text-xl
                  font-bold
                "
              >
                Start Detection
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-400
                "
              >
                Choose a detection method
              </p>

            </div>

          </div>

          <div
            className="
              mt-6
              grid
              gap-4
              sm:grid-cols-3
            "
          >

            <Link
              to="/detect/image"
              className="
                rounded-xl
                border
                border-slate-800
                p-5
                transition
                hover:border-blue-500
                hover:bg-blue-500/5
              "
            >

              <FileImage
                className="
                  text-blue-400
                "
              />

              <h3
                className="
                  mt-4
                  font-semibold
                "
              >
                Image
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                Upload an image
              </p>

            </Link>

            <Link
              to="/detect/video"
              className="
                rounded-xl
                border
                border-slate-800
                p-5
                transition
                hover:border-blue-500
                hover:bg-blue-500/5
              "
            >

              <Video
                className="
                  text-purple-400
                "
              />

              <h3
                className="
                  mt-4
                  font-semibold
                "
              >
                Video
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                Analyze a video
              </p>

            </Link>

            <Link
              to="/detect/live"
              className="
                rounded-xl
                border
                border-slate-800
                p-5
                transition
                hover:border-blue-500
                hover:bg-blue-500/5
              "
            >

              <Camera
                className="
                  text-green-400
                "
              />

              <h3
                className="
                  mt-4
                  font-semibold
                "
              >
                Live Camera
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                Detect in real time
              </p>

            </Link>

          </div>

        </div>

        <div
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
              text-xl
              font-bold
            "
          >
            Recent Activity
          </h2>

          <div
            className="
              flex
              min-h-48
              items-center
              justify-center
              text-center
            "
          >

            <div>

              <Activity
                size={40}
                className="
                  mx-auto
                  text-slate-700
                "
              />

              <p
                className="
                  mt-4
                  text-sm
                  text-slate-500
                "
              >
                No predictions yet
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>

  );
}