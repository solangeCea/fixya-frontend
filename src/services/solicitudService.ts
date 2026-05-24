import API_URL from "./api";
import { getToken } from "./token";

export interface SolicitudCreate {
  usuario_rut: string;
  servicio_id_servicio: number;
  comuna_id_comuna: number;
  titulo_solicitud: string;
  descripcion_problema: string;
  urgencia: string;
  direccion: string;
  tipo_problema: string;
  foto_problema?: string | null;
  ubicacion_problema_referencia: string;
}

export interface Solicitud {
  id_solicitud: number;
  usuario_rut: string;
  servicio_id_servicio: number;
  tecnico_usuario_rut: string | null;
  comuna_id_comuna: number;
  titulo_solicitud: string;
  descripcion_problema: string;
  urgencia: string;
  direccion: string;
  fecha_creacion: string;
  solicitud_activa: boolean;
  estado_trabajo: string;
  tipo_problema: string;
  foto_problema: string | null;
  ubicacion_problema_referencia: string;
  costo_final: string | null;
  fecha_real: string | null;
}

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function createSolicitud(
  data: SolicitudCreate
): Promise<Solicitud> {
  const response = await fetch(`${API_URL}/solicitudes/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al crear la solicitud");
  }

  return response.json();
}

export async function getSolicitudesCliente(
  rut: string
): Promise<Solicitud[]> {
  const response = await fetch(`${API_URL}/solicitudes/cliente/${rut}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error al obtener solicitudes del cliente");
  }

  return response.json();
}