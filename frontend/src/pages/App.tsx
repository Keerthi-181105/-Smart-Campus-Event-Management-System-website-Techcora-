import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarSearch,
  GraduationCap,
  Presentation,
  PlusCircle,
  LogIn,
} from "lucide-react";

export default function App() {
  return (
    <div className="relative overflow-hidden text-white">
      {/* ✅ Animated background image */}
      <motion.div
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.35)",
        }}
      />
      {/* ✅ Gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-violet-900/50 via-black/70 to-black" />

      {/* ✅ Navbar */}
      <nav className="relative z-10 flex items-center justify-between p-6 backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="text-xl font-bold tracking-wide">SRM Smart Campus</div>
        <div className="flex gap-6 text-sm items-center">
          <NavLink to="/login" icon={<LogIn size={16} />} label="Login" />
          <NavLink
            to="/student"
            icon={<GraduationCap size={16} />}
            label="Student"
          />
          <NavLink
            to="/organizer"
            icon={<Presentation size={16} />}
            label="Organizer"
          />
          <NavLink
            to="/create-event"
            icon={<PlusCircle size={16} />}
            label="Create Event"
          />
        </div>
      </nav>

      {/* ✅ Hero Section */}
      <header className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-violet-400 to-white"
        >
          Discover. Register. Experience.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-white/80 text-lg"
        >
          Smart campus events for SRM University
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-8"
        >
          <Link
            to="/student"
            className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 transition font-semibold shadow-lg shadow-violet-500/20"
          >
            Browse Events
          </Link>
        </motion.div>

        {/* ✅ Info Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          <InfoCard
            icon={<GraduationCap className="text-violet-400" />}
            title="Student Dashboard"
            text="Find and manage your registered events with live updates."
          />
          <InfoCard
            icon={<Presentation className="text-violet-400" />}
            title="Organizer Tools"
            text="Create events, manage attendees, and view analytics."
          />
          <InfoCard
            icon={<CalendarSearch className="text-violet-400" />}
            title="Public Event Pages"
            text="Shareable pages with countdown and QR check-in."
          />
        </motion.div>
      </header>
    </div>
  );
}

/* ✅ Small reusable components for clarity */
function NavLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="hover:underline flex items-center gap-1 transition hover:text-violet-300"
    >
      {icon}
      {label}
    </Link>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="p-6 bg-black/50 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-black/60 transition">
      <div className="mb-3">{icon}</div>
      <div className="font-semibold text-lg mb-1">{title}</div>
      <div className="text-white/70 text-sm">{text}</div>
    </div>
  );
}
