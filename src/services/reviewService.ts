import API_URL from "./api";
import { getToken } from "./token";

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export interface Review {
  id_resena: number;
  solicitud_id_solicitud: number;
  usuario_rut?: string;
  calificacion: number;
  comentario: string;
  fecha_resena?: string;
  resena_activa: string;
  resena_reportada: string;
  motivo_reporte?: string | null;
  fecha_reporte?: string | null;
  reporte_resuelto?: string;
}

export async function getReviews(): Promise<Review[]> {
  const [activasResponse, reportadasResponse] = await Promise.all([
    fetch(`${API_URL}/resenas/`, {
      headers: getAuthHeaders(),
    }),
    fetch(`${API_URL}/resenas/reportadas`, {
      headers: getAuthHeaders(),
    }),
  ]);

  if (!activasResponse.ok || !reportadasResponse.ok) {
    throw new Error("Error al obtener reseñas");
  }

  const activas: Review[] = await activasResponse.json();
  const reportadas: Review[] = await reportadasResponse.json();

  const todas = [...activas, ...reportadas];

  return todas.filter(
    (review, index, array) =>
      index === array.findIndex((item) => item.id_resena === review.id_resena)
  );
}

export async function createReview(data: {
  id_solicitud: number;
  calificacion: number;
  comentario: string;
}) {
  const response = await fetch(`${API_URL}/resenas/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al crear reseña");
  }

  return response.json();
}

export async function approveReview(idResena: number) {
  const response = await fetch(
    `${API_URL}/resenas/${idResena}/resolver-reporte`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        accion: "APROBAR",
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error aprobando reseña:", response.status, errorText);
    throw new Error("Error al aprobar reseña");
  }

  return response.json();
}

export async function hideReview(idResena: number) {
  const response = await fetch(
    `${API_URL}/resenas/${idResena}/resolver-reporte`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        accion: "OCULTAR",
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error ocultando reseña:", response.status, errorText);
    throw new Error("Error al ocultar reseña");
  }

  return response.json();
}