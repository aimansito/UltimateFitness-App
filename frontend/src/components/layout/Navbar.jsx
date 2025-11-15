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
    <nav className="bg-black border-b border-uf-gold/20 sticky top-0 z-50 shadow-xl">
      <div className="w-full px-6">

        {/* ========================================== */}
        {/* VERSIÓN DESKTOP (pantallas grandes)         */}
        {/* ========================================== */}
        <div className="hidden md:flex justify-between items-center h-20">

          {/* -------------------- IZQUIERDA: Logo + Separador + Menú -------------------- */}
          <div className="flex items-center space-x-6">

            {/* LOGO - Pegado a la izquierda */}
            <Link to="/" className="flex-shrink-0">
              <img
                src={isPremium ? "/logos/logo-premium.png" : "/logos/logo.png"}
                alt="Ultimate Fitness"
                className="h-14 hover:opacity-80 transition duration-300"
                onError={(e) => {
                  // Si la imagen no carga, muestra texto alternativo
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              {/* Texto de respaldo si no hay logo */}
              <span className="hidden text-uf-gold font-bold text-xl uppercase tracking-wider">
                💪 UF
              </span>
            </Link>

            {/* SEPARADOR VERTICAL entre logo y menú */}
            <div className="h-10 w-px bg-uf-gold/30"></div>

            {/* MENÚ DE NAVEGACIÓN - Pegado al separador */}
            <div className="flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <div key={index} className="relative">

                  {/* Si NO tiene submenú - Link normal */}
                  {!link.hasSubmenu ? (
                    <Link
                      to={link.path}
                      className={`
                        font-bold text-xs uppercase tracking-widest pb-1 border-b-2 transition-all duration-300
                        ${isActive(link.path)
                          ? 'text-uf-gold border-uf-gold' // Activo: dorado
                          : 'text-white border-transparent hover:text-uf-gold hover:border-uf-gold' // Inactivo: blanco
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    /* Si TIENE submenú - Botón con flecha (SE ABRE AL HACER CLICK) */
                    <>
                      <button
                        onClick={() => setEntrenamientosOpen(!entrenamientosOpen)} // CLICK para abrir/cerrar
                        className="font-bold text-xs uppercase tracking-widest pb-1 border-b-2 text-white border-transparent hover:text-uf-gold hover:border-uf-gold transition-all duration-300 inline-flex items-baseline space-x-1"
                      >
                        <span>{link.label}</span>
                        {/* Flecha que rota cuando está abierto */}
                        <svg
                          className={`w-3 h-3 transition-transform duration-300 ${entrenamientosOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* SUBMENÚ DESPLEGABLE - Solo aparece al hacer CLICK */}
                      {entrenamientosOpen && (
                        <div
                          className="absolute left-0 top-full mt-2 w-44 bg-uf-dark border-2 border-uf-gold rounded-lg shadow-2xl overflow-hidden z-50"
                        >
                          {link.submenu.map((sublink, subIndex) => (
                            <Link
                              key={subIndex}
                              to={sublink.path}
                              onClick={() => setEntrenamientosOpen(false)} // Cierra al hacer click en opción
                              className="block px-4 py-3 text-white hover:bg-uf-gold hover:text-black transition-all duration-300 font-semibold text-sm"
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

          {/* -------------------- DERECHA: Usuario pegado al borde -------------------- */}
          <div className="flex items-center space-x-4">

            {/* BADGE PREMIUM - Solo si el usuario es premium */}
            {isPremium && <Badge type="premium" text="PREMIUM" icon="👑" />}

            {/* SI ESTÁ LOGUEADO - Muestra nombre y botón cerrar sesión */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Saludo personalizado */}
                <span className="text-white font-semibold text-sm">
                  Hola, {user.nombre}
                </span>

                {/* Botón Dashboard */}
                <Link
                  to="/dashboard"
                  className="text-uf-gold hover:text-uf-blue transition-all duration-300 transform hover:scale-110"
                  title="Mi Dashboard"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </Link>

                {/* Botón Cerrar Sesión */}
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
              /* SI NO ESTÁ LOGUEADO - Muestra botones de iniciar sesión y crear cuenta */
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
        {/* VERSIÓN MÓVIL (pantallas pequeñas)         */}
        {/* ========================================== */}
        <div className="md:hidden flex justify-between items-center h-20">

          {/* Hamburguesa izquierda */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-uf-gold hover:text-uf-blue transition-all duration-300"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo centro */}
          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src={isPremium ? "/logos/logo-premium.png" : "/logos/logo.png"}
              alt="Ultimate Fitness"
              className="h-12 hover:opacity-80 transition"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="hidden text-uf-gold font-bold text-lg uppercase">💪 UF</span>
          </Link>

          {/* Usuario derecha */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="text-uf-gold hover:text-uf-blue transition-all duration-300"
            >
              <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Dropdown Usuario Móvil */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-uf-dark border-2 border-uf-gold rounded-lg shadow-2xl overflow-hidden z-50">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 bg-uf-gold/10 border-b border-uf-gold/30">
                      <p className="text-white font-semibold">Hola, {user.nombre}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="block px-4 py-3 text-white hover:bg-uf-gold hover:text-black transition">
                      📊 Dashboard
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-uf-red hover:bg-uf-red hover:text-white transition border-t border-uf-gold/30">
                      🚪 Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setUserMenuOpen(false)} className="block px-4 py-3 text-white hover:bg-uf-gold hover:text-black transition">
                      🔑 Iniciar Sesión
                    </Link>
                    <Link to="/registro" onClick={() => setUserMenuOpen(false)} className="block px-4 py-3 text-white hover:bg-uf-gold hover:text-black transition">
                      ✨ Crear Cuenta
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Menú desplegable móvil */}
        {menuOpen && (
          <div className="md:hidden border-t border-uf-gold/30 py-4 space-y-2">
            {navLinks.map((link, index) => (
              <div key={index}>
                {!link.hasSubmenu ? (
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-bold uppercase text-sm transition ${isActive(link.path) ? 'bg-uf-gold text-black' : 'text-white hover:bg-uf-gold/20'
                      }`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => setEntrenamientosOpen(!entrenamientosOpen)}
                      className="w-full text-left px-4 py-3 rounded-lg font-bold uppercase text-sm text-white hover:bg-uf-gold/20 transition flex justify-between items-center"
                    >
                      <span>{link.label}</span>
                      <svg className={`w-4 h-4 transition-transform ${entrenamientosOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {entrenamientosOpen && (
                      <div className="ml-4 space-y-1">
                        {link.submenu.map((sublink, subIndex) => (
                          <Link
                            key={subIndex}
                            to={sublink.path}
                            onClick={() => {
                              setMenuOpen(false);
                              setEntrenamientosOpen(false);
                            }}
                            className="block px-4 py-2 text-sm text-gray-300 hover:text-uf-gold transition"
                          >
                            → {sublink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;