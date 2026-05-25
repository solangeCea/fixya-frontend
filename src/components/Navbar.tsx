import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

import NotificationBell from "./notifications/NotificationBell";

function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <div className="rounded-lg bg-blue-600 p-2 text-white">
            🔧
          </div>

          <h1 className="text-2xl font-bold text-blue-600">
            FixYa
          </h1>
        </Link>

        {/* LINKS */}
        <div className="flex items-center gap-6">

          <Link
            to="/"
            className="font-medium text-gray-700 hover:text-blue-600"
          >
            Inicio
          </Link>

          <Link
            to="/servicios"
            className="font-medium text-gray-700 hover:text-blue-600"
          >
            Servicios
          </Link>

          {/* NOTIFICACIONES */}
          <NotificationBell />

          <Link
            to="/login"
            className="font-medium text-gray-700 hover:text-blue-600"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Registro
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;