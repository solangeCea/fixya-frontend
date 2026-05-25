import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wrench, User, Briefcase, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

import { createUser } from "../../services/userService";
import type { UsuarioCreate } from "../../services/userService";
import { getComunas } from "../../services/catalogService";
import type { Comuna } from "../../services/catalogService";

type UserType = "cliente" | "tecnico";

interface RegisterForm {
  nombre_completo: string;
  rut: string;
  fecha_nacimiento: string;
  genero: string;
  correo: string;
  telefono: string;
  contrasena: string;
  confirmarContrasena: string;
  comuna_id_comuna: number;
}

const initialForm: RegisterForm = {
  nombre_completo: "",
  rut: "",
  fecha_nacimiento: "",
  genero: "Femenino",
  correo: "",
  telefono: "",
  contrasena: "",
  confirmarContrasena: "",
  comuna_id_comuna: 0,
};

function Register() {
  const [userType, setUserType] = useState<UserType>("cliente");
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [loadingComunas, setLoadingComunas] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function cargarComunas() {
      try {
        setLoadingComunas(true);
        setError("");

        const data = await getComunas();
        setComunas(data);
        setForm((prev) => ({
          ...prev,
          comuna_id_comuna: prev.comuna_id_comuna || data[0]?.id_comuna || 0,
        }));
      } catch {
        setError("No se pudieron cargar las comunas.");
      } finally {
        setLoadingComunas(false);
      }
    }

    cargarComunas();
  }, []);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "comuna_id_comuna" ? Number(value) : value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.contrasena !== form.confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!form.comuna_id_comuna) {
      setError("Debes seleccionar una comuna.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload: UsuarioCreate = {
        rut: form.rut,
        nombre_completo: form.nombre_completo,
        fecha_nacimiento: form.fecha_nacimiento,
        genero: form.genero,
        correo: form.correo,
        telefono: form.telefono,
        contrasena: form.contrasena,
        comuna_id_comuna: form.comuna_id_comuna,
        tipo_usuario: userType === "cliente" ? "CLIENTE" : "TECNICO",
      };

      await createUser(payload);

      alert("Cuenta creada correctamente");
      navigate("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo registrar el usuario."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white py-6">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <div className="rounded-lg bg-blue-600 p-2">
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
          className="rounded-2xl bg-white p-8 shadow-sm"
        >
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Crear Cuenta
            </h1>

            <p className="text-gray-600">
              Únete a la comunidad FixYa
            </p>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setUserType("cliente")}
              className={`rounded-xl border-2 p-4 transition-all ${
                userType === "cliente"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${
                  userType === "cliente"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <User size={24} />
              </div>

              <h3 className="font-bold text-gray-900">
                Soy Cliente
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Busco contratar técnicos
              </p>
            </button>

            <button
              type="button"
              onClick={() => setUserType("tecnico")}
              className={`rounded-xl border-2 p-4 transition-all ${
                userType === "tecnico"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${
                  userType === "tecnico"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Briefcase size={24} />
              </div>

              <h3 className="font-bold text-gray-900">
                Soy Técnico
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Ofrezco mis servicios
              </p>
            </button>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Nombre completo
                </label>

                <input
                  name="nombre_completo"
                  value={form.nombre_completo}
                  onChange={handleChange}
                  type="text"
                  required
                  placeholder="Juan Pérez"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  RUT
                </label>

                <input
                  name="rut"
                  value={form.rut}
                  onChange={handleChange}
                  type="text"
                  required
                  placeholder="12345678-9"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Fecha de nacimiento
                </label>

                <input
                  name="fecha_nacimiento"
                  value={form.fecha_nacimiento}
                  onChange={handleChange}
                  type="date"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Género
                </label>

                <select
                  name="genero"
                  value={form.genero}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Correo electrónico
              </label>

              <input
                name="correo"
                value={form.correo}
                onChange={handleChange}
                type="email"
                required
                placeholder="correo@gmail.com"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Teléfono
              </label>

              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                type="tel"
                required
                placeholder="912345678"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Comuna
              </label>

              <select
                name="comuna_id_comuna"
                value={form.comuna_id_comuna}
                onChange={handleChange}
                required
                disabled={loadingComunas || comunas.length === 0}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {comunas.length === 0 && (
                  <option value={0}>Sin comunas disponibles</option>
                )}
                {comunas.map((comuna) => (
                  <option key={comuna.id_comuna} value={comuna.id_comuna}>
                    {comuna.nombre_comuna}
                  </option>
                ))}
              </select>
            </div>

            {userType === "tecnico" && (
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                El registro como técnico crea el usuario con rol TÉCNICO.
                El perfil técnico detallado se completará desde el módulo de técnicos.
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Contraseña
                </label>

                <input
                  name="contrasena"
                  value={form.contrasena}
                  onChange={handleChange}
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Confirmar contraseña
                </label>

                <input
                  name="confirmarContrasena"
                  value={form.confirmarContrasena}
                  onChange={handleChange}
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || loadingComunas || comunas.length === 0}
              className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {loading
                ? "Creando cuenta..."
                : userType === "tecnico"
                ? "Crear cuenta técnico"
                : "Crear cuenta cliente"}
            </button>

            <p className="text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700"
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