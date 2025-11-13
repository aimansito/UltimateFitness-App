import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input, Button } from '../../components/common';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-uf-darker flex items-center justify-center px-4">
      {/* Banner superior */}
      <div className="absolute top-0 left-0 right-0 bg-uf-gold py-6">
        <h1 className="text-center text-black font-bold text-3xl uppercase tracking-wider">
          INICIAR SESIÓN
        </h1>
      </div>

      {/* Formulario */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8 mt-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/forgot-password" className="text-uf-blue hover:text-uf-gold text-sm">
            ¿Has olvidado tu contraseña?
          </Link>
        </div>

        <div className="mt-4 text-center">
          <span className="text-gray-600 text-sm">¿No tienes cuenta? </span>
          <Link to="/registro" className="text-uf-gold hover:text-uf-blue font-semibold text-sm">
            Crear Cuenta
          </Link>
        </div>

        {/* Usuario de prueba */}
        <div className="mt-8 bg-gray-50 p-4 rounded border border-gray-200">
          <p className="text-xs text-gray-600 font-semibold mb-2">Usuario de prueba:</p>
          <p className="text-xs text-gray-700">Email: juan.perez@email.com</p>
          <p className="text-xs text-gray-700">Contraseña: (cualquiera)</p>
        </div>
      </div>

      {/* Footer con logo */}
      <div className="absolute bottom-8 left-8">
        <Link to="/">
          <img src="/logo.png" alt="Ultimate Fitness" className="h-16" />
        </Link>
      </div>
    </div>
  );
}

export default Login;