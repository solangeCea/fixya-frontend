import { useEffect, useState } from "react";
import {
  AlertCircle,
  ClipboardList,
  MapPin,
  PlusCircle,
  Send,
  Wrench,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import {
  createSolicitud,
  getSolicitudesCliente,
} from "../../services/solicitudService";

import type {
  Solicitud,
  SolicitudCreate,
} from "../../services/solicitudService";

const servicios = [
  { id: 1, nombre: "Electricidad" },
  { id: 2, nombre: "Gasfitería" },
  { id: 3, nombre: "Carpintería" },
  { id: 4, nombre: "Cerrajería" },
];

const comunas = [
  { id: 11, nombre: "Concepción" },
  { id: 12, nombre: "Talcahuano" },
  { id: 13, nombre: "San Pedro de la Paz" },
];

const initialForm = {
  servicio_id_servicio: 1,
  comuna_id_comuna: 11,
  titulo_solicitud: "",
  descripcion_problema: "",
  urgencia: "MEDIA",
  direccion: "",
  tipo_problema: "",
  foto_problema: "",
  ubicacion_problema_referencia: "",
};

function ClienteDashboard() {
  const { usuario } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);
  const [creandoSolicitud, setCreandoSolicitud] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function cargarSolicitudes() {
    if (!usuario?.rut) {
      setLoadingSolicitudes(false);
      return;
    }

    try {
      setLoadingSolicitudes(true);
      const data = await getSolicitudesCliente(usuario.rut);
      setSolicitudes(data);
    } catch {
      setError("No se pudieron cargar tus solicitudes.");
    } finally {
      setLoadingSolicitudes(false);
    }
  }

  useEffect(() => {
    cargarSolicitudes();
  }, [usuario?.rut]);

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "servicio_id_servicio" ||
        name === "comuna_id_comuna"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!usuario?.rut) {
      setError("No se pudo identificar al cliente autenticado.");
      return;
    }

    try {
      setCreandoSolicitud(true);
      setError("");
      setSuccess("");

      const payload: SolicitudCreate = {
        usuario_rut: usuario.rut,
        servicio_id_servicio: form.servicio_id_servicio,
        comuna_id_comuna: form.comuna_id_comuna,
        titulo_solicitud: form.titulo_solicitud,
        descripcion_problema: form.descripcion_problema,
        urgencia: form.urgencia,
        direccion: form.direccion,
        tipo_problema: form.tipo_problema,
        foto_problema: form.foto_problema || null,
        ubicacion_problema_referencia:
          form.ubicacion_problema_referencia,
      };

      await createSolicitud(payload);

      setSuccess("Solicitud creada correctamente.");
      setForm(initialForm);
      await cargarSolicitudes();
    } catch {
      setError("No se pudo crear la solicitud.");
    } finally {
      setCreandoSolicitud(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Panel del Cliente
          </h1>
          <p className="mt-2 text-gray-600">
            Crea solicitudes técnicas y revisa el estado de tus servicios.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <PlusCircle className="h-6 w-6 text-blue-700" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Solicitar Servicio
                </h2>
                <p className="text-sm text-gray-500">
                  Registra un problema para buscar ayuda técnica.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Título
                </label>
                <input
                  name="titulo_solicitud"
                  value={form.titulo_solicitud}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Corte eléctrico en cocina"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Servicio
                </label>
                <select
                  name="servicio_id_servicio"
                  value={form.servicio_id_servicio}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {servicios.map((servicio) => (
                    <option key={servicio.id} value={servicio.id}>
                      {servicio.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Tipo de problema
                </label>
                <input
                  name="tipo_problema"
                  value={form.tipo_problema}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Instalación, reparación, mantención"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Descripción
                </label>
                <textarea
                  name="descripcion_problema"
                  value={form.descripcion_problema}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe el problema con detalle"
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Urgencia
                  </label>
                  <select
                    name="urgencia"
                    value={form.urgencia}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Comuna
                  </label>
                  <select
                    name="comuna_id_comuna"
                    value={form.comuna_id_comuna}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {comunas.map((comuna) => (
                      <option key={comuna.id} value={comuna.id}>
                        {comuna.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Dirección
                </label>
                <input
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Av. Los Carrera 123"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Referencia de ubicación
                </label>
                <input
                  name="ubicacion_problema_referencia"
                  value={form.ubicacion_problema_referencia}
                  onChange={handleChange}
                  required
                  maxLength={30}
                  placeholder="Ej: Cocina, baño, patio"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  URL de foto opcional
                </label>
                <input
                  name="foto_problema"
                  value={form.foto_problema}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={creandoSolicitud}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                <Send className="h-5 w-5" />
                {creandoSolicitud ? "Creando solicitud..." : "Crear solicitud"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <ClipboardList className="h-6 w-6 text-green-700" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Mis Solicitudes
                </h2>
                <p className="text-sm text-gray-500">
                  Historial de solicitudes creadas por tu cuenta.
                </p>
              </div>
            </div>

            {loadingSolicitudes ? (
              <div className="rounded-xl bg-gray-50 p-6 text-center text-gray-600">
                Cargando solicitudes...
              </div>
            ) : solicitudes.length === 0 ? (
              <div className="rounded-xl bg-gray-50 p-6 text-center text-gray-600">
                Aún no tienes solicitudes registradas.
              </div>
            ) : (
              <div className="space-y-4">
                {solicitudes.map((solicitud) => (
                  <div
                    key={solicitud.id_solicitud}
                    className="rounded-2xl border border-gray-200 p-5"
                  >
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {solicitud.titulo_solicitud}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {solicitud.descripcion_problema}
                        </p>
                      </div>

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {solicitud.estado_trabajo}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-gray-600 md:grid-cols-2">
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

                      <p>
                        <strong>Referencia:</strong>{" "}
                        {solicitud.ubicacion_problema_referencia}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default ClienteDashboard;