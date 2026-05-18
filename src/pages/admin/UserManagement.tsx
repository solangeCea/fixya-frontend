import { useState } from "react";

import {
  Search,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { motion } from "framer-motion";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  type: "cliente" | "tecnico";
  status: "active" | "inactive";
  registrationDate: string;
  completedJobs: number;
}

const users: User[] = [
  {
    id: 1,
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+56 9 1234 5678",
    location: "Santiago Centro",
    type: "cliente",
    status: "active",
    registrationDate: "15 Mar 2026",
    completedJobs: 5,
  },

  {
    id: 2,
    name: "Pedro Ramírez",
    email: "pedro.ramirez@email.com",
    phone: "+56 9 2345 6789",
    location: "Providencia",
    type: "cliente",
    status: "active",
    registrationDate: "20 Feb 2026",
    completedJobs: 12,
  },

  {
    id: 3,
    name: "Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    phone: "+56 9 3456 7890",
    location: "Santiago Centro",
    type: "tecnico",
    status: "active",
    registrationDate: "10 Ene 2026",
    completedJobs: 456,
  },

  {
    id: 4,
    name: "Ana Silva",
    email: "ana.silva@email.com",
    phone: "+56 9 4567 8901",
    location: "Las Condes",
    type: "cliente",
    status: "active",
    registrationDate: "5 Abr 2026",
    completedJobs: 3,
  },

  {
    id: 5,
    name: "Roberto Silva",
    email: "roberto.silva@email.com",
    phone: "+56 9 5678 9012",
    location: "Providencia",
    type: "tecnico",
    status: "active",
    registrationDate: "1 Feb 2026",
    completedJobs: 342,
  },
];

export default function UserManagement() {
  const [filter, setFilter] = useState<
    "all" | "cliente" | "tecnico"
  >("all");

  const [searchTerm, setSearchTerm] =
    useState("");

  const filteredUsers = users.filter(
    (user) => {
      const matchesFilter =
        filter === "all" ||
        user.type === filter;

      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        user.email
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      return (
        matchesFilter && matchesSearch
      );
    }
  );

  return (
    <div className="space-y-6">

      {/* SEARCH */}
      <div className="bg-white rounded-2xl shadow-sm p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="relative">

            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

          </div>

          <div className="flex gap-3 flex-wrap">

            <button
              onClick={() =>
                setFilter("all")
              }
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos ({users.length})
            </button>

            <button
              onClick={() =>
                setFilter("cliente")
              }
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                filter === "cliente"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Clientes (
              {
                users.filter(
                  (u) =>
                    u.type ===
                    "cliente"
                ).length
              }
              )
            </button>

            <button
              onClick={() =>
                setFilter("tecnico")
              }
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                filter === "tecnico"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Técnicos (
              {
                users.filter(
                  (u) =>
                    u.type ===
                    "tecnico"
                ).length
              }
              )
            </button>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-sm text-gray-600 mb-1">
            Total Usuarios
          </p>

          <p className="text-3xl font-bold text-gray-900">
            {users.length}
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-sm text-gray-600 mb-1">
            Clientes Activos
          </p>

          <p className="text-3xl font-bold text-blue-600">
            {
              users.filter(
                (u) =>
                  u.type ===
                  "cliente"
              ).length
            }
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-sm text-gray-600 mb-1">
            Técnicos Activos
          </p>

          <p className="text-3xl font-bold text-green-600">
            {
              users.filter(
                (u) =>
                  u.type ===
                  "tecnico"
              ).length
            }
          </p>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50 border-b border-gray-200">

              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Usuario
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Contacto
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Ubicación
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Tipo
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Trabajos
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

              {filteredUsers.map(
                (user, index) => (
                  <motion.tr
                    key={user.id}
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
                        index * 0.05,
                    }}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">

                      <div>

                        <p className="font-semibold text-gray-900">
                          {user.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          Registrado:{" "}
                          {
                            user.registrationDate
                          }
                        </p>

                      </div>

                    </td>

                    <td className="px-6 py-4">

                      <div className="space-y-1 text-sm">

                        <div className="flex items-center gap-2 text-gray-900">

                          <Mail size={14} />

                          {user.email}

                        </div>

                        <div className="flex items-center gap-2 text-gray-600">

                          <Phone size={14} />

                          {user.phone}

                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2 text-gray-900">

                        <MapPin size={16} />

                        {user.location}

                      </div>

                    </td>

                    <td className="px-6 py-4">

                      {user.type ===
                      "cliente" ? (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                          Cliente
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">
                          Técnico
                        </span>
                      )}

                    </td>

                    <td className="px-6 py-4">

                      <span className="font-semibold text-gray-900">
                        {
                          user.completedJobs
                        }
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">
                        Activo
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Ver detalles
                      </button>

                    </td>

                  </motion.tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}