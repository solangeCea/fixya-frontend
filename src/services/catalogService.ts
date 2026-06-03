import API_URL from "./api";
import { fixDisplayText } from "../utils/text";

export interface Comuna {
  id_comuna: number;
  nombre_comuna: string;
  region_id_region: number;
}

export interface Region {
  id_region: number;
  nombre_region: string;
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

  const data: Comuna[] = await response.json();

  return data.map((comuna) => ({
    ...comuna,
    nombre_comuna: fixDisplayText(comuna.nombre_comuna),
  }));
}

export async function getRegiones(): Promise<Region[]> {
  const response = await fetch(`${API_URL}/regiones/`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Error al obtener regiones");
  }

  const data: Region[] = await response.json();

  return data.map((region) => ({
    ...region,
    nombre_region: fixDisplayText(region.nombre_region),
  }));
}

export async function getComunasByRegion(idRegion: number): Promise<Comuna[]> {
  const response = await fetch(`${API_URL}/comunas/region/${idRegion}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Error al obtener comunas de la region");
  }

  const data: Comuna[] = await response.json();

  return data.map((comuna) => ({
    ...comuna,
    nombre_comuna: fixDisplayText(comuna.nombre_comuna),
  }));
}

export async function getServicios(): Promise<Servicio[]> {
  const response = await fetch(`${API_URL}/servicios/`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Error al obtener servicios");
  }

  const data: Servicio[] = await response.json();

  return data.map((servicio) => ({
    ...servicio,
    nombre_servicio: fixDisplayText(servicio.nombre_servicio),
    descripcion_servicio: fixDisplayText(servicio.descripcion_servicio),
  }));
}
