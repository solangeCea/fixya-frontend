import { useEffect, useState } from "react";
import {
  AlertCircle,
  ClipboardList,
  MapPin,
  PlusCircle,
  Send,
  Star,
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

import { createReview } from "../../services/reviewService";

const servicios = [
  { id: 1, nombre: "Electricidad" },
  { id: 2, nombre: "Gasfitería" },
  { id: 3, nombre: "Carpintería" },
  { id: 4, nombre: "Cerrajería" },
];

const comunas = [
  { id: 1, nombre: "Iquique" },
  { id: 2, nombre: "Antofagasta" },
  { id: 3, nombre: "Calama" },
  { id: 4, nombre: "Copiapó" },
  { id: 5, nombre: "La Serena" },
  { id: 6, nombre: "Coquimbo" },
  { id: 7, nombre: "Valparaíso" },
  { id: 8, nombre: "Viña del Mar" },
  { id: 9, nombre: "Quilpué" },
  { id: 10, nombre: "Santiago" },
  { id: 11, nombre: "Providencia" },
  { id: 12, nombre: "Maipú" },
  { id: 13, nombre: "Puente Alto" },
  { id: 14, nombre: "Las Condes" },
  { id: 15, nombre: "Rancagua" },
  { id: 16, nombre: "Talca" },
  { id: 17, nombre: "Curicó" },
  { id: 18, nombre: "Chillán" },
  { id: 19, nombre: "Concepción" },
  { id: 20, nombre: "Talcahuano" },
  { id: 21, nombre: "San Pedro de la Paz" },
  { id: 22, nombre: "Los Ángeles" },
  { id: 23, nombre: "Temuco" },
  { id: 24, nombre: "Valdivia" },
  { id: 25, nombre: "Puerto Montt" },
];

const initialForm = {
  servicio_id_servicio: 1,
  comuna_id_comuna: 19,
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

  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [sendingReview, setSendingReview] = useState(false);

  async function cargarSolicitudes() {
    if (!usuario?.rut) {
      setLoadingSolicitudes(false);
      return;
    }

    try {
      setLoadingSolicitudes(true);
      setError("");

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
        name === "servicio_id_servicio" || name === "comuna_id_comuna"
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

  async function handleCreateReview(idSolicitud: number) {
    if (!reviewComment.trim()) {
      setError("Debes escribir un comentario para la reseña.");
      return;
    }

    try {
      setSendingReview(true);
      setError("");
      setSuccess("");

      await createReview({
        id_solicitud: idSolicitud,
        calificacion: reviewRating,
        comentario: reviewComment,
      });

      setSuccess("Reseña creada correctamente.");
      setReviewComment("");
      setReviewRating(5);
      setReviewingId(null);

      await cargarSolicitudes();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo crear la reseña."
      );
    } finally {
      setSendingReview(false);
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
              <select
                name="servicio_id_servicio"
                value={form.servicio_id_servicio}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              >
                {servicios.map((servicio) => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre}
                  </option>
                ))}
              </select>

              <select
                name="comuna_id_comuna"
                value={form.comuna_id_comuna}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              >
                {comunas.map((comuna) => (
                  <option key={comuna.id} value={comuna.id}>
                    {comuna.nombre}
                  </option>
                ))}
              </select>

              <input
                name="titulo_solicitud"
                value={form.titulo_solicitud}
                onChange={handleChange}
                placeholder="Título de la solicitud"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />

              <textarea
                name="descripcion_problema"
                value={form.descripcion_problema}
                onChange={handleChange}
                placeholder="Describe el problema"
                required
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3"
              />

              <select
                name="urgencia"
                value={form.urgencia}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              >
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
              </select>

              <input
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Dirección"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />

              <input
                name="tipo_problema"
                value={form.tipo_problema}
                onChange={handleChange}
                placeholder="Tipo de problema"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />

              <input
                name="foto_problema"
                value={form.foto_problema}
                onChange={handleChange}
                placeholder="URL de imagen opcional"
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />

              <input
                name="ubicacion_problema_referencia"
                value={form.ubicacion_problema_referencia}
                onChange={handleChange}
                placeholder="Referencia de ubicación"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />

              <button
                type="submit"
                disabled={creandoSolicitud}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
              >
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

                    {solicitud.estado_trabajo === "FINALIZADO" && (
                      <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
                        <div className="mb-4 flex items-center justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-gray-900">
                              Califica el servicio
                            </h4>

                            <p className="text-sm text-gray-600">
                              Comparte tu experiencia con el técnico.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setReviewingId(
                                reviewingId === solicitud.id_solicitud
                                  ? null
                                  : solicitud.id_solicitud
                              )
                            }
                            className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600"
                          >
                            {reviewingId === solicitud.id_solicitud
                              ? "Cerrar"
                              : "⭐ Dejar reseña"}
                          </button>
                        </div>

                        {reviewingId === solicitud.id_solicitud && (
                          <div className="space-y-4">
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => setReviewRating(value)}
                                >
                                  <Star
                                    className={`h-7 w-7 ${
                                      value <= reviewRating
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-gray-300"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>

                            <textarea
                              value={reviewComment}
                              onChange={(event) =>
                                setReviewComment(event.target.value)
                              }
                              rows={4}
                              placeholder="Describe cómo fue el servicio recibido"
                              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                handleCreateReview(solicitud.id_solicitud)
                              }
                              disabled={sendingReview}
                              className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:bg-green-300"
                            >
                              <Send className="h-4 w-4" />

                              {sendingReview
                                ? "Enviando reseña..."
                                : "Publicar reseña"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
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