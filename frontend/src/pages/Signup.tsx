import { useState } from "react";
import type { FormEvent} from "react";
import { Link, useNavigate } from "react-router-dom";

import { signup } from "../services/authService";

export default function Signup() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
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

      await signup({
        name,
        email,
        password
      });

      navigate("/login");

    } catch (error: any) {

      setError(
        error.response?.data?.detail ||
        "Signup failed"
      );

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
          Create Account
        </h1>

        <p className="mt-2 text-slate-400">
          Start using TrafficAI
        </p>

        {error && (
          <div className="mt-5 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6">

          <label className="mb-2 block text-sm">
            Full Name
          </label>

          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
            minLength={2}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
          />

        </div>

        <div className="mt-5">

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
            minLength={6}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300"
          >
            Login
          </Link>

        </p>

      </form>

    </main>
  );
}