import { useState } from "react";
import { Bell } from "lucide-react";

import NotificationDropdown from "./NotificationDropdown";

function NotificationBell() {
  const [open, setOpen] = useState(false);

  const totalNotificaciones = 3;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-full p-2 transition hover:bg-gray-100"
      >
        <Bell className="h-6 w-6 text-gray-700" />

        {totalNotificaciones > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {totalNotificaciones}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown />
      )}
    </div>
  );
}

export default NotificationBell;