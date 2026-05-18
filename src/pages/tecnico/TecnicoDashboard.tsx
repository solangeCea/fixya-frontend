import Navbar from "../../components/Navbar";

function TecnicoDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Panel del Técnico
        </h1>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-2">
              Solicitudes Disponibles
            </h2>

            <p className="text-gray-600">
              Busca nuevos trabajos cercanos.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-2">
              Mis Servicios
            </h2>

            <p className="text-gray-600">
              Administra tus trabajos actuales.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-2">
              Calificaciones
            </h2>

            <p className="text-gray-600">
              Mira las opiniones de clientes.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default TecnicoDashboard;