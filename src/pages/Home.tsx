import Navbar from "../components/Navbar";

function Home() {
  return (
    <div>
      <Navbar />

      <main>
        <section>
          <h1>Encuentra técnicos confiables cerca de ti</h1>

          <p>
            Solicita servicios, recibe cotizaciones y resuelve problemas desde
            una sola plataforma.
          </p>

          <button>Solicitar Servicio</button>
        </section>

        <section>
          <h2>Servicios Disponibles</h2>

          <div>
            <p>🔧 Gasfitería</p>
            <p>💡 Electricidad</p>
            <p>🖥️ Computación</p>
            <p>❄️ Refrigeración</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;