import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-8 py-6">
        <h1 className="text-xl font-bold">
          TrafficAI
        </h1>

        <Link
          to="/login"
          className="rounded-lg bg-blue-600 px-5 py-2 hover:bg-blue-700"
        >
          Login
        </Link>
      </nav>

      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-32 text-center">
        <div className="mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
          AI-Powered Driver Assistance
        </div>

        <h2 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          Recognize Traffic Signs
          <span className="text-blue-500">
            {" "}Instantly
          </span>
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          An intelligent computer vision system that detects
          and recognizes traffic signs from images, videos,
          and live camera feeds.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            to="/signup"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-900"
          >
            Sign In
          </Link>
        </div>
      </section>
    </main>
  );
}