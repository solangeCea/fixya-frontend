import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Wrench, User, Shield, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

function Login() {
  const [selectedRole, setSelectedRole] = useState<
    "cliente" | "tecnico" | "admin" | null
  >(null);

  const navigate = useNavigate();

  const roles = [
    {
      type: "cliente" as const,
      title: "Cliente",
      description: "Busca y contrata técnicos para tu hogar",
      icon: User,
      color: "bg-blue-100 text-blue-600 hover:bg-blue-200",
    },
    {
      type: "tecnico" as const,
      title: "Técnico",
      description: "Ofrece tus servicios profesionales",
      icon: Briefcase,
      color: "bg-green-100 text-green-600 hover:bg-green-200",
    },
    {
      type: "admin" as const,
      title: "Administrador",
      description: "Gestiona la plataforma",
      icon: Shield,
      color: "bg-purple-100 text-purple-600 hover:bg-purple-200",
    },
  ];

const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();

  if (selectedRole === "cliente") {
    navigate("/cliente/dashboard");
  }

  if (selectedRole === "tecnico") {
    navigate("/tecnico/dashboard");
  }

  if (selectedRole === "admin") {
    navigate("/admin/panel");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl w-full"
      >
        <div className="text-center mb-8">
          <div className="bg-blue-600 p-3 rounded-xl inline-block mb-4">
            <Wrench className="text-white" size={32} />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Bienvenido a FixYa
          </h1>

          <p className="text-gray-600 text-lg">
            Selecciona cómo deseas ingresar
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {roles.map((role) => (
              <motion.button
                key={role.type}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRole(role.type)}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  selectedRole === role.type
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`${role.color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors`}
                >
                  <role.icon size={32} />
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {role.title}
                </h3>

                <p className="text-gray-600 text-sm">
                  {role.description}
                </p>
              </motion.button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>

              <input
                type="email"
                required
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Contraseña
              </label>

              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedRole}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors mt-6 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Iniciar Sesión
          </button>

          <p className="text-center text-gray-600 text-sm mt-6">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Regístrate aquí
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;