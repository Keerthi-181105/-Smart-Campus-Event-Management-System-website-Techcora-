// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import App from "./pages/App";
import Student from "./pages/Student";
import Organizer from "./pages/Organizer";
import CreateEvent from "./pages/CreateEvent";
import Login from "./pages/Login";
import Analytics from "./pages/Analytics";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const NotFound: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-black text-violet-400">
    <h1 className="text-6xl font-bold mb-4">404</h1>
    <p className="text-lg mb-6">Oops! Page Not Found</p>
    <a
      href="/"
      className="px-6 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition"
    >
      Go Home
    </a>
  </div>
);

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/analytics", element: <Analytics /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/student", element: <Student /> },
  { path: "/organizer", element: <Organizer /> },
  { path: "/create-event", element: <CreateEvent /> },
  { path: "/event/:id", element: <CreateEvent /> },

  // Fallback Route (404)
  { path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
