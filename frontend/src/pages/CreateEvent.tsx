// src/pages/CreateEvent.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Event</h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="card px-3 py-2"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={3}
          className="card px-3 py-2"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="card px-3 py-2"
        >
          {["Tech", "Cultural", "Sports", "Academic", "Social"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          placeholder="Venue"
          className="card px-3 py-2"
          required
        />
        <input
          type="datetime-local"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="card px-3 py-2"
          required
        />
        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          className="card px-3 py-2"
          placeholder="Capacity"
        />
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={isFree}
            onChange={(e) => setIsFree(e.target.checked)}
          />
          <span>Free Event</span>
        </div>
        {!isFree && (
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="card px-3 py-2"
            placeholder="Price"
          />
        )}
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL"
          className="card px-3 py-2"
        />
        <button
          disabled={loading}
          className="bg-violet-600 text-white px-3 py-2 rounded-lg"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
