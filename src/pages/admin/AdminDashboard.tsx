import {
  Users,
  UserCheck,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  ClipboardList,
  Star,
  ShieldCheck,
  RefreshCw,
  BarChart3,
} from "lucide-react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { getAdminDashboard } from "../../services/dashboardService";
import type { AdminDashboardData } from "../../services/dashboardService";

export default function AdminDashboard() {
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
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <RefreshCw className="mx-auto mb-3 animate-spin text-blue-600" />
          <p className="font-medium text-gray-700">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="font-semibold">{error || "No se pudo cargar el dashboard."}</p>

        <button
          onClick={cargarDashboard}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const stats = [
    {
      label: "Usuarios",
      value: dashboard.total_usuarios,
      description: "Usuarios registrados",
      icon: Users,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Técnicos Verificados",
      value: dashboard.tecnicos_verificados,
      description: `${dashboard.total_tecnicos} técnicos en total`,
      icon: ShieldCheck,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Solicitudes Activas",
      value: dashboard.solicitudes_activas,
      description: "Servicios en proceso",
      icon: ClipboardList,
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      label: "Reseñas Reportadas",
      value: dashboard.resenas_reportadas,
      description: "Requieren moderación",
      icon: AlertCircle,
      color: "bg-red-100 text-red-700",
    },
  ];

  const quickActions = [
    {
      title: "Gestionar Solicitudes",
      description: "Asignar técnicos y revisar estados",
      link: "/admin/solicitudes",
      count: dashboard.solicitudes_activas,
    },
    {
      title: "Ver Técnicos",
      description: "Revisar técnicos registrados",
      link: "/admin/tecnicos",
      count: dashboard.total_tecnicos,
    },
    {
      title: "Moderar Reseñas",
      description: "Revisar reseñas reportadas",
      link: "/admin/resenas",
      count: dashboard.resenas_reportadas,
    },
  ];

  const totalSolicitudes =
    dashboard.solicitudes_activas + dashboard.solicitudes_finalizadas;

  const porcentajeFinalizadas =
    totalSolicitudes > 0
      ? Math.round((dashboard.solicitudes_finalizadas / totalSolicitudes) * 100)
      : 0;

  const totalResenas =
    dashboard.resenas_activas + dashboard.resenas_reportadas;

  const porcentajeResenasActivas =
    totalResenas > 0
      ? Math.round((dashboard.resenas_activas / totalResenas) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Administrativo
          </h1>

          <p className="mt-2 text-gray-600">
            Métricas reales del sistema FixYa conectadas al backend.
          </p>
        </div>

        <button
          onClick={cargarDashboard}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className={`${stat.color} rounded-xl p-3`}>
                <stat.icon size={24} />
              </div>

              <TrendingUp className="text-green-600" size={20} />
            </div>

            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>

            <p className="mt-1 text-sm font-semibold text-gray-700">
              {stat.label}
            </p>

            <p className="mt-1 text-xs text-gray-500">{stat.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
              <BarChart3 size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Estado Operativo
              </h2>
              <p className="text-sm text-gray-500">
                Resumen general de solicitudes y reseñas.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-gray-700">
                  Solicitudes finalizadas
                </span>
                <span className="font-bold text-gray-900">
                  {porcentajeFinalizadas}%
                </span>
              </div>

              <div className="h-3 rounded-full bg-gray-100">
                <div
                  className="h-3 rounded-full bg-green-500"
                  style={{ width: `${porcentajeFinalizadas}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                {dashboard.solicitudes_finalizadas} finalizadas de{" "}
                {totalSolicitudes} solicitudes consideradas.
              </p>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-gray-700">
                  Reseñas activas
                </span>
                <span className="font-bold text-gray-900">
                  {porcentajeResenasActivas}%
                </span>
              </div>

              <div className="h-3 rounded-full bg-gray-100">
                <div
                  className="h-3 rounded-full bg-yellow-500"
                  style={{ width: `${porcentajeResenasActivas}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                {dashboard.resenas_activas} activas de {totalResenas} reseñas
                consideradas.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            Calificación Promedio
          </h2>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-yellow-100 p-4 text-yellow-600">
              <Star className="fill-yellow-500" size={34} />
            </div>

            <div>
              <p className="text-4xl font-bold text-gray-900">
                {dashboard.promedio_calificaciones}
              </p>
              <p className="text-sm text-gray-500">
                Promedio de reseñas activas
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-700">
              Reseñas activas
            </p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {dashboard.resenas_activas}
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Acciones Rápidas
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {action.title}
                </h3>

                <ArrowRight
                  className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                  size={20}
                />
              </div>

              <p className="mb-4 text-sm text-gray-600">
                {action.description}
              </p>

              <span className="inline-flex rounded-xl bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                {action.count}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="rounded-2xl bg-white shadow-sm"
      >
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900">
            Resumen General
          </h2>
        </div>

        <div className="grid gap-0 divide-y divide-gray-100 md:grid-cols-2 md:divide-x md:divide-y-0">
          <div className="p-6">
            <h3 className="mb-4 font-bold text-gray-900">Solicitudes</h3>

            <div className="space-y-3">
              <div className="flex justify-between rounded-xl bg-blue-50 p-4">
                <span className="font-medium text-gray-700">Activas</span>
                <span className="font-bold text-blue-700">
                  {dashboard.solicitudes_activas}
                </span>
              </div>

              <div className="flex justify-between rounded-xl bg-green-50 p-4">
                <span className="font-medium text-gray-700">Finalizadas</span>
                <span className="font-bold text-green-700">
                  {dashboard.solicitudes_finalizadas}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="mb-4 font-bold text-gray-900">Técnicos</h3>

            <div className="space-y-3">
              <div className="flex justify-between rounded-xl bg-green-50 p-4">
                <span className="font-medium text-gray-700">Verificados</span>
                <span className="font-bold text-green-700">
                  {dashboard.tecnicos_verificados}
                </span>
              </div>

              <div className="flex justify-between rounded-xl bg-yellow-50 p-4">
                <span className="font-medium text-gray-700">Pendientes</span>
                <span className="font-bold text-yellow-700">
                  {dashboard.tecnicos_pendientes}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}