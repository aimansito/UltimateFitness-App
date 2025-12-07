import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Loader, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useAuthEntrenador from '../../context/AuthContextEntrenador';

function DetallePlato() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plato, setPlato] = useState(null);
  const [loading, setLoading] = useState(true);

  // Detectar si es entrenador para volver a la ruta correcta
  const { entrenador } = useAuthEntrenador();
  // eslint-disable-next-line
  const { user } = useAuth(); // Mantener hook aunque no se use user directamente por coherencia

  useEffect(() => {
    fetchPlato();
  }, [id]);

  const fetchPlato = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/platos/${id}`);

      if (response.data.success) {
        setPlato(response.data.plato);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black flex items-center justify-center">
        <Loader className="animate-spin h-16 w-16 text-uf-gold" />
      </div>
    );
  }

  if (!plato) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black flex items-center justify-center">
        <p className="text-white">Plato no encontrado</p>
      </div>
    );
  }

  const handleBack = (e) => {
    e.preventDefault();
    if (entrenador) {
      navigate('/entrenador/mis-platos');
    } else {
      navigate('/mis-platos');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">

        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-uf-gold hover:text-yellow-600 mb-8 transition-colors bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          {entrenador ? "Volver a Mis Platos (Entrenador)" : "Volver a Mis Platos"}
        </button>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-gray-700 p-8">

          <h1 className="text-4xl font-bold text-white mb-4">
            {plato.nombre}
          </h1>

          {plato.descripcion && (
            <p className="text-gray-400 text-lg mb-6">
              {plato.descripcion}
            </p>
          )}

          {/* Macros */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm mb-2">Calorías</p>
              <p className="text-3xl font-bold text-uf-gold">
                {Math.round(plato.calorias_totales)}
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm mb-2">Proteínas</p>
              <p className="text-3xl font-bold text-green-400">
                {Math.round(plato.proteinas_totales)}g
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm mb-2">Carbos</p>
              <p className="text-3xl font-bold text-yellow-400">
                {Math.round(plato.carbohidratos_totales)}g
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm mb-2">Grasas</p>
              <p className="text-3xl font-bold text-blue-400">
                {Math.round(plato.grasas_totales)}g
              </p>
            </div>
          </div>

          {/* Ingredientes */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Ingredientes:</h2>
            {plato.ingredientes && plato.ingredientes.length > 0 ? (
              <div className="space-y-3">
                {plato.ingredientes.map((ing, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-white font-bold">{ing.alimento.nombre}</p>
                      <p className="text-gray-400 text-sm">{ing.cantidad_gramos}g</p>
                    </div>
                    <div className="text-right">
                      <p className="text-uf-gold font-bold">{Math.round(ing.calorias)} kcal</p>
                      <p className="text-gray-400 text-sm">
                        P: {Math.round(ing.proteinas)}g | C: {Math.round(ing.carbohidratos)}g | G: {Math.round(ing.grasas)}g
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">No hay ingredientes registrados para este plato.</p>
            )}
          </div>

          {/* Instrucciones */}
          {plato.instrucciones && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Preparación:</h2>
              <div className="bg-gray-900 rounded-lg p-6">
                <p className="text-gray-300 whitespace-pre-line">
                  {plato.instrucciones}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetallePlato;