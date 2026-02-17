import { useEffect, useMemo, useState, useCallback, memo, useRef } from "react";
import { apiFetch } from "../lib/api";
import { QRCodeCanvas } from "qrcode.react";
import ScrollToTop from "../components/ScrollToTop";

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

// Memoized QR Code Component for better performance
const MemoizedQRCode = memo(
  ({ value, size }: { value: string; size: number }) => (
    <QRCodeCanvas value={value} size={size} />
  )
);

// Loading Skeleton Component
const EventSkeleton = () => (
  <div className="bg-white/25 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-48 w-full bg-white/30" />
    <div className="p-5 space-y-3">
      <div className="h-6 bg-white/30 rounded w-3/4" />
      <div className="h-4 bg-white/30 rounded w-1/2" />
      <div className="h-16 bg-white/30 rounded" />
      <div className="h-4 bg-white/30 rounded w-2/3" />
      <div className="h-4 bg-white/30 rounded w-1/3" />
      <div className="h-10 bg-white/30 rounded mt-4" />
    </div>
  </div>
);

// Memoized Event Card Component
const EventCard = memo(
  ({
    event,
    onRegister,
    isRegistering,
  }: {
    event: EventItem;
    onRegister: (event: EventItem) => void;
    isRegistering: boolean;
  }) => {
    const handleClick = useCallback(() => {
      onRegister(event);
    }, [event, onRegister]);

    return (
      <div className="bg-white/25 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition transform duration-300 cursor-pointer">
        <img
          src={event.imageUrl || "/default.jpg"}
          alt={event.title}
          className="h-48 w-full object-cover"
          loading="lazy"
        />
        <div className="p-5">
          <h2 className="text-xl font-bold text-white">{event.title}</h2>
          <p className="text-sm text-gray-200 mt-1">{event.venue}</p>
          <p className="text-sm text-gray-300 mt-2">{event.description}</p>
          <p className="text-sm text-gray-300 mt-1">
            🕒 {new Date(event.startTime).toLocaleTimeString()} -{" "}
            {new Date(event.endTime).toLocaleTimeString()}
          </p>
          <p className="text-sm text-gray-300 mt-1">
            💰 {priceTypeOf(event.price, event.priceType)}
          </p>
          <button
            onClick={handleClick}
            disabled={isRegistering}
            className="mt-4 w-full py-2 rounded-lg bg-violet-700 hover:bg-violet-800 text-white font-semibold transition disabled:opacity-50"
          >
            {isRegistering ? "Registering..." : "Register"}
          </button>
        </div>
      </div>
    );
  }
);

// Memoized QR Code Display Component
const QRCodeDisplay = memo(({ myEvents }: { myEvents: MyEvent[] }) => {
  if (myEvents.length === 0) return null;

  return (
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
            <MemoizedQRCode value={m.qr} size={120} />
            <p className="text-gray-200 mt-3">{m.venue}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

export default function Student() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [cat, setCat] = useState<string>("");
  const [priceType, setPriceType] = useState<string>("");
  const [regLoadingId, setRegLoadingId] = useState<string | null>(null);
  const [myEvents, setMyEvents] = useState<MyEvent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search input
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedQ(q);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [q]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
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
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!events.length) return [];

    const results = events.filter((e) => {
      const matchesSearch =
        !debouncedQ || e.title.toLowerCase().includes(debouncedQ.toLowerCase()) ||
        e.description.toLowerCase().includes(debouncedQ.toLowerCase());
      const matchesCategory = !cat || e.category === cat;
      const matchesPrice =
        !priceType || priceTypeOf(e.price, e.priceType) === priceType;
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Reset to first page when filters change
    setCurrentPage(1);
    return results;
  }, [events, debouncedQ, cat, priceType]);

  // Paginated results
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleRegister = useCallback(async (event: EventItem) => {
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

      setMyEvents((prev) => {
        const updated = [...prev, newQr];
        localStorage.setItem("registeredQRs", JSON.stringify(updated));
        return updated;
      });

      // Update organizer QR codes
      const orgQR = JSON.parse(localStorage.getItem("organizerQRs") || "[]");
      localStorage.setItem("organizerQRs", JSON.stringify([...orgQR, newQr]));
    } finally {
      setRegLoadingId(null);
    }
  }, []);

  // Memoized input handlers for better performance
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQ(e.target.value);
    },
    []
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCat(e.target.value);
    },
    []
  );

  const handlePriceTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPriceType(e.target.value);
    },
    []
  );

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
          onChange={handleSearchChange}
        />
        <select
          className="p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/70 text-white bg-white/20 border border-white/40 backdrop-blur-sm transition"
          value={cat}
          onChange={handleCategoryChange}
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
          onChange={handlePriceTypeChange}
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
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <EventSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-white text-xl py-20">
          <p className="text-4xl mb-4">🔍</p>
          <p>No events found matching your filters</p>
          <button
            onClick={() => {
              setQ("");
              setCat("");
              setPriceType("");
            }}
            className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedEvents.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                onRegister={handleRegister}
                isRegistering={regLoadingId === e.id}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition"
              >
                ← Previous
              </button>
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      currentPage === i + 1
                        ? "bg-violet-600 text-white"
                        : "bg-white/20 hover:bg-white/30 text-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* QR Codes */}
      <QRCodeDisplay myEvents={myEvents} />

      {/* Scroll to Top Button */}
      <ScrollToTop />

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
