// ============================================
// IMPORTS - Librerías y componentes necesarios
// ============================================
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import useAuthEntrenador from "../../context/AuthContextEntrenador";
import Badge from "../common/Badge";
import {
  Dumbbell,
  Utensils,
  Activity,
  Sparkles,
  Calendar,
  Pill,
  Settings,
  User,
  CreditCard,
  Star,
  Shield,
  LogOut,
} from "lucide-react";

function Navbar() {
  // ============================================
  // HOOKS
  // ============================================
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout, isPremium, isAuthenticated } = useAuth();

  // FIX 1 → Nombres correctos del contexto entrenador
  const {
    entrenador,
    login,
    logout: logoutEntrenador,
    isAuthenticated: isAuthenticatedEntrenador,
  } = useAuthEntrenador();

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

  // FIX 2 → logout correcto según tipo de usuario
  const handleLogout = () => {
    // Cerrar todos los menús para evitar que se quede "pillado" en mobile
    setMenuOpen(false);
    setUserMenuOpen(false);
    setEntrenamientosOpen(false);
    setAlimentacionOpen(false);

    if (isAuthenticatedEntrenador) {
      logoutEntrenador();
      navigate("/entrenador/login");
      return;
    }

    // Para usuarios normales, el contexto ya maneja la navegación a /login
    logout();
  };

  // FIX 3 → menú correcto para entrenador
  const getUserMenuItems = () => {
    const commonItems = [
      { label: "Mis Datos Personales", path: "/perfil/datos", icon: User },
    ];

    // ENTRENADOR
    if (entrenador) {
      return [
        { label: "Panel de Entrenador", path: "/entrenador/dashboard", icon: Activity },
        { label: "Mis Platos", path: "/entrenador/mis-platos", icon: Utensils },
        { label: "Mis Dietas", path: "/entrenador/mis-dietas", icon: Calendar },
        ...commonItems,
      ];
    }

    // ADMIN
    if (user?.rol === "admin") {
      return [
        { label: "Panel Admin", path: "/admin/dashboard", icon: Settings },
        ...commonItems,
      ];
    }

    // PREMIUM
    if (isPremium && user?.rol !== "admin") {
      return [
        { label: "Mi Panel", path: "/dashboard", icon: Activity },
        { label: "Mis Entrenamientos", path: "/mis-entrenamientos", icon: Dumbbell },
        { label: "Mis Dietas", path: "/mis-dietas", icon: Utensils },
        { label: "Mi Suscripción", path: "/mi-suscripcion", icon: CreditCard },
        ...commonItems,
      ];
    }

    // GRATUITO
    return [
      { label: "Mi Panel", path: "/dashboard", icon: Activity },
      { label: "Mis Dietas", path: "/mis-dietas", icon: Utensils },
      { label: "Hazte Premium", path: "/upgrade-premium", icon: Star },
      ...commonItems,
    ];
  };

  const shouldShowPremiumBadge = () => {
    if (entrenador) return false;
    return isPremium;
  };

  const getUserButtonColor = () => {
    if (entrenador)
      return "bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900";
    if (isPremium)
      return "bg-gradient-to-r from-uf-red to-red-700 text-white hover:from-red-700 hover:to-uf-red";
    return "bg-gradient-to-r from-uf-gold to-yellow-600 text-black hover:from-yellow-600 hover:to-uf-gold";
  };

  // ============================================
  // SUBMENÚS
  // ============================================
  const getAlimentacionSubmenu = () => {
    if (!isAuthenticated && !isAuthenticatedEntrenador) {
      return [{ path: "/alimentacion", label: "Dietas Profesionales", icon: Utensils }];
    }

    const menuItems = [
      { path: "/mis-dietas?tab=publicas", label: "Dietas Públicas", icon: Utensils },
    ];

    if (isPremium) {
      menuItems.unshift(
        { path: "/mis-dietas?tab=asignadas", label: "Dietas Asignadas", icon: User },
        { path: "/mis-dietas?tab=creadas", label: "Historial de Dietas", icon: Calendar }
      );
    }

    return menuItems;
  };

  const getEntrenamientosSubmenu = () => {
    const menuItems = [
      { path: "/gym", label: "Gym", icon: Dumbbell },
      { path: "/workout", label: "Workout", icon: Activity },
    ];

    if (isPremium && !entrenador) {
      menuItems.push({
        path: "/crear-entrenamiento",
        label: "Crear Mi Entrenamiento",
        icon: Sparkles,
      });
    }

    return menuItems;
  };

  const navLinks = [
    { path: "/", label: "INICIO", hasSubmenu: false },
    { path: "/servicios", label: "SERVICIOS", hasSubmenu: false },
    {
      label: "ENTRENAMIENTOS",
      hasSubmenu: true,
      submenu: getEntrenamientosSubmenu(),
    },
    {
      label: "ALIMENTACIÓN",
      hasSubmenu: true,
      submenu: getAlimentacionSubmenu(),
    },
    { path: "/blog", label: "BLOG", hasSubmenu: false },
    { path: "/contacto", label: "CONTACTO", hasSubmenu: false },
  ];

  // ============================================
  // RENDER HELPERS
  // ============================================
  // ============================================
  // RENDER HELPERS
  // ============================================
  const renderUserDropdown = () => (
    <div
      className={`absolute right-0 mt-2 w-64 bg-uf-dark rounded-lg shadow-2xl border-2 overflow-hidden z-50 ${isPremium ? "border-uf-red" : "border-uf-gold"
        }`}
    >
      {(isAuthenticated || isAuthenticatedEntrenador) ? (
        // CONTENIDO PARA USUARIOS LOGUEADOS
        <>
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Conectado como</p>

            <p className="text-white font-semibold truncate mt-1">
              {entrenador?.email || user?.email}
            </p>

            {entrenador && (
              <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded uppercase">
                <Activity className="w-3 h-3" />
                ENTRENADOR
              </span>
            )}
          </div>

          {getUserMenuItems().map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setUserMenuOpen(false)}
              className={`
                flex items-center space-x-3 px-4 py-3 text-white transition-all duration-200
                ${isPremium
                  ? "hover:bg-uf-red/20 hover:text-uf-red"
                  : "hover:bg-uf-gold/20 hover:text-uf-gold"
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-semibold text-sm">{item.label}</span>
            </Link>
          ))}

          <div className="border-t border-gray-700">
            <button
              onMouseDown={(e) => {
                e.preventDefault(); // Evitar que el botón pierda foco demasiado pronto
                setUserMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </>
      ) : (
        // CONTENIDO PARA VISITANTES (NO LOGUEADOS)
        <div className="p-2 space-y-2">
          <Link
            to="/login"
            onClick={() => setUserMenuOpen(false)}
            className="flex items-center justify-center space-x-3 px-4 py-3 font-bold text-white hover:bg-gray-700 rounded transition-colors"
          >
            <span>Iniciar Sesión</span>
          </Link>
          <Link
            to="/register"
            onClick={() => setUserMenuOpen(false)}
            className="flex items-center justify-center space-x-3 px-4 py-3 font-bold bg-uf-gold text-black rounded hover:bg-yellow-600 transition-colors"
          >
            <span>Crear Cuenta</span>
          </Link>
        </div>
      )}
    </div>
  );

  // ============================================
  // RETORNO JSX (DISEÑO INTACTO)
  // ============================================
  return (
    <nav
      className={`border-b sticky top-0 z-50 shadow-xl ${isPremium ? "bg-black border-uf-red/30" : "bg-black border-uf-gold/20"
        }`}
    >
      <div className="w-full px-6">
        {/* ========================================== */}
        {/* VERSIÓN DESKTOP (>1024px) */}
        {/* ========================================== */}
        <div className="hidden lg:flex justify-between items-center h-20">
          {/* IZQUIERDA */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex-shrink-0">
              <img
                src={isPremium ? "/logos/logo-premium.png" : "/logos/logo.png"}
                alt="Ultimate Fitness"
                className="h-14 hover:opacity-80 transition duration-300"
              />
            </Link>

            <div
              className={`h-10 w-px ${isPremium ? "bg-uf-red/50" : "bg-uf-gold/30"
                }`}
            ></div>

            {/* MENÚ */}
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
                          } else {
                            setAlimentacionOpen(!alimentacionOpen);
                            setEntrenamientosOpen(false);
                          }
                        }}
                        className={`
                          font-audiowide font-bold text-xs uppercase tracking-widest pb-1 border-b-2 transition-all duration-300
                          ${isPremium
                            ? "text-white border-transparent hover:text-uf-red hover:border-uf-red"
                            : "text-white border-transparent hover:text-uf-gold hover:border-uf-gold"
                          }
                        `}
                      >
                        {link.label}
                        <svg
                          className={`w-3 h-3 ml-1 inline transition-transform duration-300 ${(link.label === "ENTRENAMIENTOS" &&
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
                            className={`absolute left-0 top-full mt-2 w-52 bg-uf-dark border-2 rounded-lg shadow-2xl overflow-hidden z-50 ${isPremium ? "border-uf-red" : "border-uf-gold"
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
                                className={`
                                flex items-center gap-2 px-4 py-3 text-white transition-all duration-300 font-semibold text-sm
                                ${isPremium
                                    ? "hover:bg-uf-red hover:text-white"
                                    : "hover:bg-uf-gold hover:text-black"
                                  }
                              `}
                              >
                                <sublink.icon className="w-4 h-4" />
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

          {/* DERECHA */}
          <div className="flex items-center space-x-4">
            {shouldShowPremiumBadge() && <Badge type="premium" text="PREMIUM" />}

            {(isAuthenticated || isAuthenticatedEntrenador) ? (
              <div className="flex items-center space-x-4">
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${getUserButtonColor()}`}
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm">
                      {entrenador?.nombre || user?.nombre || "Usuario"}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${userMenuOpen ? "rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {userMenuOpen && renderUserDropdown()}
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
                  to="/register"
                  className="bg-uf-gold text-black font-bold px-5 py-2 rounded uppercase text-xs hover:bg-uf-blue hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Crear Cuenta
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* VERSIÓN MOBILE */}
        {/* ========================================== */}
        <div className="lg:hidden flex justify-between items-center h-16 relative">
          {/* 1. HAMBURGUESA (IZQUIERDA) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* 2. LOGO (CENTRO ABSOLUTO) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 z-0">
            <Link to="/">
              <img
                src={isPremium ? "/logos/logo-premium.png" : "/logos/logo.png"}
                alt="Ultimate Fitness"
                className="h-12"
              />
            </Link>
          </div>

          {/* 3. ICONO USUARIO (DERECHA) - SIEMPRE VISIBLE */}
          <div className="flex items-center space-x-3 z-10">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`${(isAuthenticated || isAuthenticatedEntrenador)
                ? "text-uf-gold"
                : "text-white"
                } focus:outline-none flex items-center p-2`}
            >
              <User className="w-7 h-7" />
            </button>
            {userMenuOpen && (
              <div className="absolute top-full right-0 mt-2 z-50">
                {renderUserDropdown()}
              </div>
            )}
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-uf-dark border-t-2 border-uf-gold/30 py-4">
            {navLinks.map((link, index) => (
              <div key={index}>
                {!link.hasSubmenu ? (
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 text-white font-bold hover:bg-uf-gold hover:text-black transition ${isActive(link.path) ? "bg-uf-gold/20 text-uf-gold" : ""
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
                        } else {
                          setAlimentacionOpen(!alimentacionOpen);
                          setEntrenamientosOpen(false);
                        }
                      }}
                      className="w-full text-left px-4 py-3 text-white font-bold hover:bg-uf-gold hover:text-black transition flex justify-between items-center"
                    >
                      {link.label}
                      <svg className={`w-4 h-4 transition-transform ${(link.label === "ENTRENAMIENTOS" && entrenamientosOpen) ||
                        (link.label === "ALIMENTACIÓN" && alimentacionOpen)
                        ? "rotate-180"
                        : ""
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                              <sublink.icon className="w-4 h-4" />
                              {sublink.label}
                            </Link>
                          ))}
                        </div>
                      )}
                  </>
                )}
              </div>
            ))}

            {/* SECCIÓN AUTH ELIMINADA DEL CONTENIDO HAMBURGUESA - MOVIDA AL ICONO DE USUARIO */}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
