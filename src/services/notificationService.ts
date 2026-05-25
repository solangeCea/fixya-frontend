import API_URL from "./api";
import { getToken } from "./token";

export interface Notification {
  id_notificacion: number;
  usuario_rut: string;
  titulo: string;
  mensaje: string;
  tipo: string;
  leida: boolean;
  fecha_creacion: string;
}

export async function getNotifications(): Promise<Notification[]> {
  const token = getToken();

  const response = await fetch(`${API_URL}/notificaciones/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener notificaciones");
  }

  return response.json();
}

export async function markNotificationAsRead(idNotificacion: number) {
  const token = getToken();

  const response = await fetch(`${API_URL}/notificaciones/${idNotificacion}/leer`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al marcar notificación como leída");
  }

  return response.json();
}

export async function markAllNotificationsAsRead() {
  const token = getToken();

  const response = await fetch(`${API_URL}/notificaciones/leer-todas`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al marcar todas como leídas");
  }

  return response.json();
}