// ============================================
// SELECTOR DE DIETA PARA DÍA ESPECÍFICO
// Permite elegir entre: Mis Dietas, Del Entrenador, Públicas
// ============================================
import { useState, useEffect } from 'react';

function SelectorDietaDia({ dia, onSeleccionar, onCerrar }) {
  const [categoriaActiva, setCategoriaActiva] = useState('mis_dietas');
  const [dietas, setDietas] = useState([]);
  const [dietaSeleccionada, setDietaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);

  const categorias = {
    mis_dietas: { nombre: 'Mis Dietas', icon: '👤', descripcion: 'Dietas que has creado' },
    entrenador: { nombre: 'De Mi Entrenador', icon: '🎓', descripcion: 'Recomendadas por tu entrenador' },
    publicas: { nombre: 'Públicas', icon: '🌍', descripcion: 'Dietas de la comunidad' }
  };

  const diasNombres = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    domingo: 'Domingo'
  };

  useEffect(() => {
    cargarDietas();
  }, [categoriaActiva]);

  const cargarDietas = async () => {
    try {
      setCargando(true);
      
      let url = '';
      switch (categoriaActiva) {
        case 'mis_dietas':
          // TODO: Endpoint para dietas del usuario
          url = 'http://localhost:8000/api/custom/dietas/publicas'; // Temporal
          break;
        case 'entrenador':
          // TODO: Endpoint para dietas del entrenador
          url = 'http://localhost:8000/api/custom/dietas/publicas'; // Temporal
          break;
        case 'publicas':
          url = 'http://localhost:8000/api/custom/dietas/publicas';
          break;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setDietas(data.dietas);
      }
    } catch (error) {
      console.error('Error cargando dietas:', error);
    } finally {
      setCargando(false);
    }
  };

  const seleccionarDieta = (dieta) => {
    setDietaSeleccionada(dieta);
  };

  const confirmarSeleccion = () => {
    if (dietaSeleccionada) {
      onSeleccionar(dietaSeleccionada);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-900 to-black max-w-5xl w-full max-h-[95vh] overflow-y-auto rounded-2xl border-2 border-uf-gold shadow-2xl">
        
        {/* HEADER */}
        <div className="sticky top-0 bg-gradient-to-r from-uf-gold to-yellow-600 p-6 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-anton font-bold text-black mb-2 uppercase">
                Seleccionar Dieta para {diasNombres[dia]}
              </h2>
              <p className="text-gray-800 text-sm">
                Elige una dieta para asignar a este día de la semana
              </p>
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
          
          {/* TABS DE CATEGORÍAS */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {Object.entries(categorias).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setCategoriaActiva(key)}
                className={`p-4 rounded-xl border-2 transition ${
                  categoriaActiva === key
                    ? 'bg-uf-gold text-black border-uf-gold'
                    : 'bg-gray-800 text-white border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-bold text-sm">{cat.nombre}</div>
                <div className={`text-xs mt-1 ${categoriaActiva === key ? 'text-gray-800' : 'text-gray-500'}`}>
                  {cat.descripcion}
                </div>
              </button>
            ))}
          </div>

          {/* LISTA DE DIETAS */}
          {cargando ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold mx-auto mb-4"></div>
              <p className="text-gray-400">Cargando dietas...</p>
            </div>
          ) : dietas.length > 0 ? (
            <div className="space-y-3 mb-6">
              {dietas.map((dieta) => (
                <div
                  key={dieta.id}
                  onClick={() => seleccionarDieta(dieta)}
                  className={`cursor-pointer bg-gray-800 rounded-xl p-4 border-2 transition ${
                    dietaSeleccionada?.id === dieta.id
                      ? 'border-uf-gold bg-gray-700'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {dietaSeleccionada?.id === dieta.id && (
                          <div className="w-6 h-6 bg-uf-gold rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        <h4 className="text-lg font-bold text-white">{dieta.nombre}</h4>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{dieta.descripcion}</p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-uf-gold font-bold">{dieta.valoracionPromedio}</span>
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-gray-500 text-sm">({dieta.totalValoraciones})</span>
                        </div>
                        <div className="text-gray-500 text-sm">
                          {dieta.fechaCreacion && new Date(dieta.fechaCreacion).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* VISTA PREVIA DE MACROS */}
                    <div className="ml-4 grid grid-cols-2 gap-2 text-sm">
                      <div className="text-center bg-gray-900 rounded p-2">
                        <div className="font-bold text-white">2500</div>
                        <div className="text-gray-500 text-xs">kcal</div>
                      </div>
                      <div className="text-center bg-gray-900 rounded p-2">
                        <div className="font-bold text-red-400">180g</div>
                        <div className="text-gray-500 text-xs">P</div>
                      </div>
                      <div className="text-center bg-gray-900 rounded p-2">
                        <div className="font-bold text-blue-400">280g</div>
                        <div className="text-gray-500 text-xs">C</div>
                      </div>
                      <div className="text-center bg-gray-900 rounded p-2">
                        <div className="font-bold text-yellow-400">80g</div>
                        <div className="text-gray-500 text-xs">G</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-20 h-20 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl mb-2">No hay dietas disponibles</p>
              <p className="text-sm">
                {categoriaActiva === 'mis_dietas' && 'Crea tu primera dieta personalizada'}
                {categoriaActiva === 'entrenador' && 'Tu entrenador aún no te ha asignado dietas'}
                {categoriaActiva === 'publicas' && 'No hay dietas públicas disponibles'}
              </p>
            </div>
          )}

          {/* BOTONES */}
          <div className="flex gap-4">
            <button
              onClick={onCerrar}
              className="flex-1 bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
            <button
              onClick={confirmarSeleccion}
              disabled={!dietaSeleccionada}
              className="flex-1 bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-uf-gold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Asignar a {diasNombres[dia]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectorDietaDia;