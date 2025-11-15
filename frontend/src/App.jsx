import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './pages/public/Login';
import Home from './pages/public/Home';
import Usuarios from './pages/private/admin/Usuarios'; // ← AÑADIR
import Dashboard from './pages/private/Dashboard';


function App() {
  return (
    <div className="min-h-screen bg-uf-darker">
      <Routes>
        {/* Ruta de login sin navbar */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas con navbar */}
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Ruta admin - TODO: proteger con autenticación */}
              <Route path="/admin/usuarios" element={<Usuarios />} />
              
              <Route path="/dashboard" element={<Dashboard/>} />
            </Routes>
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;