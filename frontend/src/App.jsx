import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { ProtectedRoute } from "./components/common";
import ScrollToTop from "./components/common/ScrollToTop";
import ProtectedRouteEntrenador from "./components/ProtectedRouteEntrenador";
import { ToastProvider } from "./context/ToastContext";

// Páginas públicas
import Login from "./pages/public/Login";
import LoginEntrenador from "./pages/entrenador/LoginEntrenador";
import Register from "./pages/public/Register";
import UpgradePremium from "./pages/public/UpgradePremium";
import Home from "./pages/public/Home";
import Servicios from "./pages/public/Servicios";
import Contacto from "./pages/public/Contacto";
import Gym from "./pages/public/Gym";
import Workout from "./pages/public/Workout";
import Alimentacion from "./pages/public/Alimentacion";
import DetalleDietaPublica from "./pages/public/DetalleDieta";
import CrearDieta from "./pages/public/CrearDieta";
import Suplementos from "./pages/public/Suplementos";
import Blog from "./pages/public/Blog";
import BlogPost from "./pages/public/BlogPost";
import DetallePlato from "./pages/public/DetallePlato";
import PoliticaPrivacidad from "./pages/public/PoliticaPrivacidad";
import AvisoLegal from "./pages/public/AvisoLegal";
import TerminosCondiciones from "./pages/public/TerminosCondiciones";
import PoliticaCookies from "./pages/public/PoliticaCookies";
import RecuperarPassword from "./pages/public/RecuperarPassword";
import RestablecerPassword from "./pages/public/RestablecerPassword";
import CookieBanner from "./components/common/CookieBanner";

// Dashboard Router
import DashboardRouter from "./pages/DashboardRouter";

// Dashboards por rol
import DashboardUsuario from "./pages/user/DashboardUsuario";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DashboardEntrenador from "./pages/entrenador/DashboardEntrenador";

// Páginas privadas - Admin
import Usuarios from "./pages/private/admin/Usuarios";

// Páginas privadas - Usuario
import PlanificadorSemanal from "./pages/private/PlanificadorSemanal";
import MisDatosPersonales from "./pages/user/MisDatosPersonales";
import MisEntrenamientos from "./pages/user/MisEntrenamientos";
import CrearEntrenamiento from "./pages/user/CrearEntrenamiento";
import MisDietas from "./pages/user/MisDietas";
import MisPlatos from "./pages/user/MisPlatos";
import DetalleDieta from "./pages/user/DetalleDieta";
import DetalleEntrenamiento from "./pages/user/DetalleEntrenamiento";
import MiSuscripcion from "./pages/user/MiSuscripcion";

import CrearDietaCliente from "./pages/entrenador/CrearDietaCliente";
import CrearEntrenamientoCliente from "./pages/entrenador/CrearEntrenamientoCliente";
import MisPlatosEntrenador from "./pages/entrenador/MisPlatosEntrenador";
import MisDietasEntrenador from "./pages/entrenador/MisDietasEntrenador";
import DetalleDietaEntrenador from "./pages/entrenador/DetalleDietaEntrenador";
import CrearPlato from "./pages/entrenador/CrearPlato";
import MisEntrenamientosEntrenador from "./pages/entrenador/MisEntrenamientosEntrenador";

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-uf-darker flex flex-col">
        <ScrollToTop />
        <CookieBanner />
        <Navbar />

        <main className="flex-grow">
          <Routes>

            {/* --------------------------- */}
            {/* RUTAS PÚBLICAS */}
            {/* --------------------------- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-password" element={<RecuperarPassword />} />
            <Route path="/restablecer-password" element={<RestablecerPassword />} />
            <Route path="/entrenador/login" element={<LoginEntrenador />} />
            <Route path="/register" element={<Register />} />
            <Route path="/upgrade-premium" element={<UpgradePremium />} />
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
              path="/mi-suscripcion"
              element={
                <ProtectedRoute requireAuth={true}>
                  <MiSuscripcion />
                </ProtectedRoute>
              }
            />

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
        </main>

        <Footer />
      </div>
    </ToastProvider>
  );
}

export default App;
