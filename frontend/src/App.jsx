import { lazy, Suspense } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { ENTRENADORES, PAGOS } from "./config/funciones";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { ProtectedRoute } from "./components/common";
import ScrollToTop from "./components/common/ScrollToTop";
import ProtectedRouteEntrenador from "./components/ProtectedRouteEntrenador";
import { ToastProvider } from "./context/ToastContext";

// Páginas públicas
import Login from "./pages/public/Login";
const LoginEntrenador = lazy(() => import("./pages/entrenador/LoginEntrenador"));
import Register from "./pages/public/Register";
const UpgradePremium = lazy(() => import("./pages/public/UpgradePremium"));
import Home from "./pages/public/Home";
const Servicios = lazy(() => import("./pages/public/Servicios"));
const Contacto = lazy(() => import("./pages/public/Contacto"));
const Gym = lazy(() => import("./pages/public/Gym"));
const Workout = lazy(() => import("./pages/public/Workout"));
const Alimentacion = lazy(() => import("./pages/public/Alimentacion"));
const DetalleDietaPublica = lazy(() => import("./pages/public/DetalleDieta"));
const CrearDieta = lazy(() => import("./pages/public/CrearDieta"));
const Suplementos = lazy(() => import("./pages/public/Suplementos"));
const Blog = lazy(() => import("./pages/public/Blog"));
const BlogPost = lazy(() => import("./pages/public/BlogPost"));
const DetallePlato = lazy(() => import("./pages/public/DetallePlato"));
const PoliticaPrivacidad = lazy(() => import("./pages/public/PoliticaPrivacidad"));
const AvisoLegal = lazy(() => import("./pages/public/AvisoLegal"));
const TerminosCondiciones = lazy(() => import("./pages/public/TerminosCondiciones"));
const PoliticaCookies = lazy(() => import("./pages/public/PoliticaCookies"));
const RecuperarPassword = lazy(() => import("./pages/public/RecuperarPassword"));
const RestablecerPassword = lazy(() => import("./pages/public/RestablecerPassword"));
const VerificarEmail = lazy(() => import("./pages/public/VerificarEmail"));
const PerfilPublico = lazy(() => import("./pages/public/PerfilPublico"));
import CookieBanner from "./components/common/CookieBanner";

// Dashboard Router
const DashboardRouter = lazy(() => import("./pages/DashboardRouter"));

// Dashboards por rol
const DashboardUsuario = lazy(() => import("./pages/user/DashboardUsuario"));
const DashboardAdmin = lazy(() => import("./pages/admin/DashboardAdmin"));
const DashboardEntrenador = lazy(() => import("./pages/entrenador/DashboardEntrenador"));

// Páginas privadas - Admin
const Usuarios = lazy(() => import("./pages/private/admin/Usuarios"));

// Páginas privadas - Usuario
const PlanificadorSemanal = lazy(() => import("./pages/private/PlanificadorSemanal"));
const MisDatosPersonales = lazy(() => import("./pages/user/MisDatosPersonales"));
const GestionarCuenta = lazy(() => import("./pages/user/GestionarCuenta"));
const MisEntrenamientos = lazy(() => import("./pages/user/MisEntrenamientos"));
const CrearEntrenamiento = lazy(() => import("./pages/user/CrearEntrenamiento"));
const Calculadora = lazy(() => import("./pages/user/Calculadora"));
const MiProgreso = lazy(() => import("./pages/user/MiProgreso"));
const MisDietas = lazy(() => import("./pages/user/MisDietas"));
const MisPlatos = lazy(() => import("./pages/user/MisPlatos"));
const CrearPlatoUsuario = lazy(() => import("./pages/user/CrearPlato"));
const DetalleDieta = lazy(() => import("./pages/user/DetalleDieta"));
const DetalleEntrenamiento = lazy(() => import("./pages/user/DetalleEntrenamiento"));
const MiSuscripcion = lazy(() => import("./pages/user/MiSuscripcion"));
const DescubrirEntrenadores = lazy(() => import("./pages/user/DescubrirEntrenadores"));

