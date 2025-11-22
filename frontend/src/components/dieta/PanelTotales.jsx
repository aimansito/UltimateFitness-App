// ============================================
// PANEL DE TOTALES - Muestra progreso en tiempo real
// Sticky en la parte superior mientras se construye la dieta
// ============================================
import { useEffect, useState } from 'react';

function PanelTotales({ objetivos, actuales }) {
  const [porcentajes, setPorcentajes] = useState({
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0
  });

  useEffect(() => {
    if (objetivos) {
      setPorcentajes({
        calorias: (actuales.calorias / objetivos.caloriasObjetivo) * 100,
        proteinas: (actuales.proteinas / objetivos.proteinas) * 100,
        carbohidratos: (actuales.carbohidratos / objetivos.carbohidratos) * 100,
        grasas: (actuales.grasas / objetivos.grasas) * 100
      });
    }
  }, [actuales, objetivos]);

  const getColorPorcentaje = (porcentaje) => {
    if (porcentaje < 80) return 'bg-red-500';
    if (porcentaje >= 80 && porcentaje <= 110) return 'bg-green-500';
    return 'bg-yellow-500';
  };

  const getColorTexto = (porcentaje) => {
    if (porcentaje < 80) return 'text-red-400';
    if (porcentaje >= 80 && porcentaje <= 110) return 'text-green-400';
    return 'text-yellow-400';
  };

  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-gray-900 to-black border-2 border-uf-gold rounded-xl p-6 mb-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-anton font-bold text-white uppercase flex items-center gap-2">
          <svg className="w-6 h-6 text-uf-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Progreso del Día
        </h3>
        <div className="text-gray-400 text-sm">
          Objetivo: <span className="text-white font-bold">{objetivos.objetivo}</span>
        </div>
      </div>

      {/* CALORÍAS PRINCIPAL */}
      <div className="mb-6">
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="text-gray-400 text-sm">Calorías</div>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${getColorTexto(porcentajes.calorias)}`}>
                {Math.round(actuales.calorias)}
              </span>
              <span className="text-gray-500">/ {objetivos.caloriasObjetivo} kcal</span>
            </div>
          </div>
          <div className={`text-2xl font-bold ${getColorTexto(porcentajes.calorias)}`}>
            {Math.round(porcentajes.calorias)}%
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${getColorPorcentaje(porcentajes.calorias)}`}
            style={{ width: `${Math.min(porcentajes.calorias, 100)}%` }}
          ></div>
        </div>
        <div className="mt-1 text-right text-sm text-gray-500">
          {objetivos.caloriasObjetivo - Math.round(actuales.calorias) > 0 
            ? `Quedan ${objetivos.caloriasObjetivo - Math.round(actuales.calorias)} kcal`
            : `Exceso de ${Math.round(actuales.calorias) - objetivos.caloriasObjetivo} kcal`
          }
        </div>
      </div>

      {/* MACRONUTRIENTES */}
      <div className="grid grid-cols-3 gap-4">
        {/* PROTEÍNAS */}
        <div>
          <div className="text-gray-400 text-xs mb-1">Proteínas</div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className={`text-2xl font-bold ${getColorTexto(porcentajes.proteinas)}`}>
              {Math.round(actuales.proteinas)}
            </span>
            <span className="text-gray-500 text-sm">/ {objetivos.proteinas}g</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-500"
              style={{ width: `${Math.min(porcentajes.proteinas, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">{Math.round(porcentajes.proteinas)}%</div>
        </div>

        {/* CARBOHIDRATOS */}
        <div>
          <div className="text-gray-400 text-xs mb-1">Carbohidratos</div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className={`text-2xl font-bold ${getColorTexto(porcentajes.carbohidratos)}`}>
              {Math.round(actuales.carbohidratos)}
            </span>
            <span className="text-gray-500 text-sm">/ {objetivos.carbohidratos}g</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${Math.min(porcentajes.carbohidratos, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">{Math.round(porcentajes.carbohidratos)}%</div>
        </div>

        {/* GRASAS */}
        <div>
          <div className="text-gray-400 text-xs mb-1">Grasas</div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className={`text-2xl font-bold ${getColorTexto(porcentajes.grasas)}`}>
              {Math.round(actuales.grasas)}
            </span>
            <span className="text-gray-500 text-sm">/ {objetivos.grasas}g</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-yellow-500 transition-all duration-500"
              style={{ width: `${Math.min(porcentajes.grasas, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">{Math.round(porcentajes.grasas)}%</div>
        </div>
      </div>

      {/* MENSAJE DE ESTADO */}
      <div className="mt-4 text-center">
        {porcentajes.calorias >= 80 && porcentajes.calorias <= 110 ? (
          <div className="text-green-400 font-bold flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            ¡Vas por buen camino!
          </div>
        ) : porcentajes.calorias < 80 ? (
          <div className="text-red-400 font-bold flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Añade más alimentos
          </div>
        ) : (
          <div className="text-yellow-400 font-bold flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Cuidado: Te pasas del objetivo
          </div>
        )}
      </div>
    </div>
  );
}

export default PanelTotales;