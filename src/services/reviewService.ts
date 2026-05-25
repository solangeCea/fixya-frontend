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
  calificacion: number;
  comentario: string;
  resena_activa: string;
  resena_reportada: string;
  motivo_reporte?: string | null;
  fecha_creacion?: string;
}

export async function getReviews(): Promise<Review[]> {
  const response = await fetch(`${API_URL}/resenas/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error al obtener reseñas");
  }

  return response.json();
}

export async function getReportedReviews(): Promise<Review[]> {
  const response = await fetch(`${API_URL}/resenas/reportadas`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error al obtener reseñas reportadas");
  }

  return response.json();
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

export async function resolveReport(reviewId: number, body: object) {
  const response = await fetch(
    `${API_URL}/resenas/${reviewId}/resolver-reporte`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error("Error al resolver reporte");
  }

  return response.json();
}