import API_URL from "./api";
import { getToken } from "./token";

export interface UsuarioAdmin {
  rut: string;
  nombre_completo: string;
  correo: string;
  telefono: string | null;
  tipo_usuario: "CLIENTE" | "TECNICO" | "ADMIN";
  comuna_id_comuna: number;
  estado_usuario: boolean;
}

export async function getUsers(): Promise<UsuarioAdmin[]> {
  const token = getToken();

  const response = await fetch(`${API_URL}/usuarios/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener usuarios");
  }

  return response.json();
}

export async function createUser(data: unknown) {
  const token = getToken();

  const response = await fetch(`${API_URL}/usuarios/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al registrar usuario");
  }

  return response.json();
}