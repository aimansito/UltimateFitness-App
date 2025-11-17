// ============================================
// IMPORTS - Librerías y componentes necesarios
// ============================================
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';

function Navbar() {
  // ============================================
  // HOOKS
  // ============================================
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isPremium, isAuthenticated } = useAuth();

  // ============================================
  // ESTADOS
  // ============================================
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [entrenamientosOpen, setEntrenamientosOpen] = useState(false);

  // ============================================
  // FUNCIONES
  // ============================================
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  // ============================================
  // DATOS - Links del menú
  // ============================================
  const navLinks = [
    { path: '/', label: 'INICIO', hasSubmenu: false },
    { path: '/servicios', label: 'SERVICIOS', hasSubmenu: false },
    {
      label: 'ENTRENAMIENTOS',
      hasSubmenu: true,
      submenu: [
        { path: '/gym', label: 'Gym' },
        { path: '/workout', label: 'Workout' }
      ]
    },
    { path: '/alimentacion', label: 'ALIMENTACIÓN', hasSubmenu: false },
    { path: '/blog', label: 'BLOG', hasSubmenu: false },
    { path: '/contacto', label: 'CONTACTO', hasSubmenu: false },
  ];

  return (
    <nav className={`border-b sticky top-0 z-50 shadow-xl ${isPremium ? 'bg-black border-uf-red/30' : 'bg-black border-uf-gold/20'}`}>
      <div className="w-full px-6">

        {/* ========================================== */}
        {/* VERSIÓN DESKTOP */}
        {/* ========================================== */}
        <div className="hidden md:flex justify-between items-center h-20">

          {/* IZQUIERDA: Logo + Separador + Menú */}
          <div className="flex items-center space-x-6">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src={isPremium ? "/logos/logo-premium.png" : "/logos/logo.png"}
                alt="Ultimate Fitness"
                className="h-14 hover:opacity-80 transition duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="hidden font-audiowide text-uf-gold font-bold text-xl uppercase tracking-wider">
                💪 UF
              </span>
            </Link>

            {/* SEPARADOR VERTICAL */}
            <div className={`h-10 w-px ${isPremium ? 'bg-uf-red/50' : 'bg-uf-gold/30'}`}></div>

            {/* MENÚ DE NAVEGACIÓN */}
            <div className="flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <div key={index} className="relative">

                  {!link.hasSubmenu ? (
                    <Link
                      to={link.path}
                      className={`
                        font-audiowide font-bold text-xs uppercase tracking-widest pb-1 border-b-2 transition-all duration-300
                        ${isActive(link.path)
                          ? isPremium
                            ? 'text-uf-red border-uf-red'
                            : 'text-uf-gold border-uf-gold'
                          : isPremium
                            ? 'text-white border-transparent hover:text-uf-red hover:border-uf-red'
                            : 'text-white border-transparent hover:text-uf-gold hover:border-uf-gold'
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => setEntrenamientosOpen(!entrenamientosOpen)}
                        className={`
                          font-audiowide font-bold text-xs uppercase tracking-widest pb-1 border-b-2 transition-all duration-300
                          ${isPremium
                            ? 'text-white border-transparent hover:text-uf-red hover:border-uf-red'
                            : 'text-white border-transparent hover:text-uf-gold hover:border-uf-gold'
                          }
                        `}
                      >
                        {link.label}
                        <svg
                          className={`w-3 h-3 ml-1 inline transition-transform duration-300 ${entrenamientosOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {entrenamientosOpen && (
                        <div
                          className={`absolute left-0 top-full mt-2 w-44 bg-uf-dark border-2 rounded-lg shadow-2xl overflow-hidden z-50 ${isPremium ? 'border-uf-red' : 'border-uf-gold'}`}
                        >
                          {link.submenu.map((sublink, subIndex) => (
                            <Link
                              key={subIndex}
                              to={sublink.path}
                              onClick={() => setEntrenamientosOpen(false)}
                              className={`block px-4 py-3 text-white transition-all duration-300 font-semibold text-sm ${isPremium ? 'hover:bg-uf-red hover:text-white' : 'hover:bg-uf-gold hover:text-black'}`}
                            >
                              {sublink.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DERECHA: Usuario y Botones */}
          <div className="flex items-center space-x-4">

            {isPremium && <Badge type="premium" text="PREMIUM" icon="👑" />}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-white font-semibold text-sm">
                  Hola, {user.nombre}
                </span>

                <Link
                  to="/dashboard"
                  className={`transition-all duration-300 transform hover:scale-110 ${isPremium ? 'text-uf-red hover:text-uf-blue' : 'text-uf-gold hover:text-uf-blue'}`}
                  title="Mi Dashboard"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-uf-red transition-all duration-300 transform hover:scale-110"
                  title="Cerrar Sesión"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white font-bold text-xs uppercase hover:text-uf-gold transition-all duration-300"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="bg-uf-gold text-black font-bold px-5 py-2 rounded uppercase text-xs hover:bg-uf-blue hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Crear Cuenta
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* VERSIÓN MÓVIL */}
        {/* ========================================== */}
        <div className="md:hidden flex justify-between items-center h-16">

          {/* Logo móvil */}
          <Link to="/">
            <img
              src={isPremium ? "/logos/logo-premium.png" : "/logos/logo.png"}
              alt="Ultimate Fitness"
              className="h-12"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="hidden font-audiowide text-uf-gold font-bold text-lg uppercase">
              💪 UF
            </span>
          </Link>

          {/* Usuario móvil */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && (
              <Link to="/dashboard" className="text-uf-gold">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </Link>
            )}

            {/* Hamburguesa */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {menuOpen && (
          <div className="md:hidden bg-uf-dark border-t-2 border-uf-gold/30 py-4">
            {navLinks.map((link, index) => (
              <div key={index}>
                {!link.hasSubmenu ? (
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 text-white font-bold hover:bg-uf-gold hover:text-black transition ${isActive(link.path) ? 'bg-uf-gold/20 text-uf-gold' : ''}`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => setEntrenamientosOpen(!entrenamientosOpen)}
                      className="w-full text-left px-4 py-3 text-white font-bold hover:bg-uf-gold hover:text-black transition flex justify-between items-center"
                    >
                      {link.label}
                      <svg
                        className={`w-4 h-4 transition-transform ${entrenamientosOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {entrenamientosOpen && (
                      <div className="bg-uf-darker">
                        {link.submenu.map((sublink, subIndex) => (
                          <Link
                            key={subIndex}
                            to={sublink.path}
                            onClick={() => {
                              setMenuOpen(false);
                              setEntrenamientosOpen(false);
                            }}
                            className="block px-8 py-2 text-gray-300 hover:text-uf-gold transition"
                          >
                            {sublink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            {/* Botones móvil */}
            <div className="px-4 mt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="text-white text-sm mb-2">Hola, {user.nombre}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-uf-red text-white font-bold py-2 px-4 rounded"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/registro"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center bg-uf-gold text-black font-bold py-2 px-4 rounded"
                  >
                    Crear Cuenta
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;