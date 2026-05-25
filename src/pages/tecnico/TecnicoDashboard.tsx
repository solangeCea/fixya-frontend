import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Briefcase,
  CheckCircle,
  ClipboardList,
  MapPin,
  PlayCircle,
  RefreshCw,
  Wrench,
  Clock,
  DollarSign,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import {
  finalizarSolicitud,
  getSolicitudes,
  getSolicitudesTecnico,
  iniciarSolicitud,
} from "../../services/solicitudService";

import type { Solicitud } from "../../services/solicitudService";

function getEstadoStyle(estado: string) {
  if (estado === "INICIADO") return "bg-blue-100 text-blue-700";
  if (estado === "ASIGNADO") return "bg-yellow-100 text-yellow-700";
  if (estado === "EN_PROCESO") return "bg-purple-100 text-purple-700";
  if (estado === "FINALIZADO") return "bg-green-100 text-green-700";
  if (estado === "CANCELADO") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
}

function TecnicoDashboard() {
  const { usuario } = useAuth();

  const [solicitudesDisponibles, setSolicitudesDisponibles] = useState<Solicitud[]>([]);
  const [misSolicitudes, setMisSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [accionLoading, setAccionLoading] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [costosFinales, setCostosFinales] = useState<Record<number, string>>({});

  async function cargarDatos() {
    if (!usuario?.rut) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [todas, asignadas] = await Promise.all([
        getSolicitudes(),
        getSolicitudesTecnico(usuario.rut),
      ]);

      setSolicitudesDisponibles(
        todas.filter(
          (solicitud) =>
            solicitud.estado_trabajo === "INICIADO" &&
            solicitud.tecnico_usuario_rut === null
        )
      );

      setMisSolicitudes(asignadas);
    } catch {
      setError("No se pudieron cargar las solicitudes del técnico.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, [usuario?.rut]);

  const trabajosAsignados = useMemo(
    () => misSolicitudes.filter((s) => s.estado_trabajo === "ASIGNADO"),
    [misSolicitudes]
  );

  const trabajosEnProceso = useMemo(
    () => misSolicitudes.filter((s) => s.estado_trabajo === "EN_PROCESO"),
    [misSolicitudes]
  );

  const trabajosFinalizados = useMemo(
    () => misSolicitudes.filter((s) => s.estado_trabajo === "FINALIZADO"),
    [misSolicitudes]
  );

  async function handleIniciar(idSolicitud: number) {
    try {
      setAccionLoading(idSolicitud);
      setError("");
      setSuccess("");

      await iniciarSolicitud(idSolicitud);

      setSuccess("Solicitud iniciada correctamente.");
      await cargarDatos();
    } catch {
      setError("No se pudo iniciar la solicitud.");
    } finally {
      setAccionLoading(null);
    }
  }

  async function handleFinalizar(idSolicitud: number) {
    const costo = Number(costosFinales[idSolicitud]);

    if (!costo || costo <= 0) {
      setError("Debes ingresar un costo final válido.");
      return;
    }

    try {
      setAccionLoading(idSolicitud);
      setError("");
      setSuccess("");

      await finalizarSolicitud(idSolicitud, costo);

      setSuccess("Solicitud finalizada correctamente.");
      setCostosFinales((prev) => ({
        ...prev,
        [idSolicitud]: "",
      }));

      await cargarDatos();
    } catch {
      setError("No se pudo finalizar la solicitud.");
    } finally {
      setAccionLoading(null);
    }
  }

  function SolicitudCard({ solicitud }: { solicitud: Solicitud }) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-lg font-bold text-gray-900">
              {solicitud.titulo_solicitud}
            </h4>
            <p className="mt-1 text-sm text-gray-600">
              {solicitud.descripcion_problema}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getEstadoStyle(
              solicitud.estado_trabajo
            )}`}
          >
            {solicitud.estado_trabajo}
          </span>
        </div>

        <div className="mt-4 grid gap-2 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            {solicitud.direccion}
          </p>

          <p>
            <strong>Urgencia:</strong> {solicitud.urgencia}
          </p>

          <p>
            <strong>Referencia:</strong>{" "}
            {solicitud.ubicacion_problema_referencia || "Sin referencia"}
          </p>

          {solicitud.costo_final && (
            <p className="flex items-center gap-2 font-semibold text-green-700">
              <DollarSign className="h-4 w-4" />
              Costo final: ${solicitud.costo_final}
            </p>
          )}
        </div>

        {solicitud.estado_trabajo === "ASIGNADO" && (
          <button
            onClick={() => handleIniciar(solicitud.id_solicitud)}
            disabled={accionLoading === solicitud.id_solicitud}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
          >
            <PlayCircle className="h-5 w-5" />
            {accionLoading === solicitud.id_solicitud
              ? "Iniciando..."
              : "Iniciar trabajo"}
          </button>
        )}

        {solicitud.estado_trabajo === "EN_PROCESO" && (
          <div className="mt-4 space-y-3">
            <input
              type="number"
              min="1"
              value={costosFinales[solicitud.id_solicitud] || ""}
              onChange={(event) =>
                setCostosFinales((prev) => ({
                  ...prev,
                  [solicitud.id_solicitud]: event.target.value,
                }))
              }
              placeholder="Costo final"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <button
              onClick={() => handleFinalizar(solicitud.id_solicitud)}
              disabled={accionLoading === solicitud.id_solicitud}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:bg-green-300"
            >
              <CheckCircle className="h-5 w-5" />
              {accionLoading === solicitud.id_solicitud
                ? "Finalizando..."
                : "Finalizar trabajo"}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Panel del Técnico
            </h1>
            <p className="mt-2 text-gray-600">
              Administra tus trabajos asignados y revisa tu actividad operativa.
            </p>
          </div>

          <button
            onClick={cargarDatos}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <ClipboardList className="mb-3 h-7 w-7 text-blue-700" />
            <p className="text-sm text-gray-500">Disponibles</p>
            <p className="text-3xl font-bold text-gray-900">
              {solicitudesDisponibles.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <Briefcase className="mb-3 h-7 w-7 text-yellow-700" />
            <p className="text-sm text-gray-500">Asignadas</p>
            <p className="text-3xl font-bold text-gray-900">
              {trabajosAsignados.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <Clock className="mb-3 h-7 w-7 text-purple-700" />
            <p className="text-sm text-gray-500">En proceso</p>
            <p className="text-3xl font-bold text-gray-900">
              {trabajosEnProceso.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <CheckCircle className="mb-3 h-7 w-7 text-green-700" />
            <p className="text-sm text-gray-500">Finalizadas</p>
            <p className="text-3xl font-bold text-gray-900">
              {trabajosFinalizados.length}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            Cargando solicitudes...
          </div>
        ) : (
          <div className="space-y-8">
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Solicitudes disponibles
              </h3>

              {solicitudesDisponibles.length === 0 ? (
                <div className="rounded-xl bg-gray-50 p-6 text-center text-gray-600">
                  No hay solicitudes disponibles por ahora.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {solicitudesDisponibles.map((solicitud) => (
                    <div
                      key={solicitud.id_solicitud}
                      className="rounded-2xl border border-gray-200 p-5"
                    >
                      <h4 className="text-lg font-bold text-gray-900">
                        {solicitud.titulo_solicitud}
                      </h4>

                      <p className="mt-1 text-sm text-gray-600">
                        {solicitud.descripcion_problema}
                      </p>

                      <div className="mt-4 grid gap-2 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-gray-400" />
                          Servicio ID {solicitud.servicio_id_servicio}
                        </p>

                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {solicitud.direccion}
                        </p>

                        <p>
                          <strong>Urgencia:</strong> {solicitud.urgencia}
                        </p>
                      </div>

                      <div className="mt-4 rounded-xl bg-yellow-50 p-3 text-sm text-yellow-700">
                        Esta solicitud aún debe ser asignada por un administrador.
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Mis trabajos asignados
              </h3>

              {misSolicitudes.length === 0 ? (
                <div className="rounded-xl bg-gray-50 p-6 text-center text-gray-600">
                  Aún no tienes trabajos asignados.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {misSolicitudes.map((solicitud) => (
                    <SolicitudCard
                      key={solicitud.id_solicitud}
                      solicitud={solicitud}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default TecnicoDashboard;