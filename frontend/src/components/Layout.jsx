import { Link, useLocation } from "react-router-dom";

function Layout({ children, showNavbar = true }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("usuario") || "{}");
  const isPremium = user.esPremium;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-uf-darker bg-metal-texture">
      {showNavbar && (
        <nav className="bg-black border-b border-uf-gold/20 sticky top-0 z-50 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <Link to="/" className="flex-shrink-0">
                <img
                  src={isPremium ? "/logo-premium.png" : "/logo-small.png"}
                  alt="Ultimate Fitness"
                  className="h-14 hover:opacity-80 transition"
                />
              </Link>

              {/* Menu Principal */}
              <div className="hidden md:flex items-center space-x-10">
                <Link
                  to="/"
                  className={`font-bold text-sm uppercase tracking-widest pb-1 border-b-2 transition-all ${
                    isActive("/")
                      ? "text-uf-gold border-uf-gold"
                      : "text-white border-transparent hover:text-uf-gold hover:border-uf-gold"
                  }`}
                >
                  Inicio
                </Link>

                <Link
                  to="/servicios"
                  className={`font-bold text-sm uppercase tracking-widest pb-1 border-b-2 transition-all ${
                    isActive("/servicios")
                      ? "text-uf-gold border-uf-gold"
                      : "text-white border-transparent hover:text-uf-gold hover:border-uf-gold"
                  }`}
                >
                  Servicios
                </Link>

                {/* Menú Entrenamiento con Submenu */}
                <div className="relative group">
                  <Link
                    to="/gym"
                    className={`font-bold text-sm uppercase tracking-widest pb-1 border-b-2 transition-all ${
                      isActive("/gym") ||
                      isActive("/workout") ||
                      isActive("/entrenamiento")
                        ? "text-uf-gold border-uf-gold"
                        : "text-white border-transparent hover:text-uf-gold hover:border-uf-gold"
                    }`}
                  >
                    Entrenamiento
                  </Link>

                  {/* Submenu */}
                  <div className="absolute top-full left-0 mt-2 w-48 bg-uf-dark border-2 border-uf-gold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-xl">
                    <Link
                      to="/gym"
                      className="block px-6 py-3 text-white hover:bg-uf-gold hover:text-black font-semibold uppercase text-sm transition"
                    >
                      🏋️ Gym
                    </Link>
                    <Link
                      to="/workout"
                      className="block px-6 py-3 text-white hover:bg-uf-gold hover:text-black font-semibold uppercase text-sm transition"
                    >
                      💪 Workout
                    </Link>
                  </div>
                </div>

                <Link
                  to="/blog"
                  className={`font-bold text-sm uppercase tracking-widest pb-1 border-b-2 transition-all ${
                    isActive("/blog")
                      ? "text-uf-gold border-uf-gold"
                      : "text-white border-transparent hover:text-uf-gold hover:border-uf-gold"
                  }`}
                >
                  Blog
                </Link>

                <Link
                  to="/contacto"
                  className={`font-bold text-sm uppercase tracking-widest pb-1 border-b-2 transition-all ${
                    isActive("/contacto")
                      ? "text-uf-gold border-uf-gold"
                      : "text-white border-transparent hover:text-uf-gold hover:border-uf-gold"
                  }`}
                >
                  Contacto
                </Link>
              </div>

              {/* Botones de acción derecha */}
              <div className="flex items-center space-x-4">
                {isPremium && (
                  <span className="bg-gradient-to-r from-uf-red to-red-600 text-white px-4 py-2 rounded font-bold text-xs uppercase tracking-wider flex items-center shadow-lg">
                    👑 PREMIUM
                  </span>
                )}

                {user.nombre ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-white font-semibold">
                      {user.nombre}
                    </span>
                    <Link
                      to="/perfil"
                      className="text-uf-gold hover:text-uf-blue transition"
                    >
                      <svg
                        className="w-8 h-8"
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
                    <button
                      onClick={() => {
                        localStorage.removeItem("usuario");
                        window.location.href = "/";
                      }}
                      className="text-gray-400 hover:text-uf-red transition"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-white font-bold text-sm uppercase tracking-wider hover:text-uf-gold transition"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/registro"
                      className="bg-uf-gold hover:bg-uf-blue text-black font-bold px-6 py-2 rounded uppercase text-sm tracking-wider transition transform hover:scale-105 shadow-lg"
                    >
                      Crear Cuenta
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      {children}

      {/* Footer */}
      <footer className="bg-black border-t border-uf-gold/30 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <img
              src="/logo.png"
              alt="Ultimate Fitness"
              className="h-16 mb-4 md:mb-0"
            />
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-uf-gold transition">
                Política de privacidad
              </a>
              <a href="#" className="hover:text-uf-gold transition">
                Términos y condiciones
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
