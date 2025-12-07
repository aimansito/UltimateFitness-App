import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthEntrenador from "../../context/AuthContextEntrenador";

function LoginEntrenador() {
  const navigate = useNavigate();
  const { login } = useAuthEntrenador();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login(email, password);

    if (res.success) {
      navigate("/entrenador/dashboard");
    } else {
      setError(res.error || "Credenciales incorrectas");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6">

      <div className="w-full max-w-md">
        {/* Título */}
        <div className="bg-uf-blue py-5 text-center rounded-t-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider">
            Entrenador - Login
          </h1>
        </div>

        {/* Tarjeta del formulario */}
        <div className="bg-white p-8 rounded-b-2xl shadow-2xl border border-gray-200">
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-uf-blue focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-uf-blue focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-uf-blue text-white font-bold py-3 rounded-lg uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
            >
              {loading ? "Validando..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Enlace volver */}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-uf-blue hover:underline text-sm">
              Volver al login de usuario
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}

export default LoginEntrenador;
