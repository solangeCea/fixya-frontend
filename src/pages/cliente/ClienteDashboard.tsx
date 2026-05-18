import Navbar from "../../components/Navbar";

function ClienteDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Panel del Cliente
        </h1>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-2">
              Solicitar Servicio
            </h2>

            <p className="text-gray-600">
              Publica una nueva solicitud técnica.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-2">
              Mis Solicitudes
            </h2>

            <p className="text-gray-600">
              Revisa el estado de tus servicios.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-2">
              Técnicos Favoritos
            </h2>

            <p className="text-gray-600">
              Guarda técnicos confiables.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ClienteDashboard;