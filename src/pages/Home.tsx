import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* TEXTO */}
          <div>

            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Encuentra técnicos confiables cerca de ti
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              Solicita servicios técnicos, recibe cotizaciones y
              resuelve problemas desde una sola plataforma.
            </p>

            <div className="mt-8 flex gap-4">

              <Link
                to="/register"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
              >
                Solicitar Servicio
              </Link>

              <button className="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100">
                Ver Técnicos
              </button>

            </div>
          </div>

          {/* IMAGEN */}
          <div className="flex justify-center">

            <img
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop"
              alt="Tecnicos"
              className="rounded-3xl shadow-xl"
            />

          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="max-w-7xl mx-auto px-6 pb-20">

        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Servicios Disponibles
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="font-bold text-lg">Electricidad</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">🚰</div>
            <h3 className="font-bold text-lg">Gasfitería</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">🧊</div>
            <h3 className="font-bold text-lg">Refrigeración</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="font-bold text-lg">Computación</h3>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;