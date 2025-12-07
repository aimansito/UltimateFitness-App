// ============================================
// BUSCADOR DE ALIMENTOS
// Búsqueda con autocompletado y selección de cantidad
// ============================================
import { useState, useEffect } from 'react';
import api from '../../services/api';

function BuscadorAlimentos({ onSeleccionar, onCerrar }) {
  const [busqueda, setBusqueda] = useState('');
  const [alimentos, setAlimentos] = useState([]);
  const [alimentosFiltrados, setAlimentosFiltrados] = useState([]);
  const [alimentoSeleccionado, setAlimentoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(100);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarAlimentos();
  }, []);

  useEffect(() => {
    if (busqueda.length >= 2) {
      const filtrados = alimentos.filter(alimento =>
        alimento.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
      setAlimentosFiltrados(filtrados);
    } else {
      setAlimentosFiltrados([]);
    }
  }, [busqueda, alimentos]);

  const cargarAlimentos = async () => {
    try {
      const response = await api.get('/alimentos');
      const data = response.data;
      if (data['hydra:member']) {
        setAlimentos(data['hydra:member']);
      }
    } catch (error) {
      console.error('Error cargando alimentos:', error);
    } finally {
      setCargando(false);
    }
  };

  const seleccionarAlimento = (alimento) => {
    setAlimentoSeleccionado(alimento);
    setBusqueda('');
    setAlimentosFiltrados([]);
  };

  const confirmarSeleccion = () => {
    if (alimentoSeleccionado && cantidad > 0) {
      onSeleccionar(alimentoSeleccionado, cantidad);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black max-w-2xl w-full rounded-2xl border-2 border-uf-gold shadow-2xl">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-uf-gold to-yellow-600 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-anton font-bold text-black uppercase">Buscar Alimento</h3>
              <p className="text-gray-800 text-sm">Encuentra el alimento que necesitas</p>
            </div>
            <button
              onClick={onCerrar}
              className="bg-black/20 hover:bg-black/40 text-black rounded-full p-2 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {!alimentoSeleccionado ? (
            <>
              {/* BUSCADOR */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Escribe para buscar... (ej: pollo, arroz, huevo)"
                  className="w-full bg-gray-800 text-white px-4 py-3 pl-12 rounded-lg border-2 border-gray-700 focus:border-uf-gold focus:outline-none"
                  autoFocus
                />
                <svg className="w-6 h-6 text-gray-500 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* RESULTADOS */}
              <div className="max-h-96 overflow-y-auto">
                {cargando ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-uf-gold mx-auto"></div>
                    <p className="text-gray-400 mt-4">Cargando alimentos...</p>
                  </div>
                ) : alimentosFiltrados.length > 0 ? (
                  <div className="space-y-2">
                    {alimentosFiltrados.map((alimento) => (
                      <button
                        key={alimento.id}
                        onClick={() => seleccionarAlimento(alimento)}
                        className="w-full text-left bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 hover:border-uf-gold transition"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-bold text-white mb-1">{alimento.nombre}</div>
                            <div className="text-gray-400 text-sm">
                              Por 100g: {alimento.calorias} kcal ·
                              P: {alimento.proteinas}g ·
                              C: {alimento.carbohidratos}g ·
                              G: {alimento.grasas}g
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-uf-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : busqueda.length >= 2 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No se encontraron resultados</p>
                    <p className="text-sm mt-1">Prueba con otro término de búsqueda</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p>Escribe al menos 2 caracteres para buscar</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* CONFIRMACIÓN */}
              <div className="bg-gray-800 rounded-xl p-6 mb-6">
                <h4 className="text-xl font-bold text-white mb-4">{alimentoSeleccionado.nombre}</h4>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-uf-gold">{alimentoSeleccionado.calorias}</div>
                    <div className="text-gray-400 text-xs">kcal/100g</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{alimentoSeleccionado.proteinas}g</div>
                    <div className="text-gray-400 text-xs">Proteínas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{alimentoSeleccionado.carbohidratos}g</div>
                    <div className="text-gray-400 text-xs">Carbos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{alimentoSeleccionado.grasas}g</div>
                    <div className="text-gray-400 text-xs">Grasas</div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-bold">¿Cuántos gramos?</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={cantidad}
                      onChange={(e) => setCantidad(parseFloat(e.target.value) || 0)}
                      className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-uf-gold focus:outline-none text-center text-2xl font-bold"
                      min="1"
                    />
                    <span className="flex items-center text-gray-400 font-bold">gramos</span>
                  </div>
                </div>

                {/* PREVIEW CON CANTIDAD */}
                <div className="mt-4 bg-gray-700 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-2">Con {cantidad}g tendrás:</div>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-uf-gold">{Math.round((alimentoSeleccionado.calorias * cantidad) / 100)}</div>
                      <div className="text-gray-500 text-xs">kcal</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-red-400">{((alimentoSeleccionado.proteinas * cantidad) / 100).toFixed(1)}g</div>
                      <div className="text-gray-500 text-xs">P</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-400">{((alimentoSeleccionado.carbohidratos * cantidad) / 100).toFixed(1)}g</div>
                      <div className="text-gray-500 text-xs">C</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-yellow-400">{((alimentoSeleccionado.grasas * cantidad) / 100).toFixed(1)}g</div>
                      <div className="text-gray-500 text-xs">G</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTONES */}
              <div className="flex gap-4">
                <button
                  onClick={() => setAlimentoSeleccionado(null)}
                  className="flex-1 bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition"
                >
                  ← Cambiar
                </button>
                <button
                  onClick={confirmarSeleccion}
                  disabled={cantidad <= 0}
                  className="flex-1 bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-uf-gold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Añadir
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BuscadorAlimentos;