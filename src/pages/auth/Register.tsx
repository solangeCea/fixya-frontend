import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wrench, User, Briefcase, Upload } from "lucide-react";
import { motion } from "framer-motion";

function Register() {
  const [userType, setUserType] = useState<"cliente" | "tecnico">("cliente");

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert("Cuenta creada correctamente");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wrench className="text-white" size={20} />
            </div>

            <span className="text-xl font-bold">FixYa</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Crear Cuenta
            </h1>

            <p className="text-gray-600">
              Únete a la comunidad FixYa
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setUserType("cliente")}
              className={`p-4 rounded-xl border-2 transition-all ${
                userType === "cliente"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className={`${
                  userType === "cliente"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                } w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3`}
              >
                <User size={24} />
              </div>

              <h3 className="font-bold text-gray-900">
                Soy Cliente
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                Busco contratar técnicos
              </p>
            </button>

            <button
              type="button"
              onClick={() => setUserType("tecnico")}
              className={`p-4 rounded-xl border-2 transition-all ${
                userType === "tecnico"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className={`${
                  userType === "tecnico"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                } w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3`}
              >
                <Briefcase size={24} />
              </div>

              <h3 className="font-bold text-gray-900">
                Soy Técnico
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                Ofrezco mis servicios
              </p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>

                <input
                  type="text"
                  required
                  placeholder="Juan Pérez"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  RUT
                </label>

                <input
                  type="text"
                  required
                  placeholder="12.345.678-9"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>

              <input
                type="email"
                required
                placeholder="correo@gmail.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Teléfono
              </label>

              <input
                type="tel"
                required
                placeholder="+56 9 1234 5678"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {userType === "tecnico" && (
              <>
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Especialidad
                  </label>

                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option>Gasfitería</option>
                    <option>Electricidad</option>
                    <option>Computación</option>
                    <option>Cerrajería</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Documento
                  </label>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                      <Upload className="text-gray-400" size={20} />

                      <p className="text-gray-600">
                        Subir documento PDF o imagen
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Contraseña
                </label>

                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Confirmar contraseña
                </label>

                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              {userType === "tecnico"
                ? "Enviar Solicitud"
                : "Crear Cuenta"}
            </button>

            <p className="text-center text-gray-600 text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Inicia sesión
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;