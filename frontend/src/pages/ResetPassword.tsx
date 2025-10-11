import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("token") || "";
    setToken(t);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMsg(null);
    setLoading(true);
    try {
      const res = await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      // eslint-disable-next-line no-console
      console.info("[auth] reset-password ok", res);
      setMsg("Password updated. You can now log in.");
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error("[auth] reset-password failed", e);
      setError(e.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7b2cbf] to-black p-4">
      <div className="w-full max-w-md bg-black/60 border border-[#7b2cbf] rounded-2xl p-8 shadow-2xl backdrop-blur-md text-white">
        <h1 className="text-2xl font-bold mb-4 text-[#a06ad6]">
          Reset Password
        </h1>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-[#7b2cbf]/40 outline-none"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          {msg && <div className="text-green-400 text-sm">{msg}</div>}
          <button
            disabled={loading}
            className="w-full bg-[#7b2cbf] hover:brightness-110 transition rounded-xl py-2 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
