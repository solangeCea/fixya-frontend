import API_URL from "./api";

export async function getTechnicians() {
  const response = await fetch(`${API_URL}/tecnicos/`);

  if (!response.ok) {
    throw new Error("Error al obtener técnicos");
  }

  return response.json();
}

export async function getTechnicianProfile(rut: string) {
  const response = await fetch(
    `${API_URL}/tecnicos/${rut}/perfil`
  );

  if (!response.ok) {
    throw new Error("Error al obtener perfil");
  }

  return response.json();
}

export async function getTopTechnicians() {
  const response = await fetch(
    `${API_URL}/tecnicos/top-rating`
  );

  if (!response.ok) {
    throw new Error("Error al obtener ranking");
  }

  return response.json();
}

export async function searchTechnicians(
  servicioId: number,
  comunaId: number
) {
  const response = await fetch(
    `${API_URL}/tecnicos/buscar?servicio_id=${servicioId}&comuna_id=${comunaId}`
  );

  if (!response.ok) {
    throw new Error("Error al buscar técnicos");
  }

  return response.json();
}