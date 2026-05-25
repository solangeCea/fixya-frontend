import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw, Wrench } from "lucide-react";

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
      setError("No se pudieron cargar los servicios disponibles.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarServicios();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Servicios Disponibles
            </h1>
            <p className="mt-2 text-gray-600">
              Catalogo real de servicios activos en FixYa.
            </p>
          </div>

          <button
            onClick={cargarServicios}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Actualizar
          </button>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            Cargando servicios...
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicios.map((servicio) => (
              <div
                key={servicio.id_servicio}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <Wrench className="h-6 w-6 text-blue-700" />
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  {servicio.nombre_servicio}
                </h2>

                {servicio.descripcion_servicio && (
                  <p className="mt-2 text-sm text-gray-600">
                    {servicio.descripcion_servicio}
                  </p>
                )}
              </div>
            ))}

            {servicios.length === 0 && (
              <div className="rounded-2xl bg-white p-8 text-center text-gray-600 shadow-sm sm:col-span-2 lg:col-span-3">
                No hay servicios activos registrados.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Servicios;
