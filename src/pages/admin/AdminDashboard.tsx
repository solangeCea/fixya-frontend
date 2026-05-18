import {
  Users,
  UserCheck,
  AlertCircle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import { motion } from "framer-motion";

import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const stats = [
    {
      label: "Usuarios Activos",
      value: "2,847",
      change: "+12% vs mes anterior",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      trend: "up",
    },

    {
      label: "Técnicos Verificados",
      value: "342",
      change: "+28 este mes",
      icon: UserCheck,
      color: "bg-green-100 text-green-600",
      trend: "up",
    },

    {
      label: "Técnicos Pendientes",
      value: "12",
      change: "Requieren revisión",
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-600",
      trend: "neutral",
    },

    {
      label: "Reseñas Reportadas",
      value: "5",
      change: "Pendientes moderación",
      icon: AlertCircle,
      color: "bg-red-100 text-red-600",
      trend: "neutral",
    },
  ];

  const quickActions = [
    {
      title: "Aprobar Técnicos",
      description: "Revisa y aprueba solicitudes pendientes",
      link: "/admin/tecnicos",
      count: 12,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    },

    {
      title: "Revisar Reseñas",
      description: "Modera reseñas reportadas",
      link: "/admin/resenas",
      count: 5,
      color: "bg-red-50 border-red-200 hover:bg-red-100",
    },

    {
      title: "Ver Usuarios",
      description: "Gestiona usuarios de la plataforma",
      link: "/admin/usuarios",
      count: 2847,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    },
  ];

  const recentActivity = [
    {
      action: "Nuevo registro de técnico",
      user: "Luis Fernández",
      time: "Hace 5 min",
      type: "new",
    },

    {
      action: "Técnico aprobado",
      user: "Carlos Mendoza",
      time: "Hace 15 min",
      type: "approved",
    },

    {
      action: "Reseña reportada",
      user: "María González",
      time: "Hace 1 hora",
      type: "flagged",
    },

    {
      action: "Nuevo usuario registrado",
      user: "Ana Torres",
      time: "Hace 2 horas",
      type: "new",
    },

    {
      action: "Técnico rechazado",
      user: "Pedro Silva",
      time: "Hace 3 horas",
      type: "rejected",
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

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >

            <div className="flex items-start justify-between mb-4">

              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon size={24} />
              </div>

              {stat.trend === "up" && (
                <TrendingUp
                  className="text-green-600"
                  size={20}
                />
              )}

            </div>

            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </p>

            <p className="text-sm font-medium text-gray-600 mb-1">
              {stat.label}
            </p>

            <p className="text-xs text-gray-500">
              {stat.change}
            </p>

          </motion.div>
        ))}

      </div>

      {/* QUICK ACTIONS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >

        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Acciones Rápidas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className={`${action.color} border-2 rounded-2xl p-6 transition-all group`}
            >

              <div className="flex items-start justify-between mb-3">

                <h3 className="font-bold text-gray-900 text-lg">
                  {action.title}
                </h3>

                <ArrowRight
                  className="text-gray-400 group-hover:text-gray-900 transition-colors"
                  size={20}
                />

              </div>

              <p className="text-gray-600 text-sm mb-3">
                {action.description}
              </p>

              <div className="inline-block bg-white px-3 py-1 rounded-lg">

                <span className="font-bold text-gray-900">
                  {action.count}
                </span>

              </div>

            </Link>
          ))}

        </div>

      </motion.div>

      {/* RECENT ACTIVITY */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm"
      >

        <div className="p-6 border-b border-gray-200">

          <h2 className="text-xl font-bold text-gray-900">
            Actividad Reciente
          </h2>

        </div>

        <div className="divide-y divide-gray-200">

          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="p-6 hover:bg-gray-50 transition-colors"
            >

              <div className="flex items-start gap-4">

                <div
                  className={`${getActivityColor(activity.type)} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                </div>

                <div className="flex-1">

                  <p className="font-semibold text-gray-900">
                    {activity.action}
                  </p>

                  <p className="text-sm text-gray-600">
                    {activity.user}
                  </p>

                </div>

                <span className="text-sm text-gray-500">
                  {activity.time}
                </span>

              </div>

            </div>
          ))}

        </div>

      </motion.div>

    </div>
  );
}