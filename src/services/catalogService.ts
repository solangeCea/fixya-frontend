import API_URL from "./api";

export interface Comuna {
  id_comuna: number;
  nombre_comuna: string;
  region_id_region: number;
}

export interface Servicio {
  id_servicio: number;
  nombre_servicio: string;
  descripcion_servicio?: string | null;
  estado_servicio: boolean;
}

export async function getComunas(): Promise<Comuna[]> {
  const response = await fetch(`${API_URL}/comunas/`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Error al obtener comunas");
  }

  return response.json();
}

export async function getServicios(): Promise<Servicio[]> {
  const response = await fetch(`${API_URL}/servicios/`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Error al obtener servicios");
  }

  return response.json();
}
