import Navbar from "../components/Navbar";

function Servicios() {
  const servicios = [
    "Electricidad",
    "Gasfitería",
    "Refrigeración",
    "Computación",
    "Cerrajería",
    "Pintura",
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold text-gray-900 mb-10">
          Servicios Disponibles
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

          {servicios.map((servicio) => (
            <div
              key={servicio}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-bold">
                {servicio}
              </h2>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default Servicios;