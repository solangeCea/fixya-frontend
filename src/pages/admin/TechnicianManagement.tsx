import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  UserCog,
  XCircle,
} from "lucide-react";

import { getTechnicians } from "../../services/technicianService";
import type { Tecnico } from "../../services/technicianService";

import { getUsers } from "../../services/userService";
import type { UsuarioAdmin } from "../../services/userService";

type FilterType = "all" | "verified" | "pending";

interface TecnicoAdmin extends Tecnico {
  nombre_completo: string;
  correo: string;
  telefono: string | null;
}

export default function TechnicianManagement() {
  const [technicians, setTechnicians] = useState<TecnicoAdmin[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTechnician, setSelectedTechnician] =
    useState<TecnicoAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarTecnicos() {
      try {
        setLoading(true);
        setError("");

        const [tecnicosData, usuariosData] = await Promise.all([
          getTechnicians(),
          getUsers(),
        ]);

        const tecnicosCompletos: TecnicoAdmin[] = tecnicosData.map(
          (tecnico) => {
            const usuario = usuariosData.find(
              (user: UsuarioAdmin) => user.rut === tecnico.usuario_rut
            );

            return {
              ...tecnico,
              nombre_completo:
                usuario?.nombre_completo || "Técnico sin usuario",
              correo: usuario?.correo || "Sin correo",
              telefono: usuario?.telefono || "Sin teléfono",
            };
          }
        );

        setTechnicians(tecnicosCompletos);
      } catch {
        setError("No se pudieron cargar los técnicos del sistema.");
      } finally {
        setLoading(false);
      }
    }

    cargarTecnicos();
  }, []);

  const filteredTechnicians = useMemo(() => {
    return technicians.filter((tech) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "verified" && tech.tecnico_verificado) ||
        (filter === "pending" && !tech.tecnico_verificado);

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        tech.nombre_completo.toLowerCase().includes(search) ||
        tech.correo.toLowerCase().includes(search) ||
        tech.usuario_rut.toLowerCase().includes(search) ||
        tech.nivel_tecnico.toLowerCase().includes(search);

      return matchesFilter && matchesSearch;
    });
  }, [technicians, filter, searchTerm]);

  const totalVerificados = technicians.filter(
    (tech) => tech.tecnico_verificado
  ).length;

  const totalPendientes = technicians.filter(
    (tech) => !tech.tecnico_verificado
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Técnicos
        </h1>
        <p className="mt-2 text-gray-600">
          Administración de técnicos registrados en FixYa.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total técnicos
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {technicians.length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Verificados
          </p>
          <p className="mt-2 text-3xl font-bold text-green-700">
            {totalVerificados}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Pendientes
          </p>
          <p className="mt-2 text-3xl font-bold text-yellow-700">
            {totalPendientes}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por nombre, correo, RUT o nivel"
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
              onClick={() => setFilter("verified")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                filter === "verified"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Verificados
            </button>

            <button
              onClick={() => setFilter("pending")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                filter === "pending"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pendientes
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="font-medium text-gray-600">
            Cargando técnicos...
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
                    Técnico
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Contacto
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Perfil
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Experiencia
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
                {filteredTechnicians.map((tech) => (
                  <tr
                    key={tech.usuario_rut}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
                          <UserCog className="h-5 w-5 text-blue-700" />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {tech.nombre_completo}
                          </p>
                          <p className="text-sm text-gray-500">
                            RUT: {tech.usuario_rut}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {tech.correo}
                        </p>

                        <p className="flex items-center gap-2 text-sm text-gray-700">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {tech.telefono}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {tech.nivel_tecnico}
                      </p>
                      <p className="mt-1 max-w-xs text-sm text-gray-500">
                        {tech.descripcion_perfil}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {tech.experiencia_anios} años
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      {tech.tecnico_verificado ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          Verificado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                          <XCircle className="h-4 w-4" />
                          Pendiente
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedTechnician(tech)}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Ver perfil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTechnicians.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No se encontraron técnicos.
            </div>
          )}
        </div>
      )}

      {selectedTechnician && (
        <div
          onClick={() => setSelectedTechnician(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedTechnician.nombre_completo}
                </h2>
                <p className="mt-1 text-gray-600">
                  {selectedTechnician.descripcion_perfil}
                </p>
              </div>

              <button
                onClick={() => setSelectedTechnician(null)}
                className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-500">
                  RUT
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selectedTechnician.usuario_rut}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-500">
                  Correo
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selectedTechnician.correo}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-500">
                  Teléfono
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selectedTechnician.telefono}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-500">
                  Nivel técnico
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selectedTechnician.nivel_tecnico}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-500">
                  Experiencia
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selectedTechnician.experiencia_anios} años
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-500">
                  Estado
                </p>
                <p className="mt-1 inline-flex items-center gap-2 font-semibold text-gray-900">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  {selectedTechnician.tecnico_verificado
                    ? "Verificado"
                    : "Pendiente"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}