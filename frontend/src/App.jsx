import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';  // ← layout minúscula
import Login from './pages/public/Login';
import Home from './pages/Home';

function App() {
  return (
    <div className="min-h-screen bg-uf-darker">
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={
                <div className="text-white p-8 text-center text-2xl">
                  Dashboard - En construcción
                </div>
              } />
            </Routes>
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;