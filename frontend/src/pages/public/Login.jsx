// ============================================
// LOGIN PAGE - Página de inicio de sesión
// ============================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input, Button } from '../../components/common';

function Login() {
  // ============================================
  // HOOKS Y ESTADO
  // ============================================
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ============================================
  // FUNCIONES
  // ============================================
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setLoading(true);
    
    try {
      if (!formData.email || !formData.password) {
        setError('Por favor completa todos los campos');
        setLoading(false);
        return;
      }
      
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-uf-darker to-black px-4 py-12">
      
      {/* ============================================ */}
      {/* HEADER DORADO */}
      {/* ============================================ */}
      <div className="w-full max-w-md">
        <div className="bg-uf-gold py-6 text-center rounded-t-lg">
          <h1 className="text-3xl font-bold text-black uppercase tracking-wider">
            Iniciar Sesión
          </h1>
        </div>

        {/* ============================================ */}
        {/* FORMULARIO */}
        {/* ============================================ */}
        <div className="bg-white p-8 rounded-b-lg shadow-2xl">
          
          {/* Mostrar errores */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-3 border-b-2 border-uf-gold focus:outline-none focus:border-uf-blue transition bg-white text-gray-800"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border-b-2 border-uf-gold focus:outline-none focus:border-uf-blue transition bg-white text-gray-800"
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
                className="w-4 h-4 text-uf-gold border-gray-300 rounded focus:ring-uf-gold"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                Guardar credenciales de sesión
              </label>
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-uf-gold text-black font-bold py-3 rounded uppercase tracking-wider hover:bg-uf-blue hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Links adicionales */}
          <div className="mt-6 text-center space-y-3">
            <Link 
              to="/recuperar-password" 
              className="block text-sm text-uf-blue hover:text-uf-gold transition"
            >
              ¿Has olvidado tu contraseña?
            </Link>
            
            <div className="text-gray-600 text-sm">
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="text-uf-gold hover:text-uf-blue font-semibold transition"
              >
                Crear Cuenta
              </Link>
            </div>
          </div>

          {/* Usuario de prueba */}
          <div className="mt-6 bg-gray-100 rounded p-4 text-xs text-gray-600">
            <strong className="block mb-1">Usuario de prueba:</strong>
            Email: juan.perez@email.com<br/>
            Contraseña: (cualquiera)
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;