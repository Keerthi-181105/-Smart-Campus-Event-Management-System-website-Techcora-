import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";
import { QRCodeCanvas } from "qrcode.react";

type EventItem = {
  id: string;
  title: string;
  description: string;
  venue: string;
  category: string;
  startTime: string;
  endTime: string;
  capacity: number;
  price: number;
  priceType?: string | null;
  imageUrl?: string | null;
  _count?: { registrations: number };
};

type MyEvent = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  venue: string;
  qr: string;
};

const categories = ["Technical", "Cultural", "Sports", "Academic", "Social"];
const priceTypes = ["Free", "Paid", "Donation"];

function priceTypeOf(price: number, explicit?: string | null) {
  if (explicit) {
    const p = explicit.toLowerCase();
    if (p === "free") return "Free";
    if (p === "paid") return "Paid";
    if (p === "donation") return "Donation";
  }
  if (price === 0) return "Free";
  if (price > 0) return "Paid";
  return "Donation";
}

function makeQrText(e: EventItem) {
  return `EventQR|${e.id}|${e.title}|${e.venue}|${e.startTime}`;
}

export default function Student() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");
  const [priceType, setPriceType] = useState<string>("");
  const [regLoadingId, setRegLoadingId] = useState<string | null>(null);
  const [myEvents, setMyEvents] = useState<MyEvent[]>([]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await apiFetch("/api/events").catch(() => null);
        const stored = JSON.parse(localStorage.getItem("events") || "[]");
        const storedQRs = JSON.parse(
          localStorage.getItem("registeredQRs") || "[]"
        );

        const fallbackEvents: EventItem[] = [
          {
            id: "1",
            title: "AI/ML Workshop",
            description: "Hands-on coding and ML session",
            venue: "Tech Park",
            category: "Technical",
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            capacity: 150,
            price: 0,
            priceType: "Free",
            imageUrl:
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
            _count: { registrations: 0 },
          },
          {
            id: "2",
            title: "Cybersecurity Seminar",
            description: "Guest lecture on cybersecurity best practices",
            venue: "Main Auditorium",
            category: "Technical",
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            capacity: 120,
            price: 199,
            priceType: "Paid",
            imageUrl:
              "https://images.unsplash.com/photo-1556157382-97eda2d62296",
            _count: { registrations: 0 },
          },
          {
            id: "3",
            title: "Music Night",
            description: "Live band performances",
            venue: "Open Ground",
            category: "Cultural",
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            capacity: 500,
            price: 0,
            priceType: "Free",
            imageUrl:
              "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
            _count: { registrations: 0 },
          },
          {
            id: "4",
            title: "Dance Workshop",
            description: "Learn popular dance moves",
            venue: "Seminar Hall",
            category: "Cultural",
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            capacity: 200,
            price: 99,
            priceType: "Paid",
            imageUrl:
              "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91",
            _count: { registrations: 0 },
          },
          {
            id: "5",
            title: "Cricket Tournament",
            description: "Inter-department cricket league",
            venue: "Sports Ground",
            category: "Sports",
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            capacity: 100,
            price: 0,
            priceType: "Free",
            imageUrl:
              "https://th.bing.com/th/id/OIP.-5u9TeuOxh6oikHaK9ZnCwHaDt?o=7&cb=12rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
            _count: { registrations: 0 },
          },
          {
            id: "6",
            title: "Career Fair",
            description: "Meet recruiters from top companies",
            venue: "Convention Center",
            category: "Academic",
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            capacity: 300,
            price: 0,
            priceType: "Free",
            imageUrl:
              "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
            _count: { registrations: 0 },
          },
          {
            id: "7",
            title: "Photography Contest",
            description: "Showcase your best captures",
            venue: "Visual Arts Studio",
            category: "Cultural",
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            capacity: 100,
            price: 50,
            priceType: "Paid",
            imageUrl:
              "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
            _count: { registrations: 0 },
          },
          {
            id: "8",
            title: "Blood Donation Camp",
            description: "Help save lives by donating blood",
            venue: "Health Block",
            category: "Social",
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            capacity: 400,
            price: 0,
            priceType: "Donation",
            imageUrl:
              "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
            _count: { registrations: 0 },
          },
          {
            id: "9",
            title: "Hackathon 2025",
            description: "24-hour coding challenge",
            venue: "Innovation Lab",
            category: "Technical",
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            capacity: 250,
            price: 0,
            priceType: "Free",
            imageUrl:
              "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
            _count: { registrations: 0 },
          },
          {
            id: "10",
            title: "Debate Competition",
            description: "Compete with top debaters from campus",
            venue: "Auditorium",
            category: "Academic",
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            capacity: 80,
            price: 0,
            priceType: "Free",
            imageUrl:
              "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
            _count: { registrations: 0 },
          },
        ];

        if (!ignore) {
          setEvents(
            data?.length ? [...data, ...stored] : [...stored, ...fallbackEvents]
          );
          setMyEvents(storedQRs);
        }
      } catch (err) {
        console.error("Error loading events:", err);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch = e.title.toLowerCase().includes(q.toLowerCase());
      const matchesCategory = !cat || e.category === cat;
      const matchesPrice =
        !priceType || priceTypeOf(e.price, e.priceType) === priceType;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [events, q, cat, priceType]);

  const handleRegister = async (event: EventItem) => {
    setRegLoadingId(event.id);
    try {
      await apiFetch(`/api/events/${event.id}/register`, {
        method: "POST",
      }).catch(() => null);
      const qr = makeQrText(event);
      const newQr = {
        id: event.id,
        title: event.title,
        startTime: event.startTime,
        endTime: event.endTime,
        venue: event.venue,
        qr,
      };
      const updated = [...myEvents, newQr];
      setMyEvents(updated);
      localStorage.setItem("registeredQRs", JSON.stringify(updated));
      const orgQR = JSON.parse(localStorage.getItem("organizerQRs") || "[]");
      localStorage.setItem("organizerQRs", JSON.stringify([...orgQR, newQr]));
    } finally {
      setRegLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Animated Violet Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-600 animate-gradient-slow -z-10"></div>

      <h1 className="text-4xl font-bold mb-8 text-center text-white drop-shadow-lg">
        🎟 Student Dashboard
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        <input
          placeholder="Search events..."
          className="p-3 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-white/70 text-white bg-white/20 placeholder-white/70 backdrop-blur-sm border border-white/40 transition"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/70 text-white bg-white/20 border border-white/40 backdrop-blur-sm transition"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} className="text-black">
              {c}
            </option>
          ))}
        </select>
        <select
          className="p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/70 text-white bg-white/20 border border-white/40 backdrop-blur-sm transition"
          value={priceType}
          onChange={(e) => setPriceType(e.target.value)}
        >
          <option value="">All Price Types</option>
          {priceTypes.map((t) => (
            <option key={t} className="text-black">
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Event Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((e) => (
          <div
            key={e.id}
            className="bg-white/25 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition transform duration-300 cursor-pointer"
          >
            <img
              src={e.imageUrl || "/default.jpg"}
              alt={e.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-bold text-white">{e.title}</h2>
              <p className="text-sm text-gray-200 mt-1">{e.venue}</p>
              <p className="text-sm text-gray-300 mt-2">{e.description}</p>
              <p className="text-sm text-gray-300 mt-1">
                🕒 {new Date(e.startTime).toLocaleTimeString()} -{" "}
                {new Date(e.endTime).toLocaleTimeString()}
              </p>
              <p className="text-sm text-gray-300 mt-1">
                💰 {priceTypeOf(e.price, e.priceType)}
              </p>
              <button
                onClick={() => handleRegister(e)}
                disabled={regLoadingId === e.id}
                className="mt-4 w-full py-2 rounded-lg bg-violet-700 hover:bg-violet-800 text-white font-semibold transition"
              >
                {regLoadingId === e.id ? "Registering..." : "Register"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Codes */}
      {myEvents.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">
            🎫 Your Registered Event QR Codes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {myEvents.map((m) => (
              <div
                key={m.id}
                className="p-6 bg-white/25 backdrop-blur-md rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition transform duration-300"
              >
                <h3 className="text-xl font-bold text-white mb-3">{m.title}</h3>
                <QRCodeCanvas value={m.qr} size={120} />
                <p className="text-gray-200 mt-3">{m.venue}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tailwind custom animation */}
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
