import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { getServicios } from "../services/catalogService";
import type { Servicio } from "../services/catalogService";

function Servicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function cargarServicios() {
    try {
      setLoading(true);
      setError("");

      const data = await getServicios();
      setServicios(data.filter((servicio) => servicio.estado_servicio));
    } catch {
      setServicios([]);
      setError("No se pudieron cargar los servicios disponibles.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void cargarServicios();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-8 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
                <ShieldCheck className="h-4 w-4" />
                Catalogo activo
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                Servicios disponibles
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                Revisa las categorias de servicio habilitadas en FixYa para
                solicitar ayuda tecnica con seguimiento y cotizacion.
              </p>
            </div>

            <button
              type="button"
              onClick={cargarServicios}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Actualizar
            </button>
          </div>
        </section>

        {loading && (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="min-h-48 animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-6 h-12 w-12 rounded-xl bg-slate-200" />
                <div className="mb-3 h-5 w-3/4 rounded bg-slate-200" />
                <div className="h-4 w-full rounded bg-slate-100" />
                <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
              </div>
            ))}
          </section>
        )}

        {error && !loading && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <h2 className="font-bold">No fue posible cargar servicios</h2>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={cargarServicios}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-800"
              >
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </button>
            </div>
          </section>
        )}

        {!loading && !error && (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {servicios.map((servicio) => (
              <article
                key={servicio.id_servicio}
                className="group flex min-h-56 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-200/80"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Activo
                  </span>
                </div>

                <h2 className="text-xl font-black text-slate-950">
                  {servicio.nombre_servicio}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                  {servicio.descripcion_servicio ||
                    "Servicio disponible para solicitudes en la plataforma."}
                </p>
              </article>
            ))}

            {servicios.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm sm:col-span-2 lg:col-span-4">
                No hay servicios activos registrados.
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default Servicios;
