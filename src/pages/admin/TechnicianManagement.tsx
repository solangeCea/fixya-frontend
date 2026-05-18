import { useState } from "react";

import {
  CheckCircle,
  X,
  FileText,
  Filter,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

interface Technician {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  location: string;
  status: "pending" | "approved";
  registrationDate: string;
  experience: number;

  documents: {
    cedula: string;
    certificacion: string;
    antecedentes: string;
  };
}

const technicians: Technician[] = [
  {
    id: 1,
    name: "Luis Fernández",
    specialty: "Electricidad",
    email: "luis.fernandez@email.com",
    phone: "+56 9 8765 4321",
    location: "Vitacura",
    status: "pending",
    registrationDate: "12 Abr 2026",
    experience: 8,

    documents: {
      cedula:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",

      certificacion:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop",

      antecedentes:
        "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=600&fit=crop",
    },
  },

  {
    id: 2,
    name: "Javier Muñoz",
    specialty: "Pintura",
    email: "javier.munoz@email.com",
    phone: "+56 9 7654 3210",
    location: "La Reina",
    status: "pending",
    registrationDate: "11 Abr 2026",
    experience: 5,

    documents: {
      cedula:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",

      certificacion:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop",

      antecedentes:
        "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=600&fit=crop",
    },
  },

  {
    id: 3,
    name: "Carlos Mendoza",
    specialty: "Gasfitería",
    email: "carlos.mendoza@email.com",
    phone: "+56 9 6543 2109",
    location: "Santiago Centro",
    status: "approved",
    registrationDate: "5 Abr 2026",
    experience: 10,

    documents: {
      cedula:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",

      certificacion:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop",

      antecedentes:
        "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=600&fit=crop",
    },
  },

  {
    id: 4,
    name: "Roberto Silva",
    specialty: "Electricidad",
    email: "roberto.silva@email.com",
    phone: "+56 9 5432 1098",
    location: "Providencia",
    status: "approved",
    registrationDate: "1 Abr 2026",
    experience: 12,

    documents: {
      cedula:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",

      certificacion:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop",

      antecedentes:
        "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=600&fit=crop",
    },
  },
];

export default function TechnicianManagement() {
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved"
  >("all");

  const [selectedTechnician, setSelectedTechnician] =
    useState<Technician | null>(null);

  const [showDocumentsModal, setShowDocumentsModal] =
    useState(false);

  const filteredTechnicians = technicians.filter(
    (tech) => {
      if (filter === "all") return true;

      return tech.status === filter;
    }
  );

  const handleViewDocuments = (tech: Technician) => {
    setSelectedTechnician(tech);
    setShowDocumentsModal(true);
  };

  return (
    <div className="space-y-6">

      {/* FILTERS */}
      <div className="bg-white rounded-2xl shadow-sm p-6">

        <div className="flex items-center gap-2 mb-4">

          <Filter
            size={20}
            className="text-gray-700"
          />

          <h2 className="font-semibold text-gray-900">
            Filtros
          </h2>

        </div>

        <div className="flex gap-3 flex-wrap">

          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todos ({technicians.length})
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pendientes (
            {
              technicians.filter(
                (t) => t.status === "pending"
              ).length
            }
            )
          </button>

          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "approved"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Aprobados (
            {
              technicians.filter(
                (t) => t.status === "approved"
              ).length
            }
            )
          </button>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50 border-b border-gray-200">

              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Técnico
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Especialidad
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Contacto
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Experiencia
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Estado
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-200">

              {filteredTechnicians.map(
                (tech, index) => (
                  <motion.tr
                    key={tech.id}
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
                    className="hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">

                      <div>

                        <p className="font-semibold text-gray-900">
                          {tech.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {tech.location}
                        </p>

                      </div>

                    </td>

                    <td className="px-6 py-4">
                      <span className="text-gray-900">
                        {tech.specialty}
                      </span>
                    </td>

                    <td className="px-6 py-4">

                      <div className="text-sm">

                        <p className="text-gray-900">
                          {tech.email}
                        </p>

                        <p className="text-gray-500">
                          {tech.phone}
                        </p>

                      </div>

                    </td>

                    <td className="px-6 py-4">

                      <span className="text-gray-900">
                        {tech.experience} años
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      {tech.status === "pending" ? (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-sm font-medium">
                          Pendiente
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">
                          Aprobado
                        </span>
                      )}

                    </td>

                    <td className="px-6 py-4">

                      <div className="flex gap-2">

                        {tech.status ===
                          "pending" && (
                          <>
                            <button className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">

                              <CheckCircle
                                size={18}
                              />

                            </button>

                            <button className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">

                              <X size={18} />

                            </button>
                          </>
                        )}

                        <button
                          onClick={() =>
                            handleViewDocuments(
                              tech
                            )
                          }
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1"
                        >

                          <FileText size={16} />

                          Ver Docs

                        </button>

                      </div>

                    </td>

                  </motion.tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}
      <AnimatePresence>

        {showDocumentsModal &&
          selectedTechnician && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() =>
                setShowDocumentsModal(false)
              }
            >

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                }}
                onClick={(e) =>
                  e.stopPropagation()
                }
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >

                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">

                  <div>

                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedTechnician.name}
                    </h2>

                    <p className="text-gray-600">
                      {
                        selectedTechnician.specialty
                      }{" "}
                      -{" "}
                      {
                        selectedTechnician.location
                      }
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setShowDocumentsModal(
                        false
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >

                    <X size={24} />

                  </button>

                </div>

                <div className="p-6 space-y-6">

                  <div>

                    <h3 className="font-bold text-gray-900 mb-3">
                      Información del Técnico
                    </h3>

                    <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">

                      <div>

                        <p className="text-sm text-gray-600">
                          Email
                        </p>

                        <p className="font-medium text-gray-900">
                          {
                            selectedTechnician.email
                          }
                        </p>

                      </div>

                      <div>

                        <p className="text-sm text-gray-600">
                          Teléfono
                        </p>

                        <p className="font-medium text-gray-900">
                          {
                            selectedTechnician.phone
                          }
                        </p>

                      </div>

                      <div>

                        <p className="text-sm text-gray-600">
                          Ubicación
                        </p>

                        <p className="font-medium text-gray-900">
                          {
                            selectedTechnician.location
                          }
                        </p>

                      </div>

                      <div>

                        <p className="text-sm text-gray-600">
                          Experiencia
                        </p>

                        <p className="font-medium text-gray-900">
                          {
                            selectedTechnician.experience
                          }{" "}
                          años
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </motion.div>

            </div>
          )}

      </AnimatePresence>

    </div>
  );
}