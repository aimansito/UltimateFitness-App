import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Login from './pages/public/Login';
import Home from './pages/public/Home';
import Dashboard from './pages/private/Dashboard';
import Usuarios from './pages/private/admin/Usuarios';
import Servicios from './pages/public/Servicios';
import Contacto from './pages/public/Contacto';
import Gym from './pages/public/Gym';



function App() {
  return (
    <div className="min-h-screen bg-uf-darker flex flex-col">
      {/* Navbar siempre visible */}
      <Navbar />
      
      {/* Contenido principal - crece para ocupar espacio disponible */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/usuarios" element={<Usuarios />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/gym" element={<Gym />} />


          
          {/* Ruta por defecto */}
          <Route path="*" element={
            <div className="text-white p-8 text-center text-2xl min-h-screen flex items-center justify-center">
              Página no encontrada - 404
            </div>
          } />
        </Routes>
      </main>
      
      {/* Footer siempre visible */}
      <Footer />
    </div>
  );
}

export default App;