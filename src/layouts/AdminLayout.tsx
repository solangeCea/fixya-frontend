import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Star,
  LogOut,
  Wrench,
  Menu,
  X,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/admin/panel",
      icon: LayoutDashboard,
      label: "Resumen",
    },
    {
      path: "/admin/solicitudes",
      icon: ClipboardList,
      label: "Gestión de Solicitudes",
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">
        <div className="border-b border-gray-200 p-6">
          <Link to="/admin/panel" className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2">
              <Wrench className="text-white" size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">FixYa</h1>
              <p className="text-xs text-gray-500">Panel Admin</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                isActive(item.path)
                  ? "bg-blue-50 font-semibold text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="h-full w-64 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <Link to="/admin/panel" className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-600 p-2">
                  <Wrench className="text-white" size={22} />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-gray-900">FixYa</h1>
                  <p className="text-xs text-gray-500">Panel Admin</p>
                </div>
              </Link>

              <button onClick={() => setSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <nav className="space-y-2 p-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                    isActive(item.path)
                      ? "bg-blue-50 font-semibold text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu size={24} />
            </button>

            <div className="hidden lg:block">
              <h2 className="text-2xl font-bold text-gray-900">
                {menuItems.find((item) => isActive(item.path))?.label ||
                  "Panel Admin"}
              </h2>
            </div>

            <div className="text-right">
              <p className="font-semibold text-gray-900">Administrador</p>
              <p className="text-sm text-gray-500">admin@fixya.cl</p>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;