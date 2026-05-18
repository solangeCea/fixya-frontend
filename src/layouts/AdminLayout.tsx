import {
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserCheck,
  Star,
  LogOut,
  Wrench,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  const menuItems = [
    {
      path: "/admin/panel",
      icon: LayoutDashboard,
      label: "Resumen",
    },

    {
      path: "/admin/tecnicos",
      icon: UserCheck,
      label: "Gestión de Técnicos",
    },

    {
      path: "/admin/usuarios",
      icon: Users,
      label: "Gestión de Usuarios",
    },

    {
      path: "/admin/resenas",
      icon: Star,
      label: "Gestión de Reseñas",
    },
  ];

  const isActive = (path: string) =>
    location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200">

        {/* LOGO */}
        <div className="p-6 border-b border-gray-200">

          <Link
            to="/admin/panel"
            className="flex items-center gap-3"
          >
            <div className="bg-blue-600 p-2 rounded-xl">
              <Wrench className="text-white" size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                FixYa
              </h1>

              <p className="text-xs text-gray-500">
                Panel Admin
              </p>
            </div>
          </Link>

        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-2">

          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon size={20} />

              <span>{item.label}</span>
            </Link>
          ))}

        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-gray-200">

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={20} />

            <span>Cerrar Sesión</span>
          </button>

        </div>

      </aside>

      {/* SIDEBAR MOBILE */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >

          <aside
            className="w-64 bg-white h-full"
            onClick={(e) => e.stopPropagation()}
          >

            {/* HEADER MOBILE */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">

              <Link
                to="/admin/panel"
                className="flex items-center gap-3"
              >
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Wrench className="text-white" size={22} />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    FixYa
                  </h1>

                  <p className="text-xs text-gray-500">
                    Panel Admin
                  </p>
                </div>
              </Link>

              <button
                onClick={() => setSidebarOpen(false)}
              >
                <X size={24} />
              </button>

            </div>

            {/* MOBILE MENU */}
            <nav className="p-4 space-y-2">

              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={20} />

                  <span>{item.label}</span>
                </Link>
              ))}

            </nav>

            {/* MOBILE LOGOUT */}
            <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={20} />

                <span>Cerrar Sesión</span>
              </button>

            </div>

          </aside>

        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* TOPBAR */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">

          <div className="flex items-center justify-between">

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu size={24} />
            </button>

            {/* TITLE */}
            <div className="hidden lg:block">

              <h2 className="text-2xl font-bold text-gray-900">

                {menuItems.find((item) =>
                  isActive(item.path)
                )?.label || "Panel Admin"}

              </h2>

            </div>

            {/* USER */}
            <div className="flex items-center gap-4">

              <div className="text-right">

                <p className="font-semibold text-gray-900">
                  Administrador
                </p>

                <p className="text-sm text-gray-500">
                  admin@fixya.com
                </p>

              </div>

              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">

                <span className="text-purple-600 font-bold">
                  A
                </span>

              </div>

            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;