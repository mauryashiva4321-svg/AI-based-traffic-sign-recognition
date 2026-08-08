import {
  Link
} from "react-router-dom";

export default function NotFound() {

  return (

    <main
      className="
        flex
        min-h-screen
        flex-col
        items-center
        justify-center
        bg-slate-950
        text-white
      "
    >

      <h1
        className="
          text-8xl
          font-bold
          text-blue-500
        "
      >
        404
      </h1>

      <p
        className="
          mt-4
          text-slate-400
        "
      >
        Page not found
      </p>

      <Link
        to="/"
        className="
          mt-8
          rounded-xl
          bg-blue-600
          px-6
          py-3
        "
      >
        Return Home
      </Link>

    </main>

  );

}