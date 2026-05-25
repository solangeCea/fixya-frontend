import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/notificationService";

import type { Notification } from "../../services/notificationService";
import NotificationItem from "./NotificationItem";

interface Props {
  notifications: Notification[];
  onReload: () => void;
}

function NotificationDropdown({ notifications, onReload }: Props) {
  async function handleMarkAsRead(id: number) {
    try {
      await markNotificationAsRead(id);
      onReload();
    } catch (error) {
      console.error("Error marcando notificación:", error);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllNotificationsAsRead();
      onReload();
    } catch (error) {
      console.error("Error marcando todas:", error);
    }
  }

  return (
    <div className="absolute right-0 z-50 mt-3 w-96 rounded-2xl border border-gray-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <h3 className="text-lg font-bold text-gray-900">
          Notificaciones
        </h3>

        {notifications.some((n) => !n.leida) && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Marcar todas
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
            No tienes notificaciones.
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id_notificacion}
              notification={notification}
              onClick={() =>
                handleMarkAsRead(notification.id_notificacion)
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationDropdown;