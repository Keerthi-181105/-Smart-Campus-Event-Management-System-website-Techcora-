// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiFetch } from "../lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!res || !res.token)
        throw new Error(res?.message || "Invalid credentials");

      localStorage.setItem("token", res.token);
      if (res.refreshToken)
        localStorage.setItem("refreshToken", res.refreshToken);

      console.info("[auth] Login successful:", res);

      const role = (res.role || "STUDENT").toUpperCase();
      console.info("[auth] User role:", role);

      if (role === "STUDENT") {
        console.info("[auth] Redirecting student to /student");
        navigate("/student");
      } else if (role === "ORGANIZER" || role === "ADMIN") {
        console.info("[auth] Redirecting organizer/admin to /organizer");
        navigate("/organizer");
      } else {
        console.warn("[auth] Unknown role, defaulting to /student");
        navigate("/student");
      }
    } catch (err: any) {
      console.error("[auth] Login failed:", err);

      // Provide more specific error messages
      if (err.message === "Failed to fetch") {
        setError(
          "Cannot connect to server. Please ensure the backend is running on port 4000."
        );
      } else if (err.message.includes("NetworkError")) {
        setError("Network error. Please check your connection and try again.");
      } else if (err.message.includes("CORS")) {
        setError("CORS error. Please check backend configuration.");
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-900 to-purple-700 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-black/60 border border-violet-700 rounded-2xl p-8 shadow-2xl backdrop-blur-md"
      >
        <h1 className="text-3xl font-bold text-center text-violet-400 mb-2">
          Smart Campus Login
        </h1>
        <p className="text-center text-gray-300 mb-6">
          Sign in with your SRM email
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="yourname@srmist.edu.in"
              className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-violet-700/40 text-white outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-violet-700/40 text-white outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 transition rounded-xl py-2 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-300">
          <a className="underline" href="/forgot-password">
            Forgot password?
          </a>
        </div>
      </motion.div>
    </div>
  );
}
