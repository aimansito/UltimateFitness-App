// ============================================
// IMPORTS - Librerías y componentes necesarios
// ============================================
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import Badge from "../common/Badge";
import {
  Dumbbell,
  Utensils,
  Activity,
  Sparkles,
  Calendar,
  Pill,
} from "lucide-react";

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
  const [alimentacionOpen, setAlimentacionOpen] = useState(false);
  const userMenuRef = useRef(null);

  // ============================================
  // EFECTOS
  // ============================================
  // Cerrar menú de usuario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ============================================
  // FUNCIONES
  // ============================================
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  // Determinar qué opciones mostrar según el rol
  const getUserMenuItems = () => {
    const commonItems = [
      { label: "Mis Datos Personales", path: "/perfil/datos", icon: "👤" },
    ];

    if (user?.rol === "admin") {
      return [
        { label: "Panel Admin", path: "/admin/dashboard", icon: "⚙️" },
        ...commonItems,
      ];
    }

    if (isPremium) {
      return [
        {
          label: "Mis Entrenamientos",
          path: "/mis-entrenamientos",
          icon: "💪",
        },
        { label: "Mi Dieta", path: "/mi-dieta", icon: "🥗" },
        { label: "Mi Suscripción", path: "/mi-suscripcion", icon: "💳" },
        ...commonItems,
      ];
    }

    // Usuario gratuito
    return [
      { label: "Ver Planes", path: "/planes", icon: "⭐" },
      ...commonItems,
    ];
  };

  // ============================================
  // DATOS - Links del menú
  // ============================================
  const navLinks = [
    { path: "/", label: "INICIO", hasSubmenu: false },
    { path: "/servicios", label: "SERVICIOS", hasSubmenu: false },
    {
      label: "ENTRENAMIENTOS",
      hasSubmenu: true,
      submenu: [
        { path: "/gym", label: "Gym", icon: Dumbbell },
        { path: "/workout", label: "Workout", icon: Activity },
      ],
    },
    {
      label: "ALIMENTACIÓN",
      hasSubmenu: true,
      submenu: [
        { path: "/alimentacion", label: "Dietas", icon: Utensils },
        { path: "/crear-dieta", label: "Crear Mi Dieta", icon: Sparkles },
        { path: "/mi-plan-semanal", label: "Plan Semanal", icon: Calendar },
        { path: "/suplementos", label: "Suplementos", icon: Pill },
      ],
    },
    { path: "/blog", label: "BLOG", hasSubmenu: false },
    { path: "/contacto", label: "CONTACTO", hasSubmenu: false },
  ];

  return (
    <nav
      className={`border-b sticky top-0 z-50 shadow-xl ${
        isPremium ? "bg-black border-uf-red/30" : "bg-black border-uf-gold/20"
      }`}
    >
      <div className="w-full px-6">
        {/* ========================================== */}
        {/* VERSIÓN DESKTOP (>1024px) */}
        {/* ========================================== */}
        <div className="hidden lg:flex justify-between items-center h-20">
          {/* IZQUIERDA: Logo + Separador + Menú */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src={isPremium ? "/logos/logo-premium.png" : "/logos/logo.png"}
                alt="Ultimate Fitness"
                className="h-14 hover:opacity-80 transition duration-300"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <span className="hidden font-audiowide text-uf-gold font-bold text-xl uppercase tracking-wider items-center gap-2">
                <Dumbbell className="w-5 h-5" /> UF
              </span>
            </Link>

            {/* SEPARADOR VERTICAL */}
            <div
              className={`h-10 w-px ${
                isPremium ? "bg-uf-red/50" : "bg-uf-gold/30"
              }`}
            ></div>

            {/* MENÚ DE NAVEGACIÓN */}
            <div className="flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <div key={index} className="relative">
                  {!link.hasSubmenu ? (
                    <Link
                      to={link.path}
                      className={`
                        font-audiowide font-bold text-xs uppercase tracking-widest pb-1 border-b-2 transition-all duration-300
                        ${
                          isActive(link.path)
                            ? isPremium
                              ? "text-uf-red border-uf-red"
                              : "text-uf-gold border-uf-gold"
                            : isPremium
                            ? "text-white border-transparent hover:text-uf-red hover:border-uf-red"
                            : "text-white border-transparent hover:text-uf-gold hover:border-uf-gold"
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          if (link.label === "ENTRENAMIENTOS") {
                            setEntrenamientosOpen(!entrenamientosOpen);
                            setAlimentacionOpen(false);
                          } else if (link.label === "ALIMENTACIÓN") {
                            setAlimentacionOpen(!alimentacionOpen);
                            setEntrenamientosOpen(false);
                          }
                        }}
                        className={`
                          font-audiowide font-bold text-xs uppercase tracking-widest pb-1 border-b-2 transition-all duration-300
                          ${
                            isPremium
                              ? "text-white border-transparent hover:text-uf-red hover:border-uf-red"
                              : "text-white border-transparent hover:text-uf-gold hover:border-uf-gold"
                          }
                        `}
                      >
                        {link.label}
                        <svg
                          className={`w-3 h-3 ml-1 inline transition-transform duration-300 ${
                            (link.label === "ENTRENAMIENTOS" &&
                              entrenamientosOpen) ||
                            (link.label === "ALIMENTACIÓN" && alimentacionOpen)
                              ? "rotate-180"
                              : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {((link.label === "ENTRENAMIENTOS" &&
                        entrenamientosOpen) ||
                        (link.label === "ALIMENTACIÓN" &&
                          alimentacionOpen)) && (
                        <div
                          className={`absolute left-0 top-full mt-2 w-52 bg-uf-dark border-2 rounded-lg shadow-2xl overflow-hidden z-50 ${
                            isPremium ? "border-uf-red" : "border-uf-gold"
                          }`}
                        >
                          {link.submenu.map((sublink, subIndex) => (
                            <Link
                              key={subIndex}
                              to={sublink.path}
                              onClick={() => {
                                setEntrenamientosOpen(false);
                                setAlimentacionOpen(false);
                              }}
                              className={`flex items-center gap-2 px-4 py-3 text-white transition-all duration-300 font-semibold text-sm ${
                                isPremium
                                  ? "hover:bg-uf-red hover:text-white"
                                  : "hover:bg-uf-gold hover:text-black"
                              }`}
                            >
                              {sublink.icon && (
                                <sublink.icon className="w-4 h-4" />
                              )}
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
            {isPremium && <Badge type="premium" text="PREMIUM" />}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* MENÚ DESPLEGABLE DE USUARIO */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isPremium
                        ? "bg-gradient-to-r from-uf-red to-red-700 text-white hover:from-red-700 hover:to-uf-red"
                        : "bg-gradient-to-r from-uf-gold to-yellow-600 text-black hover:from-yellow-600 hover:to-uf-gold"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">{user?.nombre || "Usuario"}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* DROPDOWN MENÚ */}
                  {userMenuOpen && (
                    <div
                      className={`absolute right-0 mt-2 w-64 bg-uf-dark rounded-lg shadow-2xl border-2 overflow-hidden z-50 ${
                        isPremium ? "border-uf-red" : "border-uf-gold"
                      }`}
                    >
                      {/* INFO USUARIO */}
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                          Conectado como
                        </p>
                        <p className="text-white font-semibold truncate mt-1">
                          {user?.email}
                        </p>
                        {isPremium && (
                          <span className="inline-block mt-2 px-2 py-1 bg-gradient-to-r from-uf-red to-red-700 text-white text-xs font-bold rounded uppercase">
                            ⭐ PREMIUM
                          </span>
                        )}
                        {user?.rol === "admin" && (
                          <span className="inline-block mt-2 ml-2 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded uppercase">
                            🔧 ADMIN
                          </span>
                        )}
                      </div>

                      {/* OPCIONES DEL MENÚ */}
                      {getUserMenuItems().map((item, index) => (
                        <Link
                          key={index}
                          to={item.path}
                          onClick={() => setUserMenuOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 text-white transition-all duration-200 ${
                            isPremium
                              ? "hover:bg-uf-red/20 hover:text-uf-red"
                              : "hover:bg-uf-gold/20 hover:text-uf-gold"
                          }`}
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span className="font-semibold text-sm">
                            {item.label}
                          </span>
                        </Link>
                      ))}

                      {/* CERRAR SESIÓN */}
                      <div className="border-t border-gray-700">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200"
                        >
                          <span className="text-xl">🚪</span>
                          <span className="font-semibold text-sm">
                            Cerrar Sesión
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
        {/* VERSIÓN MÓVIL Y TABLET (<1024px) */}
        {/* ========================================== */}
        <div className="lg:hidden flex justify-between items-center h-16">
          {/* Logo móvil */}
          <Link to="/">
            <img
              src={isPremium ? "/logos/logo-premium.png" : "/logos/logo.png"}
              alt="Ultimate Fitness"
              className="h-12"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <span className="hidden font-audiowide text-uf-gold font-bold text-lg uppercase items-center gap-2">
              <Dumbbell className="w-5 h-5" /> UF
            </span>
          </Link>

          {/* Usuario móvil */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && (
              <Link to="/dashboard" className="text-uf-gold">
                <svg
                  className="w-7 h-7"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            )}

            {/* Hamburguesa */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {menuOpen && (
          <div className="lg:hidden bg-uf-dark border-t-2 border-uf-gold/30 py-4">
            {navLinks.map((link, index) => (
              <div key={index}>
                {!link.hasSubmenu ? (
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 text-white font-bold hover:bg-uf-gold hover:text-black transition ${
                      isActive(link.path) ? "bg-uf-gold/20 text-uf-gold" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        if (link.label === "ENTRENAMIENTOS") {
                          setEntrenamientosOpen(!entrenamientosOpen);
                          setAlimentacionOpen(false);
                        } else if (link.label === "ALIMENTACIÓN") {
                          setAlimentacionOpen(!alimentacionOpen);
                          setEntrenamientosOpen(false);
                        }
                      }}
                      className="w-full text-left px-4 py-3 text-white font-bold hover:bg-uf-gold hover:text-black transition flex justify-between items-center"
                    >
                      {link.label}
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          (link.label === "ENTRENAMIENTOS" &&
                            entrenamientosOpen) ||
                          (link.label === "ALIMENTACIÓN" && alimentacionOpen)
                            ? "rotate-180"
                            : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {((link.label === "ENTRENAMIENTOS" && entrenamientosOpen) ||
                      (link.label === "ALIMENTACIÓN" && alimentacionOpen)) && (
                      <div className="bg-uf-darker">
                        {link.submenu.map((sublink, subIndex) => (
                          <Link
                            key={subIndex}
                            to={sublink.path}
                            onClick={() => {
                              setMenuOpen(false);
                              setEntrenamientosOpen(false);
                              setAlimentacionOpen(false);
                            }}
                            className="flex items-center gap-2 px-8 py-2 text-gray-300 hover:text-uf-gold transition"
                          >
                            {sublink.icon && (
                              <sublink.icon className="w-4 h-4" />
                            )}
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
                  <div className="text-white text-sm mb-3 pb-3 border-b border-gray-700">
                    <p className="text-gray-400 text-xs">Conectado como</p>
                    <p className="font-semibold">{user?.nombre}</p>
                    {isPremium && (
                      <span className="text-uf-red text-xs">⭐ PREMIUM</span>
                    )}
                  </div>

                  {/* Opciones móvil */}
                  {getUserMenuItems().map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className="block w-full text-left text-white font-semibold py-2 px-4 rounded hover:bg-uf-gold hover:text-black transition"
                    >
                      {item.icon} {item.label}
                    </Link>
                  ))}

                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full bg-uf-red text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/registro"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center bg-uf-gold text-black font-bold py-2 px-4 rounded hover:bg-yellow-600 transition"
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
