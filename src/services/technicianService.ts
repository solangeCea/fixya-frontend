import API_URL from "./api";
import { getToken } from "./token";

export interface Tecnico {
  usuario_rut: string;
  descripcion_perfil: string;
  experiencia_anios: number;
  nivel_tecnico: string;
  tecnico_verificado: boolean;
}

export async function getTechnicians(): Promise<Tecnico[]> {
  const token = getToken();

  const response = await fetch(`${API_URL}/tecnicos/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener técnicos");
  }

  return response.json();
}

export async function getTechnicianProfile(rut: string) {
  const token = getToken();

  const response = await fetch(`${API_URL}/tecnicos/${rut}/perfil`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener perfil");
  }

  return response.json();
}

export async function getTopTechnicians() {
  const token = getToken();

  const response = await fetch(`${API_URL}/tecnicos/top-rating`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener ranking");
  }

  return response.json();
}

export async function searchTechnicians(
  servicioId: number,
  comunaId: number
) {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/tecnicos/buscar?servicio_id=${servicioId}&comuna_id=${comunaId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al buscar técnicos");
  }

  return response.json();
}