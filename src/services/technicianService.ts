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

export async function createTechnicianProfile(data: {
  usuario_rut: string;
  descripcion_perfil: string;
  experiencia_anios: number;
  nivel_tecnico: string;
  servicios: number[];
  comunas: number[];
}): Promise<Tecnico> {
  const token = getToken();

  const response = await fetch(`${API_URL}/tecnicos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Error al crear perfil tecnico");
  }

  return response.json();
}

export async function approveTechnician(rut: string) {
  const token = getToken();

  const response = await fetch(`${API_URL}/admin/tecnicos/${rut}/verificar`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al aprobar tecnico");
  }

  return response.json();
}

export async function uploadTechnicianDocument(data: {
  tecnico_usuario_rut: string;
  tipo_documento: string;
  archivo: File;
}) {
  const token = getToken();
  const formData = new FormData();

  formData.append("tecnico_usuario_rut", data.tecnico_usuario_rut);
  formData.append("tipo_documento", data.tipo_documento);
  formData.append("archivo", data.archivo);

  const response = await fetch(`${API_URL}/documentos-tecnicos/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Error al subir documento");
  }

  return response.json();
}
