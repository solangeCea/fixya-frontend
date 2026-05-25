import NotificationItem from "./NotificationItem";

function NotificationDropdown() {
  const notifications = [
    {
      id: 1,
      title: "Nueva solicitud asignada",
      message: "Tienes un nuevo trabajo disponible.",
      time: "Hace 5 min",
    },
    {
      id: 2,
      title: "Reseña reportada",
      message: "Una reseña requiere moderación.",
      time: "Hace 20 min",
    },
    {
      id: 3,
      title: "Solicitud finalizada",
      message: "Un servicio fue completado.",
      time: "Hace 1 hora",
    },
  ];

  return (
    <div className="absolute right-0 z-50 mt-3 w-80 rounded-2xl border border-gray-200 bg-white shadow-xl">
      <div className="border-b border-gray-100 p-4">
        <h3 className="text-lg font-bold text-gray-900">
          Notificaciones
        </h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            title={notification.title}
            message={notification.message}
            time={notification.time}
          />
        ))}
      </div>
    </div>
  );
}

export default NotificationDropdown;