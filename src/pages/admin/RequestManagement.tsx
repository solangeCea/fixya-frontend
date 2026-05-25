import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ClipboardList,
  RefreshCw,
  UserCheck,
} from "lucide-react";

import {
  asignarTecnico,
  getSolicitudes,
} from "../../services/solicitudService";
import type { Solicitud } from "../../services/solicitudService";

import { getTechnicians } from "../../services/technicianService";
import type { Tecnico } from "../../services/technicianService";
import { getComunas, getServicios } from "../../services/catalogService";
import type { Comuna, Servicio } from "../../services/catalogService";

interface TecnicoOption extends Tecnico {
  nombre_completo?: string;
}

function getEstadoStyle(estado: string) {
  if (estado === "INICIADO") return "bg-blue-100 text-blue-700";
  if (estado === "ASIGNADO") return "bg-yellow-100 text-yellow-700";
  if (estado === "EN_PROCESO") return "bg-purple-100 text-purple-700";
  if (estado === "FINALIZADO") return "bg-green-100 text-green-700";
  if (estado === "CANCELADO") return "bg-red-100 text-red-700";

  return "bg-gray-100 text-gray-700";
}

function RequestManagement() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [tecnicos, setTecnicos] = useState<TecnicoOption[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [selectedTecnicos, setSelectedTecnicos] = useState<Record<number, string>>(
    {}
  );

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function cargarDatos() {
    try {
      setLoading(true);
      setError("");

      const [solicitudesData, tecnicosData, serviciosData, comunasData] =
        await Promise.all([
          getSolicitudes(),
          getTechnicians(),
          getServicios(),
          getComunas(),
        ]);

      setSolicitudes(solicitudesData);
      setTecnicos(tecnicosData);
      setServicios(serviciosData);
      setComunas(comunasData);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar las solicitudes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  const solicitudesActivas = useMemo(
    () => solicitudes.filter((s) => s.estado_trabajo !== "FINALIZADO"),
    [solicitudes]
  );

  const serviciosPorId = useMemo(() => {
    return new Map(
      servicios.map((servicio) => [
        servicio.id_servicio,
        servicio.nombre_servicio,
      ])
    );
  }, [servicios]);

  const comunasPorId = useMemo(() => {
    return new Map(
      comunas.map((comuna) => [comuna.id_comuna, comuna.nombre_comuna])
    );
  }, [comunas]);

  const tecnicosAsignables = useMemo(
    () => tecnicos.filter((tecnico) => tecnico.tecnico_verificado),
    [tecnicos]
  );

  async function handleAsignar(idSolicitud: number) {
    const rutTecnico = selectedTecnicos[idSolicitud];

    if (!rutTecnico) {
      setError("Debes seleccionar un técnico.");
      return;
    }

    try {
      setAssigning(idSolicitud);
      setError("");
      setSuccess("");

      await asignarTecnico(idSolicitud, rutTecnico);

      setSuccess("Técnico asignado correctamente.");
      await cargarDatos();
    } catch (error) {
      console.error(error);
      setError("No se pudo asignar el técnico.");
    } finally {
      setAssigning(null);
    }
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Solicitudes
        </h1>
        <p className="mt-2 text-gray-600">
          Administra solicitudes y asigna técnicos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total solicitudes</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {solicitudes.length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Solicitudes activas</p>
          <p className="mt-2 text-3xl font-bold text-blue-700">
            {solicitudesActivas.length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Técnicos disponibles</p>
          <p className="mt-2 text-3xl font-bold text-green-700">
            {tecnicosAsignables.length}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Solicitudes del sistema
        </h2>

        <button
          onClick={cargarDatos}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
          {success}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          Cargando solicitudes...
        </div>
      ) : (
        <div className="space-y-4">
          {solicitudes.map((solicitud) => (
            <div
              key={solicitud.id_solicitud}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                      <ClipboardList className="text-blue-700" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {solicitud.titulo_solicitud}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Cliente: {solicitud.usuario_rut}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600">
                    {solicitud.descripcion_problema}
                  </p>

                  <div className="grid gap-2 text-sm text-gray-600">
                    <p>
                      <strong>Dirección:</strong> {solicitud.direccion}
                    </p>
                    <p>
                      <strong>Urgencia:</strong> {solicitud.urgencia}
                    </p>
                    <p>
                      <strong>Servicio:</strong>{" "}
                      {serviciosPorId.get(solicitud.servicio_id_servicio) ||
                        `ID ${solicitud.servicio_id_servicio}`}
                    </p>
                    <p>
                      <strong>Comuna:</strong>{" "}
                      {comunasPorId.get(solicitud.comuna_id_comuna) ||
                        `ID ${solicitud.comuna_id_comuna}`}
                    </p>
                    <p>
                      <strong>Tecnico asignado:</strong>{" "}
                      {solicitud.tecnico_usuario_rut || "Sin asignar"}
                    </p>
                  </div>
                </div>

                <div className="w-full space-y-3 lg:w-80">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getEstadoStyle(
                      solicitud.estado_trabajo
                    )}`}
                  >
                    {solicitud.estado_trabajo}
                  </span>

                  {solicitud.estado_trabajo === "INICIADO" &&
                    !solicitud.tecnico_usuario_rut && (
                    <>
                      <select
                        value={selectedTecnicos[solicitud.id_solicitud] || ""}
                        onChange={(event) =>
                          setSelectedTecnicos((prev) => ({
                            ...prev,
                            [solicitud.id_solicitud]: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="">Seleccionar técnico</option>

                        {tecnicosAsignables.map((tecnico) => (
                          <option
                            key={tecnico.usuario_rut}
                            value={tecnico.usuario_rut}
                          >
                            {tecnico.usuario_rut}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleAsignar(solicitud.id_solicitud)}
                        disabled={
                          assigning === solicitud.id_solicitud ||
                          tecnicosAsignables.length === 0
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
                      >
                        <UserCheck size={18} />
                        {assigning === solicitud.id_solicitud
                          ? "Asignando..."
                          : "Asignar técnico"}
                      </button>
                    </>
                  )}

                  {solicitud.estado_trabajo === "INICIADO" &&
                    !solicitud.tecnico_usuario_rut &&
                    tecnicosAsignables.length === 0 && (
                      <p className="rounded-xl bg-yellow-50 p-3 text-sm text-yellow-700">
                        No hay tecnicos verificados disponibles.
                      </p>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RequestManagement;