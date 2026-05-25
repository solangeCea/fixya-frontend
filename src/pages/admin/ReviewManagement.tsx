import {
  AlertTriangle,
  CheckCircle,
  Eye,
  RefreshCw,
  Star,
  XCircle,
} from "lucide-react";

import { motion } from "framer-motion";

import { useEffect, useMemo, useState } from "react";

import {
  getReportedReviews,
  getReviews,
  resolveReport,
} from "../../services/reviewService";

import type {
  Review,
} from "../../services/reviewService";

function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [resolving, setResolving] =
    useState<number | null>(null);

  async function cargarResenas() {
    try {
      setLoading(true);

      setError("");

      const data = await getReviews();

      setReviews(data);
    } catch {
      setError(
        "No se pudieron cargar las reseñas."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarResenas();
  }, []);

  const flaggedReviews = useMemo(() => {
    return reviews.filter(
      (review) =>
        review.resena_reportada === "S" &&
        review.reporte_resuelto !== "S"
    );
  }, [reviews]);

  async function handleResolver(
    idResena: number,
    aprobar: boolean
  ) {
    try {
      setResolving(idResena);

      setError("");

      setSuccess("");

      await resolveReport(idResena, {
        aprobar_publicacion: aprobar,
      });

      setSuccess(
        aprobar
          ? "Reseña aprobada correctamente."
          : "Reseña ocultada correctamente."
      );

      await cargarResenas();
    } catch {
      setError(
        "No se pudo resolver el reporte."
      );
    } finally {
      setResolving(null);
    }
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Reseñas
          </h1>

          <p className="mt-2 text-gray-600">
            Supervisa comentarios y reportes de clientes.
          </p>
        </div>

        <button
          onClick={cargarResenas}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <RefreshCw size={16} />

          Actualizar
        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <p className="mb-1 text-sm text-gray-600">
            Total Reseñas
          </p>

          <p className="text-3xl font-bold text-gray-900">
            {reviews.length}
          </p>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <p className="mb-1 text-sm text-gray-600">
            Reseñas Activas
          </p>

          <p className="text-3xl font-bold text-green-600">
            {
              reviews.filter(
                (r) =>
                  r.resena_activa === "S"
              ).length
            }
          </p>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <p className="mb-1 text-sm text-gray-600">
            Reportadas
          </p>

          <p className="text-3xl font-bold text-red-600">
            {flaggedReviews.length}
          </p>

        </div>

      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
          {success}
        </div>
      )}

      {/* REVIEWS */}
      <div className="rounded-2xl bg-white shadow-sm">

        <div className="border-b border-gray-200 p-6">

          <h2 className="text-xl font-bold text-gray-900">
            Moderación de Reseñas
          </h2>

        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-600">
            Cargando reseñas...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            No existen reseñas registradas.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">

            {reviews.map(
              (review, index) => (
                <motion.div
                  key={review.id_resena}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.03,
                  }}
                  className={`p-6 ${
                    review.resena_reportada ===
                      "S" &&
                    review.reporte_resuelto !==
                      "S"
                      ? "bg-red-50"
                      : ""
                  }`}
                >

                  <div className="mb-3 flex items-start justify-between">

                    <div>

                      <div className="mb-2 flex items-center gap-3">

                        <h3 className="font-bold text-gray-900">
                          Cliente:
                          {" "}
                          {
                            review.usuario_rut
                          }
                        </h3>

                        {review.resena_reportada ===
                          "S" &&
                          review.reporte_resuelto !==
                            "S" && (
                            <span className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1 text-xs font-medium text-red-700">

                              <AlertTriangle
                                size={14}
                              />

                              Reportada

                            </span>
                          )}

                      </div>

                      <p className="text-sm text-gray-600">
                        Solicitud:
                        {" "}
                        #
                        {
                          review.solicitud_id_solicitud
                        }
                      </p>

                      <p className="text-sm text-gray-500">
                        {
                          new Date(
                            review.fecha_resena
                          ).toLocaleDateString()
                        }
                      </p>

                    </div>

                    <div className="flex gap-0.5">

                      {[...Array(5)].map(
                        (_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={
                              i <
                              Number(
                                review.calificacion
                              )
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-300"
                            }
                          />
                        )
                      )}

                    </div>

                  </div>

                  <p className="mb-4 text-gray-700">
                    {review.comentario}
                  </p>

                  {review.motivo_reporte && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-100 p-3 text-sm text-red-700">

                      <strong>
                        Motivo reporte:
                      </strong>

                      {" "}
                      {
                        review.motivo_reporte
                      }

                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">

                    {review.resena_reportada ===
                      "S" &&
                      review.reporte_resuelto !==
                        "S" && (
                        <>
                          <button
                            onClick={() =>
                              handleResolver(
                                review.id_resena,
                                true
                              )
                            }
                            disabled={
                              resolving ===
                              review.id_resena
                            }
                            className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:bg-green-300"
                          >

                            <CheckCircle
                              size={16}
                            />

                            Aprobar

                          </button>

                          <button
                            onClick={() =>
                              handleResolver(
                                review.id_resena,
                                false
                              )
                            }
                            disabled={
                              resolving ===
                              review.id_resena
                            }
                            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-red-300"
                          >

                            <XCircle
                              size={16}
                            />

                            Ocultar

                          </button>
                        </>
                      )}

                    <button className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200">

                      <Eye size={16} />

                      Ver detalle

                    </button>

                  </div>

                </motion.div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default ReviewManagement;