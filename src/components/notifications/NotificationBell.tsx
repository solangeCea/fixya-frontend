import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

import NotificationDropdown from "./NotificationDropdown";
import { getNotifications } from "../../services/notificationService";
import type { Notification } from "../../services/notificationService";

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  async function cargarNotificaciones() {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
    }
  }

  useEffect(() => {
    cargarNotificaciones();

    const interval = setInterval(() => {
      cargarNotificaciones();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const totalNoLeidas = notifications.filter((n) => !n.leida).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-full p-2 transition hover:bg-gray-100"
      >
        <Bell className="h-6 w-6 text-gray-700" />

        {totalNoLeidas > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {totalNoLeidas}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          onReload={cargarNotificaciones}
        />
      )}
    </div>
  );
}

export default NotificationBell;