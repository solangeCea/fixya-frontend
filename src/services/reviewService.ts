import API_URL from "./api";

const token = localStorage.getItem("token");

export async function getReportedReviews() {
  const response = await fetch(
    `${API_URL}/resenas/reportadas`
  );

  if (!response.ok) {
    throw new Error("Error al obtener reseñas");
  }

  return response.json();
}

export async function createReview(data: {
  id_solicitud: number;
  calificacion: number;
  comentario: string;
}) {
  const response = await fetch(
    `${API_URL}/resenas/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem(
          "token"
        )}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Error al crear reseña");
  }

  return response.json();
}

export async function resolveReport(
  reviewId: number,
  body: object
) {
  const response = await fetch(
    `${API_URL}/resenas/${reviewId}/resolver-reporte`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem(
          "token"
        )}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error("Error al resolver reporte");
  }

  return response.json();
}