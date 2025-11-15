import { useState, useEffect } from 'react';
import api from '../../../services/api';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching usuarios...');
    
    api.get('/usuarios')
      .then(response => {
        console.log('Response:', response.data);
        
        // La API devuelve los datos en 'member' (no 'hydra:member')
        const data = response.data.member || response.data['hydra:member'] || [];
        console.log('Usuarios extraídos:', data);
        setUsuarios(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error completo:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-xl">Cargando usuarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!usuarios || usuarios.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-xl">No hay usuarios disponibles</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Usuarios ({usuarios.length})
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {usuarios.map(usuario => (
          <div 
            key={usuario.id} 
            className="border rounded-lg p-6 shadow hover:shadow-lg transition bg-white"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {usuario.nombre} {usuario.apellidos}
            </h2>
            <p className="text-gray-600 text-sm mb-3">{usuario.email}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Objetivo:</span>
                <span className="text-blue-600 capitalize">
                  {usuario.objetivo?.replace('_', ' ')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Premium:</span>
                {usuario.esPremium ? (
                  <span className="text-green-600 font-semibold">✅ Sí</span>
                ) : (
                  <span className="text-gray-400">❌ No</span>
                )}
              </div>
              
              {usuario.entrenador && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Entrenador:</span>
                  <span className="text-purple-600">Asignado</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Usuarios;