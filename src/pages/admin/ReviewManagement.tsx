import { useEffect, useState } from "react";
import { Star, AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

import { getReviews } from "../../services/reviewService";
import type { Review } from "../../services/reviewService";

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const totalResenas = reviews.length;

  const resenasActivas = reviews.filter(
    (review) => review.resena_activa === "S"
  ).length;

  const resenasReportadas = reviews.filter(
    (review) => review.resena_reportada === "S"
  ).length;

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

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-semibold">{error}</p>

          <button
            onClick={cargarResenas}
            className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Gestión de Reseñas
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="mb-1 text-sm text-gray-600">Total Reseñas</p>
          <p className="text-3xl font-bold text-gray-900">{totalResenas}</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="mb-1 text-sm text-gray-600">Reseñas Activas</p>
          <p className="text-3xl font-bold text-green-600">{resenasActivas}</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="mb-1 text-sm text-gray-600">Reportadas</p>
          <p className="text-3xl font-bold text-red-600">{resenasReportadas}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900">
            Reseñas del Sistema
          </h2>
        </div>

        {reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay reseñas registradas.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id_resena}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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
                    </div>

                    <p className="text-sm text-gray-600">
                      Solicitud: {review.solicitud_id_solicitud}
                    </p>

                    <p className="text-sm text-gray-500">
                      Estado:{" "}
                      {review.resena_activa === "S" ? "Activa" : "Inactiva"}
                    </p>
                  </div>

                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < review.calificacion
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>

                <p className="mb-4 text-gray-700">{review.comentario}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}