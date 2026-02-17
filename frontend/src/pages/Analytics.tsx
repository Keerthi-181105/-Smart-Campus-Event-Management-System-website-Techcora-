import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { motion } from "framer-motion";

type Overview = { events: number; users: number; registrations: number };

export default function Analytics() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/api/analytics/overview");
        // eslint-disable-next-line no-console
        console.info("[analytics] overview fetched", res);
        setData(res);
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error("[analytics] overview failed", e);
        setError(e.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient-slow -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-white drop-shadow-lg">
          📊 Site Analytics
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-xl mb-6">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 animate-pulse"
              >
                <div className="h-4 bg-white/20 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-white/20 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : data ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <StatCard
              icon="🎪"
              label="Total Events"
              value={data.events}
              color="from-violet-500 to-purple-600"
            />
            <StatCard
              icon="👥"
              label="Total Users"
              value={data.users}
              color="from-blue-500 to-cyan-600"
            />
            <StatCard
              icon="🎟️"
              label="Registrations"
              value={data.registrations}
              color="from-pink-500 to-rose-600"
            />
          </motion.div>
        ) : (
          <div className="text-center text-white py-20">
            <p className="text-6xl mb-4">📊</p>
            <p className="text-xl">No analytics data available</p>
          </div>
        )}
      </motion.div>

      {/* Animation styles */}
      <style>
        {`
          @keyframes gradient-slow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-slow {
            background-size: 200% 200%;
            animation: gradient-slow 15s ease infinite;
          }
        `}
      </style>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${color} rounded-2xl p-6 shadow-2xl`}
    >
      <div className="text-5xl mb-3">{icon}</div>
      <div className="text-white/80 text-sm font-semibold mb-1">{label}</div>
      <div className="text-5xl font-bold text-white">{value}</div>
    </motion.div>
  );
}
