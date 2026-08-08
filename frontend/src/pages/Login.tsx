import { useState } from "react";
import type { FormEvent} from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


import { login } from "../services/authService";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent
  ) {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await login({
        email,
        password
      });

      toast.success("Login successfull");

      localStorage.setItem(
        "access_token",
        response.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      navigate("/dashboard");

    } catch (error) {
        toast.error("Invalid email or password");

    } finally {

      setLoading(false);

    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8"
      >

        <h1 className="text-3xl font-bold">
          Welcome Back
        </h1>

        <p className="mt-2 text-slate-400">
          Login to your TrafficAI account
        </p>

        {error && (
          <div className="mt-5 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6">

          <label className="mb-2 block text-sm">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
          />

        </div>

        <div className="mt-5">

          <label className="mb-2 block text-sm">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">

          Don't have an account?{" "}

          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-300"
          >
            Create one
          </Link>

        </p>

      </form>

    </main>
  );
}