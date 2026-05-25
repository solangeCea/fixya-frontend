import API_URL from "./api";
import { getToken } from "./token";

export interface AdminDashboardData {
  total_usuarios: number;
  total_tecnicos: number;
  tecnicos_verificados: number;
  tecnicos_pendientes: number;
  solicitudes_activas: number;
  solicitudes_finalizadas: number;
  resenas_activas: number;
  resenas_reportadas: number;
  promedio_calificaciones: number;
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const token = getToken();

  const response = await fetch(`${API_URL}/admin/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error dashboard:", response.status, errorText);
    throw new Error("Error al obtener dashboard");
  }

  return response.json();
}