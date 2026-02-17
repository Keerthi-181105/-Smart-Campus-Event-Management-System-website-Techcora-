// src/pages/CreateEvent.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { motion } from "framer-motion";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Tech");
  const [venue, setVenue] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [capacity, setCapacity] = useState(100);
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!title.trim() || !description.trim() || !venue.trim()) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (capacity < 1) {
      setError("Capacity must be at least 1");
      return;
    }
    
    if (!isFree && price < 0) {
      setError("Price cannot be negative");
      return;
    }
    
    setLoading(true);

    const newEvent = {
      id: Date.now(), // unique local id
      title,
      description,
      category,
      venue,
      eventDate: new Date(eventDate),
      capacity,
      isFree,
      price: isFree ? 0 : price,
      imageUrl: imageUrl || "https://placehold.co/600x400?text=Event",
    };

    try {
      await apiFetch("/api/events", {
        method: "POST",
        body: JSON.stringify(newEvent),
      });
    } catch {
      // Fallback: Save locally if backend fails
      const stored = JSON.parse(localStorage.getItem("events") || "[]");
      localStorage.setItem("events", JSON.stringify([...stored, newEvent]));
    } finally {
      // ✅ Trigger update for Student Dashboard
      localStorage.setItem("lastEventAdded", Date.now().toString());

      setLoading(false);
      navigate("/organizer");
    }
  }

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient-slow -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8"
      >
        <h1 className="text-3xl font-bold mb-6 text-white text-center">
          ✨ Create New Event
        </h1>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-white"
          >
            ⚠️ {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="block text-white/80 mb-2 text-sm font-semibold">
              Event Title *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., AI Workshop 2026"
              className="w-full bg-white/20 border border-white/30 text-white placeholder-white/60 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              required
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-sm font-semibold">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your event..."
              rows={4}
              className="w-full bg-white/20 border border-white/30 text-white placeholder-white/60 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 mb-2 text-sm font-semibold">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/20 border border-white/30 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              >
                {["Tech", "Cultural", "Sports", "Academic", "Social"].map((c) => (
                  <option key={c} value={c} className="text-black">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm font-semibold">
                Venue *
              </label>
              <input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g., Main Auditorium"
                className="w-full bg-white/20 border border-white/30 text-white placeholder-white/60 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-sm font-semibold">
              Event Date & Time *
            </label>
            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-white/20 border border-white/30 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              required
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-sm font-semibold">
              Capacity
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full bg-white/20 border border-white/30 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              placeholder="Maximum attendees"
              min="1"
            />
          </div>

          <div className="flex gap-3 items-center bg-white/10 p-4 rounded-xl">
            <input
              type="checkbox"
              id="isFree"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="w-5 h-5 rounded"
            />
            <label htmlFor="isFree" className="text-white font-semibold cursor-pointer">
              Free Event
            </label>
          </div>

          {!isFree && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <label className="block text-white/80 mb-2 text-sm font-semibold">
                Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-white/20 border border-white/30 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                placeholder="Event price"
                min="0"
              />
            </motion.div>
          )}

          <div>
            <label className="block text-white/80 mb-2 text-sm font-semibold">
              Image URL (Optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-white/20 border border-white/30 text-white placeholder-white/60 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition"
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate("/organizer")}
              className="flex-1 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-4 py-3 rounded-xl font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-semibold transition shadow-lg"
            >
              {loading ? "Creating..." : "Create Event 🎉"}
            </button>
          </div>
        </form>
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
