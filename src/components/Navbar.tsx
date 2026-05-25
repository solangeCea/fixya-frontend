import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">

      

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            🔧
          </div>

          <h1 className="text-2xl font-bold text-blue-600">
            FixYa
          </h1>
        </Link>

        {/* LINKS */}
        <div className="flex items-center gap-6">

          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Inicio
          </Link>

          <Link
            to="/servicios"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Servicios
          </Link>

          <Link
            to="/tecnicos"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Técnicos
          </Link>

          <Link
            to="/login"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Registro
          </Link>

        </div>

      

    </nav>
  );
}

export default Navbar;
