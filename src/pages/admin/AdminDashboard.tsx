import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Clock,
  AlertCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getAdminDashboard } from "../../services/dashboardService";
import type { AdminDashboardData } from "../../services/dashboardService";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function cargarDashboard() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminDashboard();
      setDashboard(data);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
      setError("No se pudieron cargar las métricas del dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <RefreshCw className="mx-auto mb-3 animate-spin text-blue-600" />
          <p className="font-medium text-gray-700">Cargando métricas reales...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-semibold">{error}</p>
          <button
            onClick={cargarDashboard}
            className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Usuarios Activos",
      value: dashboard.total_usuarios,
      description: "Usuarios registrados",
      icon: Users,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Técnicos Verificados",
      value: dashboard.tecnicos_verificados,
      description: `${dashboard.total_tecnicos} técnicos en total`,
      icon: UserCheck,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Técnicos Pendientes",
      value: dashboard.tecnicos_pendientes,
      description: "Requieren revisión",
      icon: Clock,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Reseñas Reportadas",
      value: dashboard.resenas_reportadas,
      description: "Pendientes moderación",
      icon: AlertCircle,
      color: "bg-red-100 text-red-700",
    },
  ];

  const quickActions = [
    {
      title: "Aprobar Técnicos",
      description: "Revisa y aprueba solicitudes pendientes",
      link: "/admin/tecnicos",
      count: dashboard.tecnicos_pendientes,
      color: "border-blue-200 bg-blue-50",
    },
    {
      title: "Revisar Reseñas",
      description: "Modera reseñas reportadas",
      link: "/admin/resenas",
      count: dashboard.resenas_reportadas,
      color: "border-red-200 bg-red-50",
    },
    {
      title: "Ver Usuarios",
      description: "Gestiona usuarios de la plataforma",
      link: "/admin/usuarios",
      count: dashboard.total_usuarios,
      color: "border-purple-200 bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resumen</h1>
          <p className="mt-1 text-sm text-gray-500">
            Métricas reales obtenidas desde el backend.
          </p>
        </div>

        <button
          onClick={cargarDashboard}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className={`rounded-xl p-3 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>

            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="mt-1 font-medium text-gray-700">{stat.label}</p>
            <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Acciones Rápidas
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className={`rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-md ${action.color}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {action.title}
                </h3>
                <ArrowRight className="text-gray-500" />
              </div>

              <p className="mb-4 text-sm text-gray-600">
                {action.description}
              </p>

              <span className="inline-flex rounded-lg bg-white px-3 py-1 text-sm font-bold text-gray-900">
                {action.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Estado del Sistema
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Solicitudes activas</p>
            <p className="text-2xl font-bold text-blue-700">
              {dashboard.solicitudes_activas}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Solicitudes finalizadas</p>
            <p className="text-2xl font-bold text-green-700">
              {dashboard.solicitudes_finalizadas}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Reseñas activas</p>
            <p className="text-2xl font-bold text-green-700">
              {dashboard.resenas_activas}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Promedio calificaciones</p>
            <p className="text-2xl font-bold text-yellow-600">
              {dashboard.promedio_calificaciones}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;