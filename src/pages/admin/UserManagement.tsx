import { useEffect, useMemo, useState } from "react";
import { Search, Mail, Phone, MapPin, UserCheck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

import { getUsers } from "../../services/userService";
import type { UsuarioAdmin } from "../../services/userService";
import { getComunas } from "../../services/catalogService";
import type { Comuna } from "../../services/catalogService";

type FilterType = "all" | "CLIENTE" | "TECNICO" | "ADMIN";

function getRolLabel(rol: string) {
  if (rol === "CLIENTE") return "Cliente";
  if (rol === "TECNICO") return "Técnico";
  if (rol === "ADMIN") return "Administrador";
  return rol;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UsuarioAdmin[]>([]);
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarUsuarios() {
      try {
        setLoading(true);
        setError("");

        const [usuariosData, comunasData] = await Promise.all([
          getUsers(),
          getComunas(),
        ]);

        setUsers(usuariosData);
        setComunas(comunasData);
      } catch (err) {
        setError("No se pudieron cargar los usuarios del sistema.");
      } finally {
        setLoading(false);
      }
    }

    cargarUsuarios();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesFilter =
        filter === "all" || user.tipo_usuario === filter;

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        user.nombre_completo.toLowerCase().includes(search) ||
        user.correo.toLowerCase().includes(search) ||
        user.rut.toLowerCase().includes(search);

      return matchesFilter && matchesSearch;
    });
  }, [users, filter, searchTerm]);

  const comunasPorId = useMemo(() => {
    return new Map(
      comunas.map((comuna) => [comuna.id_comuna, comuna.nombre_comuna])
    );
  }, [comunas]);

  const totalClientes = users.filter(
    (user) => user.tipo_usuario === "CLIENTE"
  ).length;

  const totalTecnicos = users.filter(
    (user) => user.tipo_usuario === "TECNICO"
  ).length;

  const totalAdmins = users.filter(
    (user) => user.tipo_usuario === "ADMIN"
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Usuarios
        </h1>
        <p className="mt-2 text-gray-600">
          Administración de usuarios registrados en FixYa.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-blue-50 p-5">
            <p className="text-sm font-medium text-blue-700">
              Total usuarios
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-900">
              {users.length}
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-5">
            <p className="text-sm font-medium text-green-700">
              Clientes
            </p>
            <p className="mt-2 text-3xl font-bold text-green-900">
              {totalClientes}
            </p>
          </div>

          <div className="rounded-xl bg-purple-50 p-5">
            <p className="text-sm font-medium text-purple-700">
              Técnicos
            </p>
            <p className="mt-2 text-3xl font-bold text-purple-900">
              {totalTecnicos}
            </p>
          </div>

          <div className="rounded-xl bg-slate-100 p-5">
            <p className="text-sm font-medium text-slate-700">
              Administradores
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalAdmins}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por nombre, correo o RUT"
              className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>

            <button
              onClick={() => setFilter("CLIENTE")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                filter === "CLIENTE"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Clientes
            </button>

            <button
              onClick={() => setFilter("TECNICO")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                filter === "TECNICO"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Técnicos
            </button>

            <button
              onClick={() => setFilter("ADMIN")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                filter === "ADMIN"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="font-medium text-gray-600">
            Cargando usuarios...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Contacto
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Comuna
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.rut}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
                          <UserCheck className="h-5 w-5 text-blue-700" />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {user.nombre_completo}
                          </p>
                          <p className="text-sm text-gray-500">
                            RUT: {user.rut}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {user.correo}
                        </p>

                        <p className="flex items-center gap-2 text-sm text-gray-700">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {user.telefono || "Sin teléfono"}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {user.comuna_id_comuna
                          ? comunasPorId.get(user.comuna_id_comuna) ||
                            `ID comuna ${user.comuna_id_comuna}`
                          : "Sin comuna"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {getRolLabel(user.tipo_usuario)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.estado_usuario
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.estado_usuario ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                        Ver detalles
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No se encontraron usuarios.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
