import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/usuarios?email=${email}`);
      
      if (response.data.member && response.data.member.length > 0) {
        const usuario = response.data.member[0];
        localStorage.setItem('usuario', JSON.stringify(usuario));
        navigate('/dashboard');
      } else {
        setError('Usuario no encontrado');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showNavbar={false}>
      <div className="min-h-screen flex items-center justify-center px-4">
        {/* Banner superior */}
        <div className="absolute top-0 left-0 right-0 bg-uf-gold py-6">
          <h1 className="text-center text-black font-bold text-3xl uppercase tracking-wider">
            INICIAR SESIÓN
          </h1>
        </div>

        {/* Formulario */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8 mt-20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Escribe tu nombre
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-b-2 border-uf-gold focus:outline-none focus:border-uf-blue transition"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Escribe tu contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-b-2 border-uf-gold focus:outline-none focus:border-uf-blue transition"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 text-uf-blue border-gray-300 rounded focus:ring-uf-blue"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Guardar credenciales de sesión
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-uf-gold hover:bg-uf-blue text-black hover:text-white font-bold py-4 rounded uppercase tracking-wider transition disabled:opacity-50"
            >
              {loading ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/forgot-password" className="text-uf-blue hover:text-uf-gold text-sm">
              ¿Has olvidado tu contraseña?
            </Link>
          </div>
        </div>

        {/* Footer con logo */}
        <div className="absolute bottom-8 left-8">
          <Link to="/">
            <img src="/logo.png" alt="Ultimate Fitness" className="h-16" />
          </Link>
        </div>

        {/* Enlaces footer */}
        <div className="absolute bottom-8 right-8 flex items-center space-x-6 text-gray-400">
          <span>Contáctanos</span>
          <a href="#" className="hover:text-uf-gold transition">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z"/>
            </svg>
          </a>
        </div>
      </div>
    </Layout>
  );
}

export default Login;