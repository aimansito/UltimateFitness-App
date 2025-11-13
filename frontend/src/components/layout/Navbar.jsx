import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isPremium, isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/servicios', label: 'Servicios' },
    { path: '/gym', label: 'Gym' },
    { path: '/blog', label: 'Blog' },
    { path: '/contacto', label: 'Contacto' },
  ];

  return (
    <nav className="bg-black border-b border-uf-gold/20 sticky top-0 z-50 shadow-xl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0">
            <img 
              src={isPremium ? "/logo-premium.png" : "/logo.png"} 
              alt="Ultimate Fitness" 
              className="h-12 hover:opacity-80 transition"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  font-bold text-sm uppercase tracking-widest pb-1 border-b-2 transition-all
                  ${isActive(link.path)
                    ? 'text-uf-gold border-uf-gold'
                    : 'text-white border-transparent hover:text-uf-gold hover:border-uf-gold'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {isPremium && (
              <Badge type="premium" text="PREMIUM" icon="👑" />
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-white font-semibold">
                  Hola, {user.nombre}
                </span>
                <Link 
                  to="/dashboard"
                  className="text-uf-gold hover:text-uf-blue transition"
                  title="Mi Dashboard"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-uf-red transition"
                  title="Cerrar Sesión"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-white font-bold text-sm uppercase hover:text-uf-gold transition"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/registro" 
                  className="bg-uf-gold text-black font-bold px-6 py-2 rounded uppercase text-sm hover:bg-uf-blue hover:text-white transition"
                >
                  Crear Cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;