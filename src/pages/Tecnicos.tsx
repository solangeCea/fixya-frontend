import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Brain,
  Briefcase,
  CheckCircle,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  Star,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { getPublicTechnicianProfiles } from "../services/technicianService";
import type { TecnicoPublicProfile } from "../services/technicianService";
import { pluralize } from "../utils/text";

function sentimentClass(sentimiento: string) {
  if (sentimiento === "Positivo") return "bg-emerald-100 text-emerald-700";
  if (sentimiento === "Crítico" || sentimiento === "Critico") {
    return "bg-red-100 text-red-700";
  }
  if (sentimiento === "Mixto") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function Tecnicos() {
  const [tecnicos, setTecnicos] = useState<TecnicoPublicProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTecnico, setSelectedTecnico] =
    useState<TecnicoPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function cargarTecnicos() {
    try {
      setLoading(true);
      setError("");

      const data = await getPublicTechnicianProfiles();
      setTecnicos(data);
    } catch {
      setError("No se pudieron cargar los perfiles de técnicos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarTecnicos();
  }, []);

  const filteredTecnicos = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return tecnicos.filter(
      (tecnico) =>
        tecnico.nombre_completo.toLowerCase().includes(search) ||
        tecnico.nivel_tecnico.toLowerCase().includes(search) ||
        tecnico.descripcion_perfil.toLowerCase().includes(search)
    );
  }, [tecnicos, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Técnicos verificados
            </h1>
            <p className="mt-2 text-gray-600">
              Revisa perfiles técnicos aprobados por FixYa.
            </p>
          </div>

          <button
            onClick={cargarTecnicos}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Actualizar
          </button>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por nombre, nivel o especialidad"
              className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            Cargando técnicos...
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredTecnicos.map((tecnico) => (
              <article
                key={tecnico.usuario_rut}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                      <Briefcase className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">
                        {tecnico.nombre_completo}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {tecnico.nivel_tecnico} · {tecnico.experiencia_anios} años
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    Verificado
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  {tecnico.descripcion_perfil}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold text-gray-900">
                    {tecnico.promedio_calificacion}
                  </span>
                  <span>
                    ({tecnico.total_resenas}{" "}
                    {pluralize(tecnico.total_resenas, "reseña", "reseñas")})
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {tecnico.servicios.slice(0, 3).map((servicio) => (
                    <span
                      key={servicio}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      {servicio}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedTecnico(tecnico)}
                  className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Ver perfil
                </button>
              </article>
            ))}

            {filteredTecnicos.length === 0 && (
              <div className="rounded-2xl bg-white p-8 text-center text-gray-600 shadow-sm md:col-span-2 xl:col-span-3">
                No hay técnicos verificados para mostrar.
              </div>
            )}
          </div>
        )}
      </main>

      {selectedTecnico && (
        <div
          onClick={() => setSelectedTecnico(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedTecnico.nombre_completo}
                </h2>
                <p className="mt-1 text-gray-600">
                  {selectedTecnico.descripcion_perfil}
                </p>
              </div>
              <button
                onClick={() => setSelectedTecnico(null)}
                className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Cerrar
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">RUT</p>
                <p className="font-semibold text-gray-900">
                  {selectedTecnico.usuario_rut}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Nivel</p>
                <p className="font-semibold text-gray-900">
                  {selectedTecnico.nivel_tecnico}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Experiencia</p>
                <p className="font-semibold text-gray-900">
                  {selectedTecnico.experiencia_anios} años
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Contacto</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-gray-700">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {selectedTecnico.correo}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-gray-700">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {selectedTecnico.telefono}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 md:col-span-2">
                <p className="text-sm text-gray-500">Servicios</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selectedTecnico.servicios.length > 0
                    ? selectedTecnico.servicios.join(", ")
                    : "Sin servicios asociados"}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 md:col-span-2">
                <p className="text-sm text-gray-500">Comunas</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selectedTecnico.comunas.length > 0
                    ? selectedTecnico.comunas.join(", ")
                    : "Sin comunas asociadas"}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 md:col-span-2">
                <p className="text-sm text-gray-500">Reputación</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selectedTecnico.promedio_calificacion} estrellas ·{" "}
                  {selectedTecnico.total_resenas}{" "}
                  {pluralize(selectedTecnico.total_resenas, "reseña", "reseñas")}
                </p>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 md:col-span-2">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-700" />
                    <p className="font-semibold text-gray-900">
                      Resumen inteligente
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${sentimentClass(
                      selectedTecnico.resumen_reputacion.sentimiento_general
                    )}`}
                  >
                    {selectedTecnico.resumen_reputacion.sentimiento_general}
                  </span>
                </div>

                <p className="text-sm leading-6 text-gray-700">
                  {selectedTecnico.resumen_reputacion.resumen}
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase text-blue-800">
                      <Sparkles className="h-3.5 w-3.5" />
                      Fortalezas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTecnico.resumen_reputacion.fortalezas.length > 0 ? (
                        selectedTecnico.resumen_reputacion.fortalezas.map(
                          (fortaleza) => (
                            <span
                              key={fortaleza}
                              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700"
                            >
                              {fortaleza}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-sm text-gray-500">
                          Sin patrones suficientes
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-bold uppercase text-slate-600">
                      Aspectos a observar
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTecnico.resumen_reputacion.aspectos_a_mejorar
                        .length > 0 ? (
                        selectedTecnico.resumen_reputacion.aspectos_a_mejorar.map(
                          (aspecto) => (
                            <span
                              key={aspecto}
                              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                            >
                              {aspecto}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-sm text-gray-500">
                          Sin alertas relevantes
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs font-semibold text-blue-900">
                  {selectedTecnico.resumen_reputacion.comentarios_analizados}{" "}
                  comentarios analizados · confianza{" "}
                  {selectedTecnico.resumen_reputacion.nivel_confianza} ·{" "}
                  {selectedTecnico.resumen_reputacion.modo_analisis}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tecnicos;
