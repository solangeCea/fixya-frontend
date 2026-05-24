import {
  Users,
  UserCheck,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  ClipboardList,
  Star,
} from "lucide-react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getAdminDashboard,
} from "../../services/dashboardService";

import type {
  AdminDashboardData,
} from "../../services/dashboardService";

export default function AdminDashboard() {
  const [dashboard, setDashboard] =
    useState<AdminDashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function cargarDashboard() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminDashboard();
      setDashboard(data);
    } catch {
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
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        Cargando dashboard...
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error || "No se pudo cargar el dashboard."}
      </div>
    );
  }

  const stats = [
    {
      label: "Usuarios Activos",
      value: dashboard.total_usuarios,
      change: "Usuarios registrados en FixYa",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      trend: "up",
    },
    {
      label: "Técnicos Verificados",
      value: dashboard.tecnicos_verificados,
      change: `${dashboard.total_tecnicos} técnicos en total`,
      icon: UserCheck,
      color: "bg-green-100 text-green-600",
      trend: "up",
    },
    {
      label: "Técnicos Pendientes",
      value: dashboard.tecnicos_pendientes,
      change: "Requieren revisión",
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-600",
      trend: "neutral",
    },
    {
      label: "Reseñas Reportadas",
      value: dashboard.resenas_reportadas,
      change: "Pendientes de moderación",
      icon: AlertCircle,
      color: "bg-red-100 text-red-600",
      trend: "neutral",
    },
  ];

  const quickActions = [
    {
      title: "Asignar Solicitudes",
      description: "Gestiona solicitudes y asigna técnicos",
      link: "/admin/solicitudes",
      count: dashboard.solicitudes_activas,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    },
    {
      title: "Revisar Reseñas",
      description: "Modera reseñas reportadas",
      link: "/admin/resenas",
      count: dashboard.resenas_reportadas,
      color: "bg-red-50 border-red-200 hover:bg-red-100",
    },
    {
      title: "Ver Usuarios",
      description: "Gestiona usuarios de la plataforma",
      link: "/admin/usuarios",
      count: dashboard.total_usuarios,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    },
  ];

  const recentActivity = [
    {
      action: "Solicitudes activas",
      user: `${dashboard.solicitudes_activas} solicitudes en proceso`,
      type: "new",
    },
    {
      action: "Solicitudes finalizadas",
      user: `${dashboard.solicitudes_finalizadas} trabajos completados`,
      type: "approved",
    },
    {
      action: "Reseñas activas",
      user: `${dashboard.resenas_activas} reseñas publicadas`,
      type: "new",
    },
    {
      action: "Promedio de calificación",
      user: `${dashboard.promedio_calificaciones} estrellas`,
      type: "approved",
    },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case "new":
        return "bg-blue-100 text-blue-600";
      case "approved":
        return "bg-green-100 text-green-600";
      case "flagged":
        return "bg-red-100 text-red-600";
      case "rejected":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Administrativo
        </h1>

        <p className="mt-2 text-gray-600">
          Métricas reales del sistema FixYa.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className={`${stat.color} rounded-xl p-3`}>
                <stat.icon size={24} />
              </div>

              {stat.trend === "up" && (
                <TrendingUp className="text-green-600" size={20} />
              )}
            </div>

            <p className="mb-1 text-3xl font-bold text-gray-900">
              {stat.value}
            </p>

            <p className="mb-1 text-sm font-medium text-gray-600">
              {stat.label}
            </p>

            <p className="text-xs text-gray-500">
              {stat.change}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Acciones Rápidas
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className={`${action.color} group rounded-2xl border-2 p-6 transition-all`}
            >
              <div className="mb-3 flex items-start justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {action.title}
                </h3>

                <ArrowRight
                  className="text-gray-400 transition-colors group-hover:text-gray-900"
                  size={20}
                />
              </div>

              <p className="mb-3 text-sm text-gray-600">
                {action.description}
              </p>

              <div className="inline-block rounded-lg bg-white px-3 py-1">
                <span className="font-bold text-gray-900">
                  {action.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-white p-6 shadow-sm"
        >
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Solicitudes
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <ClipboardList className="text-blue-600" size={20} />
                <span className="font-medium text-gray-700">
                  Activas
                </span>
              </div>

              <span className="font-bold text-blue-600">
                {dashboard.solicitudes_activas}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <UserCheck className="text-green-600" size={20} />
                <span className="font-medium text-gray-700">
                  Finalizadas
                </span>
              </div>

              <span className="font-bold text-green-600">
                {dashboard.solicitudes_finalizadas}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-white p-6 shadow-sm"
        >
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Reseñas
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <Star className="fill-yellow-500 text-yellow-500" size={20} />
                <span className="font-medium text-gray-700">
                  Promedio
                </span>
              </div>

              <span className="font-bold text-yellow-600">
                {dashboard.promedio_calificaciones}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <Star className="text-green-600" size={20} />
                <span className="font-medium text-gray-700">
                  Activas
                </span>
              </div>

              <span className="font-bold text-green-600">
                {dashboard.resenas_activas}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-2xl bg-white shadow-sm"
      >
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900">
            Resumen Operativo
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="p-6 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`${getActivityColor(
                    activity.type
                  )} flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg`}
                >
                  <div className="h-2 w-2 rounded-full bg-current"></div>
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {activity.action}
                  </p>

                  <p className="text-sm text-gray-600">
                    {activity.user}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}