const CrearDietaCliente = lazy(() => import("./pages/entrenador/CrearDietaCliente"));
const CrearEntrenamientoCliente = lazy(() => import("./pages/entrenador/CrearEntrenamientoCliente"));
const MisPlatosEntrenador = lazy(() => import("./pages/entrenador/MisPlatosEntrenador"));
const MisDietasEntrenador = lazy(() => import("./pages/entrenador/MisDietasEntrenador"));
const DetalleDietaEntrenador = lazy(() => import("./pages/entrenador/DetalleDietaEntrenador"));
const CrearPlato = lazy(() => import("./pages/entrenador/CrearPlato"));
const MisEntrenamientosEntrenador = lazy(() => import("./pages/entrenador/MisEntrenamientosEntrenador"));

// Las páginas se cargan bajo demanda: la portada, el login y el registro van en el paquete inicial;
// el resto se descarga al entrar (menos JavaScript en la primera visita).
function Cargando() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <div className="h-12 w-12 animate-spin rounded-full border-b-4 border-t-4 border-uf-gold" />
      <span className="sr-only">Cargando...</span>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-uf-darker flex flex-col">
        <ScrollToTop />
        <CookieBanner />
        <Navbar />

        <main className="flex-grow">
          <Suspense fallback={<Cargando />}>
          <Routes>

            {/* --------------------------- */}
            {/* RUTAS PÚBLICAS */}
            {/* --------------------------- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-password" element={<RecuperarPassword />} />
            <Route path="/restablecer-password" element={<RestablecerPassword />} />
            <Route path="/verificar-email" element={<VerificarEmail />} />
            <Route path="/register" element={<Register />} />
            {PAGOS ? (
              <Route path="/upgrade-premium" element={<UpgradePremium />} />
            ) : (
              <Route path="/upgrade-premium" element={<Navigate to="/dashboard" replace />} />
            )}
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/gym" element={<Gym />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/alimentacion" element={<Alimentacion />} />
            <Route path="/dieta/:id" element={<DetalleDietaPublica />} />
            <Route path="/crear-dieta" element={<CrearDieta />} />
            <Route path="/suplementos" element={<Suplementos />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/plato/:id" element={<DetallePlato />} />
            <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
            <Route path="/aviso-legal" element={<AvisoLegal />} />
            <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
            <Route path="/politica-cookies" element={<PoliticaCookies />} />
            <Route path="/perfil/:tipo/:id" element={<PerfilPublico />} />

            {/* Entrenadores: ocultos hasta su lanzamiento (config/funciones.js) */}
            {ENTRENADORES ? (
              <>
              <Route path="/entrenador/login" element={<LoginEntrenador />} />
              {/* Crear contenido del entrenador para clientes */}
              <Route
                path="/entrenador/cliente/:clienteId/crear-dieta"
                element={
                  <ProtectedRouteEntrenador>
                    <CrearDietaCliente />
                  </ProtectedRouteEntrenador>
                }
              />
              <Route
                path="/entrenador/cliente/:clienteId/crear-entrenamiento"
                element={
                  <ProtectedRouteEntrenador>
                    <CrearEntrenamientoCliente />
                  </ProtectedRouteEntrenador>
                }
              />

              {/* --------------------------- */}
              {/* RUTAS ENTRENADOR */}
              {/* --------------------------- */}
              <Route
                path="/entrenador/dashboard"
                element={
                  <ProtectedRouteEntrenador>
                    <DashboardEntrenador />
                  </ProtectedRouteEntrenador>
                }
              />

              <Route
                path="/entrenador/mis-platos"
                element={
                  <ProtectedRouteEntrenador>
                    <MisPlatosEntrenador />
                  </ProtectedRouteEntrenador>
                }
              />

              <Route
                path="/entrenador/mis-entrenamientos"
                element={
                  <ProtectedRouteEntrenador>
                    {/* @ts-ignore */}
                    <MisEntrenamientosEntrenador />
                  </ProtectedRouteEntrenador>
                }
              />

              <Route
                path="/entrenador/mis-dietas"
                element={
                  <ProtectedRouteEntrenador>
                    <MisDietasEntrenador />
                  </ProtectedRouteEntrenador>
                }
              />

              <Route
                path="/entrenador/dieta/:dietaId"
                element={
                  <ProtectedRouteEntrenador>
                    <DetalleDietaEntrenador />
                  </ProtectedRouteEntrenador>
                }
              />

              <Route
                path="/entrenamiento/:entrenamientoId"
                element={
                  <ProtectedRouteEntrenador>
                    {/* @ts-ignore */}
                    <DetalleEntrenamiento />
                  </ProtectedRouteEntrenador>
                }
              />

              <Route
                path="/crear-plato"
                element={
                  <ProtectedRouteEntrenador>
                    <CrearPlato />
                  </ProtectedRouteEntrenador>
                }
              />
              </>
            ) : (
              <Route path="/entrenador/*" element={<Navigate to="/" replace />} />
            )}

            {/* --------------------------- */}
            {/* RUTA GENERAL DE DASHBOARD */}
            {/* --------------------------- */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireAuth={true}>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />

            {/* --------------------------- */}
            {/* USUARIO */}
            {/* --------------------------- */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute requireAuth={true}>
                  <DashboardUsuario />
                </ProtectedRoute>
              }
            />

            {/* --------------------------- */}
            {/* ADMIN */}
            {/* --------------------------- */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardAdmin />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/usuarios"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Usuarios />
                </ProtectedRoute>
              }
            />

            {/* --------------------------- */}
            {/* USUARIO ROUTES */}
            {/* --------------------------- */}
            <Route
              path="/mi-plan-semanal"
              element={
                <ProtectedRoute requireAuth={true}>
                  <PlanificadorSemanal />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cuenta"
              element={
                <ProtectedRoute requireAuth={true}>
                  <GestionarCuenta />
                </ProtectedRoute>
              }
            />

            <Route
              path="/perfil/datos"
              element={
                <ProtectedRoute requireAuth={true}>
                  <MisDatosPersonales />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mis-entrenamientos"
              element={
                <ProtectedRoute requireAuth={true}>
                  <MisEntrenamientos />
                </ProtectedRoute>
              }
            />

            <Route
              path="/crear-entrenamiento"
              element={
                <ProtectedRoute requireAuth={true}>
                  <CrearEntrenamiento />
                </ProtectedRoute>
              }
            />

            <Route
              path="/progreso"
              element={
                <ProtectedRoute requireAuth={true}>
                  <MiProgreso />
                </ProtectedRoute>
              }
            />

            <Route
              path="/calculadora"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Calculadora />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mis-entrenamientos/:entrenamientoId"
              element={
                <ProtectedRoute requireAuth={true}>
                  <DetalleEntrenamiento />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mis-dietas"
              element={
                <ProtectedRoute requireAuth={true}>
                  <MisDietas />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mis-dietas/:dietaId"
              element={
                <ProtectedRoute requireAuth={true}>
                  <DetalleDieta />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mis-platos"
              element={
                <ProtectedRoute requireAuth={true}>
                  <MisPlatos />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mis-platos/crear"
              element={
                <ProtectedRoute requireAuth={true}>
                  <CrearPlatoUsuario />
                </ProtectedRoute>
              }
            />

            {PAGOS ? (
              <Route
                path="/mi-suscripcion"
                element={
                  <ProtectedRoute requireAuth={true}>
                    <MiSuscripcion />
                  </ProtectedRoute>
                }
              />
            ) : (
              <Route path="/mi-suscripcion" element={<Navigate to="/dashboard" replace />} />
            )}

            {ENTRENADORES ? (
              <Route
                path="/user/descubrir"
                element={
                  <ProtectedRoute requireAuth={true}>
                    <DescubrirEntrenadores />
                  </ProtectedRoute>
                }
              />
            ) : (
              <Route path="/user/descubrir" element={<Navigate to="/dashboard" replace />} />
            )}

            {/* --------------------------- */}
            {/* 404 */}
            {/* --------------------------- */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center px-4">
                  <div className="text-center max-w-lg">
                    <h1 className="text-9xl font-anton font-bold text-uf-gold mb-4 animate-pulse">404</h1>
                    <h2 className="text-3xl font-anton text-white mb-4 uppercase tracking-wider">Página no encontrada</h2>
                    <p className="text-gray-400 mb-8 text-lg">
                      Lo sentimos, la página que buscas no existe o ha sido movida.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Link
                        to="/"
                        className="bg-uf-gold hover:bg-uf-blue text-black hover:text-white font-bold px-8 py-3 rounded-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105 text-sm"
                      >
                        Volver al Inicio
                      </Link>
                      <Link
                        to="/contacto"
                        className="border-2 border-white/30 hover:border-uf-gold text-white hover:text-uf-gold font-bold px-8 py-3 rounded-lg uppercase tracking-wider transition-all duration-300 text-sm"
                      >
                        Contactar
                      </Link>
                    </div>
                  </div>
                </div>
              }
            />
          </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </ToastProvider>
  );
}

export default App;
