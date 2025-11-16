// ============================================
// IMPORTS - Librerías y componentes necesarios
// ============================================
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Para navegación entre páginas
import { useState } from 'react'; // Para manejar estados (menús abiertos/cerrados)
import { useAuth } from '../../context/AuthContext'; // Para saber si hay usuario logueado
import Badge from '../common/Badge'; // Componente para mostrar "PREMIUM"

function Navbar() {
  // ============================================
  // HOOKS - Funcionalidades de React
  // ============================================
  const location = useLocation(); // Para saber en qué página estamos
  const navigate = useNavigate(); // Para redirigir a otras páginas
  const { user, logout, isPremium, isAuthenticated } = useAuth(); // Datos del usuario logueado

  // ============================================
  // ESTADOS - Variables que cambian (abrir/cerrar menús)
  // ============================================
  const [menuOpen, setMenuOpen] = useState(false); // Menú hamburguesa móvil (true/false)
  const [userMenuOpen, setUserMenuOpen] = useState(false); // Menú desplegable de usuario
  const [entrenamientosOpen, setEntrenamientosOpen] = useState(false); // Submenú "Entrenamientos"

  // ============================================
  // FUNCIONES - Acciones que puede hacer el usuario
  // ============================================

  // Verifica si estamos en una ruta específica (para resaltar el menú activo)
  const isActive = (path) => location.pathname === path;

  // Función para cerrar sesión
  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    setUserMenuOpen(false); // Cierra el menú de usuario
    navigate('/'); // Redirige al home
  };

  // ============================================
  // DATOS - Links del menú principal
  // ============================================
  const navLinks = [
    { path: '/', label: 'Inicio', hasSubmenu: false },
    { path: '/servicios', label: 'Servicios', hasSubmenu: false },
    // Este tiene submenú - SE ABRE SOLO AL HACER CLICK (no automáticamente)
    {
      label: 'Entrenamientos',
      hasSubmenu: true,
      submenu: [
        { path: '/gym', label: 'Gym' },
        { path: '/workout', label: 'Workout' }
      ]
    },
    { path: '/alimentacion', label: 'Alimentación', hasSubmenu: false },
    { path: '/blog', label: 'Blog', hasSubmenu: false },
    { path: '/contacto', label: 'Contacto', hasSubmenu: false },
  ];

  // ============================================
  // RENDERIZADO - Lo que se muestra en pantalla
  // ============================================
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

            {/* SEPARADOR VERTICAL - Cambia a rojo si es premium */}
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
                            ? 'text-uf-red border-uf-red'  // PREMIUM: rojo
                            : 'text-uf-gold border-uf-gold' // NORMAL: dorado
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

        {/* VERSIÓN MÓVIL - igual que antes */}
        {/* ... resto del código móvil ... */}

      </div>
    </nav>
  );
}

export default Navbar;