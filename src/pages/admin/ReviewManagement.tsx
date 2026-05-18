import {
  Star,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import { motion } from "framer-motion";

interface Review {
  id: number;
  author: string;
  technician: string;
  rating: number;
  comment: string;
  date: string;
  jobType: string;
  flaggedReason: string | null;
}

const reviews: Review[] = [
  {
    id: 1,
    author: "María González",
    technician: "Carlos Mendoza",
    rating: 5,
    comment:
      "Excelente profesional, muy puntual y dejó todo impecable.",

    date: "10 Abr 2026",

    jobType: "Reparación de fuga",

    flaggedReason: null,
  },

  {
    id: 2,
    author: "Cliente Anónimo",
    technician: "Roberto Silva",
    rating: 1,
    comment:
      "Pésimo servicio, el tipo no sabe nada y encima me cobró caro.",

    date: "9 Abr 2026",

    jobType: "Instalación eléctrica",

    flaggedReason:
      "Lenguaje inapropiado",
  },
];

export default function ReviewManagement() {
  const flaggedReviews = reviews.filter(
    (r) => r.flaggedReason
  );

  return (
    <div className="space-y-6">

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-sm text-gray-600 mb-1">
            Total Reseñas
          </p>

          <p className="text-3xl font-bold text-gray-900">
            {reviews.length}
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-sm text-gray-600 mb-1">
            Reseñas Activas
          </p>

          <p className="text-3xl font-bold text-green-600">
            {
              reviews.filter(
                (r) => !r.flaggedReason
              ).length
            }
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-sm text-gray-600 mb-1">
            Reportadas
          </p>

          <p className="text-3xl font-bold text-red-600">
            {flaggedReviews.length}
          </p>

        </div>

      </div>

      {/* REVIEWS */}
      <div className="bg-white rounded-2xl shadow-sm">

        <div className="p-6 border-b border-gray-200">

          <h2 className="text-xl font-bold text-gray-900">
            Gestión de Reseñas
          </h2>

        </div>

        <div className="divide-y divide-gray-200">

          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.05,
              }}
              className={`p-6 ${
                review.flaggedReason
                  ? "bg-red-50"
                  : ""
              }`}
            >

              <div className="flex items-start justify-between mb-3">

                <div>

                  <div className="flex items-center gap-3 mb-2">

                    <h3 className="font-bold text-gray-900">
                      {review.author}
                    </h3>

                    {review.flaggedReason && (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1">

                        <AlertTriangle
                          size={14}
                        />

                        {
                          review.flaggedReason
                        }

                      </span>
                    )}

                  </div>

                  <p className="text-sm text-gray-600">

                    Técnico:{" "}

                    <span className="font-medium">
                      {review.technician}
                    </span>

                  </p>

                  <p className="text-sm text-gray-500">

                    {review.jobType} •{" "}
                    {review.date}

                  </p>

                </div>

                <div className="flex gap-0.5">

                  {[...Array(5)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i <
                          review.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    )
                  )}

                </div>

              </div>

              <p className="text-gray-700 mb-4">
                {review.comment}
              </p>

              <button className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1">

                <Trash2 size={16} />

                Eliminar

              </button>

            </motion.div>
          ))}

        </div>

      </div>

    </div>
  );
}