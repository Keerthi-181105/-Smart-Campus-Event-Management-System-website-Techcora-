import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

type Overview = { events: number; users: number; registrations: number };

export default function Analytics() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      }
    })();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold mb-4">Site Analytics</h1>
      {error && <div className="text-red-400">{error}</div>}
      {!data ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <div className="text-sm opacity-70">Events</div>
            <div className="text-3xl font-bold">{data.events}</div>
          </div>
          <div className="card p-4">
            <div className="text-sm opacity-70">Users</div>
            <div className="text-3xl font-bold">{data.users}</div>
          </div>
          <div className="card p-4">
            <div className="text-sm opacity-70">Registrations</div>
            <div className="text-3xl font-bold">{data.registrations}</div>
          </div>
        </div>
      )}
    </div>
  );
}
