import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Edit3, Trash2, PlusCircle, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";

// Loading Skeleton Component
const EventCardSkeleton = () => (
  <div className="card p-0 overflow-hidden animate-pulse">
    <div className="h-40 bg-gray-700/50" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-700/50 rounded w-3/4" />
      <div className="h-4 bg-gray-700/50 rounded w-full" />
      <div className="h-4 bg-gray-700/50 rounded w-1/2" />
      <div className="h-4 bg-gray-700/50 rounded w-2/3" />
      <div className="flex gap-2 mt-3">
        <div className="h-10 bg-gray-700/50 rounded flex-1" />
        <div className="h-10 bg-gray-700/50 rounded flex-1" />
      </div>
    </div>
  </div>
);

type EventItem = {
  id: string;
  title: string;
  description: string;
  venue: string;
  category: string;
  startTime?: string;
  endTime?: string;
  eventDate?: string;
  capacity: number;
  price: number;
  imageUrl?: string;
  _count?: { registrations: number };
};

export default function Organizer() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<EventItem>>({});
  const [notification, setNotification] = useState<string | null>(null);
  const navigate = useNavigate();

  // Show notification helper
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // ✅ Load events and merge with localStorage organizer QR counts
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let data: EventItem[] = [];
        try {
          data = await apiFetch("/api/events?organizer=true");
          // eslint-disable-next-line no-console
          console.info("[analytics] Loaded organizer events", {
            count: data.length,
          });
          localStorage.setItem("events", JSON.stringify(data));
        } catch (e) {
          console.warn("Using localStorage events fallback");
          data = JSON.parse(localStorage.getItem("events") || "[]");
        }

        // Merge registrations from organizerQRs
        const organizerQRs: { id: string }[] = JSON.parse(
          localStorage.getItem("organizerQRs") || "[]"
        );
        const counts: Record<string, number> = {};
        organizerQRs.forEach((q) => {
          counts[q.id] = (counts[q.id] || 0) + 1;
        });

        const merged = data.map((e) => ({
          ...e,
          _count: { registrations: counts[e.id] || 0 },
        }));

        setEvents(merged);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ Handle Delete
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await apiFetch(`/api/events/${id}`, { method: "DELETE" });
    } catch (e) {
      console.warn("API delete failed, removing locally");
    } finally {
      const updated = events.filter((e) => e.id !== id);
      setEvents(updated);
      localStorage.setItem("events", JSON.stringify(updated));
      showNotification("Event deleted successfully");
    }
  }

  // ✅ Start Editing
  function startEdit(e: EventItem) {
    setEditingId(e.id);
    setEditData({ ...e });
  }

  // ✅ Save Edit
  async function saveEdit() {
    if (!editingId) return;
    const updatedEvent = { ...editData, id: editingId };

    try {
      await apiFetch(`/api/events/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(updatedEvent),
      });
    } catch (e) {
      console.warn("API update failed, updating locally");
    } finally {
      const updated = events.map((e) =>
        e.id === editingId ? { ...e, ...editData } : e
      );
      setEvents(updated);
      localStorage.setItem("events", JSON.stringify(updated));
      setEditingId(null);
      setEditData({});
      showNotification("Event updated successfully");
    }
  }

  // ✅ Cancel Edit
  function cancelEdit() {
    setEditingId(null);
    setEditData({});
  }

  // ✅ Navigate to Create Event page
  function handleCreate() {
    navigate("/create-event");
  }

  // ✅ Analytics data
  const analyticsData = events.map((e) => ({
    name: e.title.length > 10 ? e.title.slice(0, 10) + "…" : e.title,
    Registrations: e._count?.registrations ?? 0,
    Capacity: e.capacity,
  }));

  return (
    <div className="p-6 relative">
      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          ✓ {notification}
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Organizer Dashboard</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-violet text-white rounded-xl"
        >
          <PlusCircle size={18} /> Create New Event
        </button>
      </div>

      {/* Analytics */}
      <div className="mt-8 bg-gray-800/30 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">📊 Event Analytics</h2>
        {events.length === 0 ? (
          <p>No data available yet</p>
        ) : (
          <div className="w-full h-64">
            <ResponsiveContainer>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Registrations" fill="#8b5cf6" radius={4} />
                <Bar dataKey="Capacity" fill="#10b981" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Event List */}
      <h2 className="text-lg font-semibold mt-10 mb-4">📅 Your Events</h2>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">📋</p>
          <p className="text-xl mb-4">No events created yet.</p>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <motion.div
              key={e.id}
              layout
              className="card p-0 overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {editingId === e.id ? (
                <div className="p-4">
                  <input
                    value={editData.title || ""}
                    onChange={(ev) =>
                      setEditData({ ...editData, title: ev.target.value })
                    }
                    className="card w-full px-3 py-2 mb-2"
                    placeholder="Title"
                  />
                  <textarea
                    value={editData.description || ""}
                    onChange={(ev) =>
                      setEditData({
                        ...editData,
                        description: ev.target.value,
                      })
                    }
                    className="card w-full px-3 py-2 mb-2"
                    rows={2}
                  />
                  <input
                    value={editData.venue || ""}
                    onChange={(ev) =>
                      setEditData({ ...editData, venue: ev.target.value })
                    }
                    className="card w-full px-3 py-2 mb-2"
                    placeholder="Venue"
                  />
                  <input
                    type="number"
                    value={editData.capacity || 0}
                    onChange={(ev) =>
                      setEditData({
                        ...editData,
                        capacity: Number(ev.target.value),
                      })
                    }
                    className="card w-full px-3 py-2 mb-2"
                    placeholder="Capacity"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={saveEdit}
                      className="px-3 py-2 bg-green-600 text-white rounded-xl flex items-center gap-1"
                    >
                      <Save size={16} /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-2 bg-gray-500 text-white rounded-xl flex items-center gap-1"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {e.imageUrl && (
                    <img
                      src={e.imageUrl}
                      alt={e.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold">{e.title}</h3>
                    <p className="text-white/70 text-sm">{e.description}</p>
                    <p className="text-white/60 text-sm mt-1">
                      {e.category} • {e.venue}
                    </p>
                    <p className="text-sm text-white/60 mt-1">
                      {e.eventDate
                        ? new Date(e.eventDate).toLocaleString()
                        : e.startTime
                        ? new Date(e.startTime).toLocaleString()
                        : ""}
                    </p>
                    <p className="text-sm mt-2">
                      Capacity: {e.capacity} | Registered:{" "}
                      {e._count?.registrations ?? 0}
                    </p>
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={() => startEdit(e)}
                        className="px-3 py-2 bg-blue-600 rounded-xl text-white flex items-center gap-1"
                      >
                        <Edit3 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="px-3 py-2 bg-red-600 rounded-xl text-white flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
