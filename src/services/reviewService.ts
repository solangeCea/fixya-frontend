import API_URL from "./api";
import { getToken } from "./token";

export interface Review {
  id_resena: number;
  solicitud_id_solicitud: number;
  usuario_rut: string;
  calificacion: number;
  comentario: string;
  fecha_resena: string;
  resena_activa: string;
  resena_reportada: string | null;
  motivo_reporte: string | null;
  fecha_reporte: string | null;
  reporte_resuelto: string | null;
  fecha_resolucion: string | null;
  usuario_rut_reporta: string | null;
  admin_rut_resuelve: string | null;
}

export interface CreateReviewData {
  id_solicitud: number;
  calificacion: number;
  comentario: string;
}

export interface ResolveReviewReportData {
  motivo_reporte?: string;
  aprobar_publicacion: boolean;
}

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
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

export async function getTechnicianReviews(
  rutTecnico: string
): Promise<Review[]> {
  const response = await fetch(`${API_URL}/resenas/tecnico/${rutTecnico}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error al obtener reseñas del técnico");
  }

  return response.json();
}

export async function createReview(
  data: CreateReviewData
): Promise<Review> {
  const response = await fetch(`${API_URL}/resenas/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.detail || "Error al crear reseña");
  }

  return response.json();
}

export async function resolveReport(
  reviewId: number,
  body: ResolveReviewReportData
): Promise<Review> {
  const response = await fetch(
    `${API_URL}/resenas/${reviewId}/resolver-reporte`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.detail || "Error al resolver reporte");
  }

  return response.json();
}