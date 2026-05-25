import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, EyeOff, RefreshCw, Star } from "lucide-react";

import {
  approveReview,
  getReviews,
  hideReview,
} from "../../services/reviewService";
import type { Review } from "../../services/reviewService";

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function cargarResenas() {
    try {
      setLoading(true);
      setError("");

      const data = await getReviews();
      setReviews(data);
    } catch (error) {
      console.error("Error cargando reseñas:", error);
      setError("No se pudieron cargar las reseñas reales.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarResenas();
  }, []);

  async function handleApprove(idResena: number) {
    try {
      setActionLoading(idResena);
      setError("");
      setSuccess("");

      await approveReview(idResena);

      setSuccess("Reseña aprobada correctamente.");
      await cargarResenas();
    } catch {
      setError("No se pudo aprobar la reseña.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleHide(idResena: number) {
    try {
      setActionLoading(idResena);
      setError("");
      setSuccess("");

      await hideReview(idResena);

      setSuccess("Reseña ocultada correctamente.");
      await cargarResenas();
    } catch {
      setError("No se pudo ocultar la reseña.");
    } finally {
      setActionLoading(null);
    }
  }

  const totalResenas = reviews.length;
  const resenasActivas = reviews.filter((r) => r.resena_activa === "S").length;
  const resenasReportadas = reviews.filter((r) => r.resena_reportada === "S").length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <RefreshCw className="mx-auto mb-3 animate-spin text-blue-600" />
          <p className="font-medium text-gray-700">Cargando reseñas reales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-900">Gestión de Reseñas</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Total Reseñas</p>
          <p className="text-3xl font-bold text-gray-900">{totalResenas}</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Reseñas Activas</p>
          <p className="text-3xl font-bold text-green-600">{resenasActivas}</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Reportadas</p>
          <p className="text-3xl font-bold text-red-600">{resenasReportadas}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
          {success}
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900">Reseñas del Sistema</h2>
        </div>

        {reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay reseñas registradas.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <div
                key={review.id_resena}
                className={`p-6 ${
                  review.resena_reportada === "S" ? "bg-red-50" : ""
                }`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-bold text-gray-900">
                        Reseña #{review.id_resena}
                      </h3>

                      {review.resena_reportada === "S" && (
                        <span className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                          <AlertTriangle size={14} />
                          Reportada
                        </span>
                      )}

                      {review.resena_activa === "S" && (
                        <span className="rounded-lg bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Activa
                        </span>
                      )}

                      {review.resena_activa === "N" && (
                        <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          Inactiva
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600">
                      Solicitud: {review.solicitud_id_solicitud}
                    </p>

                    {review.motivo_reporte && (
                      <p className="mt-1 text-sm text-red-600">
                        Motivo: {review.motivo_reporte}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={17}
                        className={
                          i < Number(review.calificacion)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>

                <p className="mb-5 text-gray-700">{review.comentario}</p>

                {review.resena_reportada === "S" && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleApprove(review.id_resena)}
                      disabled={actionLoading === review.id_resena}
                      className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:bg-green-300"
                    >
                      <CheckCircle size={16} />
                      {actionLoading === review.id_resena
                        ? "Procesando..."
                        : "Aprobar reseña"}
                    </button>

                    <button
                      onClick={() => handleHide(review.id_resena)}
                      disabled={actionLoading === review.id_resena}
                      className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-red-300"
                    >
                      <EyeOff size={16} />
                      {actionLoading === review.id_resena
                        ? "Procesando..."
                        : "Ocultar reseña"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}