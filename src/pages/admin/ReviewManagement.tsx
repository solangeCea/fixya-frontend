import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle, EyeOff, RefreshCw, Star } from "lucide-react";

import {
  approveReview,
  getReviews,
  hideReview,
} from "../../services/reviewService";
import type { Review } from "../../services/reviewService";

type ReviewFilter = "all" | "active" | "pending" | "hidden";

function isResolved(review: Review) {
  return review.reporte_resuelto === "S";
}

function getResolutionLabel(review: Review) {
  if (!isResolved(review)) return null;
  return review.resena_activa === "S" ? "Aprobada" : "Ocultada";
}

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<ReviewFilter>("all");
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
      console.error("Error cargando resenas:", error);
      setError("No se pudieron cargar las resenas reales.");
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

      setSuccess("Resena aprobada correctamente.");
      await cargarResenas();
    } catch {
      setError("No se pudo aprobar la resena.");
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

      setSuccess("Resena ocultada correctamente.");
      await cargarResenas();
    } catch {
      setError("No se pudo ocultar la resena.");
    } finally {
      setActionLoading(null);
    }
  }

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      if (filter === "active") return review.resena_activa === "S";
      if (filter === "pending") {
        return review.resena_reportada === "S" && review.reporte_resuelto !== "S";
      }
      if (filter === "hidden") return review.resena_activa === "N";
      return true;
    });
  }, [reviews, filter]);

  const totalResenas = reviews.length;
  const resenasActivas = reviews.filter((r) => r.resena_activa === "S").length;
  const resenasPendientes = reviews.filter(
    (r) => r.resena_reportada === "S" && r.reporte_resuelto !== "S"
  ).length;
  const resenasOcultas = reviews.filter((r) => r.resena_activa === "N").length;

  const filters: { key: ReviewFilter; label: string; count: number }[] = [
    { key: "all", label: "Todas", count: totalResenas },
    { key: "active", label: "Activas", count: resenasActivas },
    { key: "pending", label: "Reportadas pendientes", count: resenasPendientes },
    { key: "hidden", label: "Ocultadas", count: resenasOcultas },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <RefreshCw className="mx-auto mb-3 animate-spin text-blue-600" />
          <p className="font-medium text-gray-700">Cargando resenas reales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion de Resenas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Modera reportes sin eliminar registros del sistema.
          </p>
        </div>

        <button
          onClick={cargarResenas}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {filters.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={`rounded-2xl p-5 text-left shadow-sm ${
              filter === item.key
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-900 hover:bg-gray-50"
            }`}
          >
            <p className="text-sm opacity-80">{item.label}</p>
            <p className="mt-2 text-3xl font-bold">{item.count}</p>
          </button>
        ))}
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
          <h2 className="text-xl font-bold text-gray-900">Resenas del Sistema</h2>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay resenas para este filtro.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredReviews.map((review) => {
              const pending = review.resena_reportada === "S" && !isResolved(review);
              const resolutionLabel = getResolutionLabel(review);

              return (
                <div
                  key={review.id_resena}
                  className={`p-6 ${pending ? "bg-red-50" : ""}`}
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h3 className="font-bold text-gray-900">
                          Resena #{review.id_resena}
                        </h3>

                        {pending && (
                          <span className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                            <AlertTriangle size={14} />
                            Reportada pendiente
                          </span>
                        )}

                        {resolutionLabel && (
                          <span
                            className={`rounded-lg px-3 py-1 text-xs font-medium ${
                              resolutionLabel === "Aprobada"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {resolutionLabel}
                          </span>
                        )}

                        {!pending && !resolutionLabel && review.resena_activa === "S" && (
                          <span className="rounded-lg bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            Activa
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

                  {pending && (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleApprove(review.id_resena)}
                        disabled={actionLoading === review.id_resena}
                        className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:bg-green-300"
                      >
                        <CheckCircle size={16} />
                        {actionLoading === review.id_resena
                          ? "Procesando..."
                          : "Aprobar resena"}
                      </button>

                      <button
                        onClick={() => handleHide(review.id_resena)}
                        disabled={actionLoading === review.id_resena}
                        className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-red-300"
                      >
                        <EyeOff size={16} />
                        {actionLoading === review.id_resena
                          ? "Procesando..."
                          : "Ocultar resena"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
