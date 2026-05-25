import type { Notification } from "../../services/notificationService";

interface Props {
  notification: Notification;
  onClick: () => void;
}

function NotificationItem({ notification, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full border-b border-gray-100 p-4 text-left transition hover:bg-gray-50 ${
        notification.leida ? "bg-white" : "bg-blue-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            {!notification.leida && (
              <span className="h-2 w-2 rounded-full bg-blue-600" />
            )}

            <h4 className="font-semibold text-gray-900">
              {notification.titulo}
            </h4>
          </div>

          <p className="mt-1 text-sm text-gray-600">
            {notification.mensaje}
          </p>

          <span className="mt-2 inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            {notification.tipo}
          </span>
        </div>

        <span className="whitespace-nowrap text-xs text-gray-400">
          {new Date(notification.fecha_creacion).toLocaleDateString()}
        </span>
      </div>
    </button>
  );
}

export default NotificationItem;