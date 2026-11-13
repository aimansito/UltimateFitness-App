import { useState } from "react";
import { ENTRENADORES } from "../../config/funciones";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input, Button } from "../../components/common";
import SEO from "../../components/common/SEO";

function Login() {
  // ============================================
  // HOOKS Y ESTADO
  // ============================================
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================
  // FUNCIONES
  // ============================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setError("Por favor completa todos los campos");
        setLoading(false);
        return;
      }

      const result = await login(formData.email, formData.password);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-uf-darker px-4 py-12">
      <SEO
        title="Iniciar Sesión"
        description="Accede a tu cuenta de Ultimate Fitness para gestionar tus entrenamientos, dietas y seguimiento de progreso."
        noindex={true}
      />
      <div className="uf-glow left-1/2 top-24 h-72 w-[34rem] -translate-x-1/2" aria-hidden="true" />
      <div className="relative w-full max-w-md">
        <div className="uf-card p-8 sm:p-10">
          <div className="mb-8 text-center">
            <span className="uf-eyebrow justify-center">Bienvenido de nuevo</span>
            <h1 className="mt-3 font-anton text-4xl uppercase text-white">
              Iniciar <span className="uf-text-gold">Sesión</span>
            </h1>
          </div>

          {error && (
            <div role="alert" className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-300">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                className="w-full rounded-xl border border-uf-line bg-black/50 px-4 py-3 text-white placeholder-gray-600 transition focus:border-uf-gold focus:outline-none"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-300">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-uf-line bg-black/50 px-4 py-3 text-white placeholder-gray-600 transition focus:border-uf-gold focus:outline-none"
              />
            </div>

            {/* Checkbox - Guardar credenciales */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded accent-uf-gold"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-400"
              >
                Guardar credenciales de sesión
              </label>
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading}
              className="uf-btn uf-btn-primary mb-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* BOTÓN PARA ENTRENADOR */}
          {ENTRENADORES && (
          <button
            onClick={() => navigate("/entrenador/login")}
            className="uf-btn uf-btn-ghost mb-2 w-full"
          >
            SOY ENTRENADOR
          </button>
          )}
          {/* Links adicionales */}
          <div className="mt-6 text-center space-y-3">
            <Link
              to="/recuperar-password"
              className="block text-sm text-gray-400 transition hover:text-uf-gold"
            >
              ¿Has olvidado tu contraseña?
            </Link>

            <div className="text-sm text-gray-400">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="font-semibold text-uf-gold transition hover:text-white"
              >
                Crear Cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
