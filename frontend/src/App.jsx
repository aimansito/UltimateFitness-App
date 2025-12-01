import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { ProtectedRoute } from "./components/common";

// Páginas públicas
import Login from "./pages/public/Login";
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
import MisPlatos from "./pages/public/MisPlatos";
import DetallePlato from "./pages/public/DetallePlato";

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
import DetalleDieta from "./pages/user/DetalleDieta";
import DetalleEntrenamiento from "./pages/user/DetalleEntrenamiento";
import MiSuscripcion from "./pages/user/MiSuscripcion";

import CrearDietaCliente from './pages/entrenador/CrearDietaCliente';


function App() {
  return (
    <div className="min-h-screen bg-uf-darker flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* --------------------------- */}
          {/* RUTAS PÚBLICAS */}
          {/* --------------------------- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/gym" element={<Gym />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/alimentacion" element={<Alimentacion />} />

          {/* Detalle dieta pública */}
          <Route path="/dieta/:id" element={<DetalleDietaPublica />} />

          <Route path="/crear-dieta" element={<CrearDieta />} />
          <Route path="/suplementos" element={<Suplementos />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/mis-platos" element={<MisPlatos />} />
          <Route path="/plato/:id" element={<DetallePlato />} />
          <Route path="/entrenador/cliente/:clienteId/crear-dieta" element={<CrearDietaCliente />} />


          {/* --------------------------- */}
          {/* DASHBOARD ROUTER */}
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
          {/* DASHBOARDS POR ROL */}
          {/* --------------------------- */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute requireAuth={true}>
                <DashboardUsuario />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/entrenador/dashboard"
            element={
              <ProtectedRoute requiredRole="entrenador">
                <DashboardEntrenador />
              </ProtectedRoute>
            }
          />

          {/* --------------------------- */}
          {/* ADMIN */}
          {/* --------------------------- */}
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute requiredRole="admin">
                <Usuarios />
              </ProtectedRoute>
            }
          />

          {/* --------------------------- */}
          {/* USUARIO */}
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

          {/* DETALLE DE UN ENTRENAMIENTO */}
          <Route
            path="/mis-entrenamientos/:entrenamientoId"
            element={
              <ProtectedRoute requireAuth={true}>
                <DetalleEntrenamiento />
              </ProtectedRoute>
            }
          />

          {/* LISTA DE DIETAS DEL USUARIO */}
          <Route
            path="/mis-dietas"
            element={
              <ProtectedRoute requireAuth={true}>
                <MisDietas />
              </ProtectedRoute>
            }
          />

          {/* DETALLE DE UNA DIETA DEL USUARIO */}
          <Route
            path="/mis-dietas/:dietaId"
            element={
              <ProtectedRoute requireAuth={true}>
                <DetalleDieta />
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
              <div className="text-white p-8 text-center text-2xl min-h-screen flex items-center justify-center">
                Página no encontrada - 404
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
