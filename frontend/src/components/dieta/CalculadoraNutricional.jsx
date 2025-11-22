// ============================================
// CALCULADORA NUTRICIONAL
// Calcula calorías y macros según Harris-Benedict
// ============================================
import { useState } from 'react';

function CalculadoraNutricional({ onCalcular }) {
  const [mostrarCalculadora, setMostrarCalculadora] = useState(true);
  const [formulario, setFormulario] = useState({
    peso: '',
    altura: '',
    edad: '',
    sexo: 'hombre',
    actividad: 'moderado',
    objetivo: 'mantener'
  });
  const [resultado, setResultado] = useState(null);

  const nivelesActividad = {
    sedentario: { nombre: 'Sedentario', descripcion: 'Poco o ningún ejercicio', factor: 1.2 },
    ligero: { nombre: 'Ligero', descripcion: '1-3 días/semana', factor: 1.375 },
    moderado: { nombre: 'Moderado', descripcion: '3-5 días/semana', factor: 1.55 },
    activo: { nombre: 'Activo', descripcion: '6-7 días/semana', factor: 1.725 },
    muy_activo: { nombre: 'Muy Activo', descripcion: 'Ejercicio intenso diario', factor: 1.9 }
  };

  const objetivos = {
    perder_peso: { nombre: 'Perder Peso', ajuste: -500, icon: '📉' },
    mantener: { nombre: 'Mantener Peso', ajuste: 0, icon: '⚖️' },
    ganar_masa: { nombre: 'Ganar Masa Muscular', ajuste: 500, icon: '💪' },
    tonificar: { nombre: 'Tonificar', ajuste: -200, icon: '🎯' }
  };

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const calcular = () => {
    const { peso, altura, edad, sexo, actividad, objetivo } = formulario;

    // Validar campos
    if (!peso || !altura || !edad) {
      alert('Por favor, completa todos los campos');
      return;
    }

    // Calcular TMB (Tasa Metabólica Basal) con Harris-Benedict
    let tmb;
    if (sexo === 'hombre') {
      tmb = 88.362 + (13.397 * parseFloat(peso)) + (4.799 * parseFloat(altura)) - (5.677 * parseFloat(edad));
    } else {
      tmb = 447.593 + (9.247 * parseFloat(peso)) + (3.098 * parseFloat(altura)) - (4.330 * parseFloat(edad));
    }

    // Aplicar factor de actividad
    const factor = nivelesActividad[actividad].factor;
    const caloriasMantenimiento = tmb * factor;

    // Aplicar ajuste por objetivo
    const ajuste = objetivos[objetivo].ajuste;
    const caloriasObjetivo = caloriasMantenimiento + ajuste;

    // Calcular macronutrientes (40% carbos, 30% proteínas, 30% grasas)
    const proteinas = Math.round((caloriasObjetivo * 0.30) / 4);
    const carbohidratos = Math.round((caloriasObjetivo * 0.40) / 4);
    const grasas = Math.round((caloriasObjetivo * 0.30) / 9);

    const resultadoCalculado = {
      tmb: Math.round(tmb),
      caloriasMantenimiento: Math.round(caloriasMantenimiento),
      caloriasObjetivo: Math.round(caloriasObjetivo),
      proteinas,
      carbohidratos,
      grasas,
      objetivo: objetivos[objetivo].nombre
    };

    setResultado(resultadoCalculado);
    onCalcular(resultadoCalculado);
    setMostrarCalculadora(false);
  };

  const resetear = () => {
    setResultado(null);
    setMostrarCalculadora(true);
    setFormulario({
      peso: '',
      altura: '',
      edad: '',
      sexo: 'hombre',
      actividad: 'moderado',
      objetivo: 'mantener'
    });
  };

  return (
    <div className="bg-gradient-to-r from-uf-gold/10 to-yellow-600/10 border-2 border-uf-gold rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-anton font-bold text-white uppercase flex items-center gap-2">
          <svg className="w-7 h-7 text-uf-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Calculadora Nutricional
        </h2>
        {resultado && (
          <button
            onClick={() => setMostrarCalculadora(!mostrarCalculadora)}
            className="text-uf-gold hover:text-white transition flex items-center gap-2"
          >
            {mostrarCalculadora ? 'Ocultar' : 'Editar'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
      </div>

      {mostrarCalculadora ? (
        <div className="space-y-6">
          {/* DATOS PERSONALES */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-bold">Peso (kg) *</label>
              <input
                type="number"
                name="peso"
                value={formulario.peso}
                onChange={handleChange}
                placeholder="75"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-uf-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-bold">Altura (cm) *</label>
              <input
                type="number"
                name="altura"
                value={formulario.altura}
                onChange={handleChange}
                placeholder="175"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-uf-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-bold">Edad *</label>
              <input
                type="number"
                name="edad"
                value={formulario.edad}
                onChange={handleChange}
                placeholder="30"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-uf-gold focus:outline-none"
              />
            </div>
          </div>

          {/* SEXO */}
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-bold">Sexo</label>
            <div className="flex gap-4">
              <label className="flex-1">
                <input
                  type="radio"
                  name="sexo"
                  value="hombre"
                  checked={formulario.sexo === 'hombre'}
                  onChange={handleChange}
                  className="hidden"
                />
                <div className={`cursor-pointer text-center py-3 rounded-lg border-2 transition ${
                  formulario.sexo === 'hombre'
                    ? 'bg-uf-gold text-black border-uf-gold'
                    : 'bg-gray-800 text-white border-gray-700 hover:border-gray-600'
                }`}>
                  👨 Hombre
                </div>
              </label>
              <label className="flex-1">
                <input
                  type="radio"
                  name="sexo"
                  value="mujer"
                  checked={formulario.sexo === 'mujer'}
                  onChange={handleChange}
                  className="hidden"
                />
                <div className={`cursor-pointer text-center py-3 rounded-lg border-2 transition ${
                  formulario.sexo === 'mujer'
                    ? 'bg-uf-gold text-black border-uf-gold'
                    : 'bg-gray-800 text-white border-gray-700 hover:border-gray-600'
                }`}>
                  👩 Mujer
                </div>
              </label>
            </div>
          </div>

          {/* NIVEL DE ACTIVIDAD */}
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-bold">Nivel de Actividad</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {Object.entries(nivelesActividad).map(([key, nivel]) => (
                <label key={key}>
                  <input
                    type="radio"
                    name="actividad"
                    value={key}
                    checked={formulario.actividad === key}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className={`cursor-pointer text-center py-3 px-2 rounded-lg border-2 transition ${
                    formulario.actividad === key
                      ? 'bg-uf-gold text-black border-uf-gold'
                      : 'bg-gray-800 text-white border-gray-700 hover:border-gray-600'
                  }`}>
                    <div className="font-bold text-sm">{nivel.nombre}</div>
                    <div className="text-xs opacity-75">{nivel.descripcion}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* OBJETIVO */}
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-bold">Objetivo</label>
            <div className="grid md:grid-cols-4 gap-2">
              {Object.entries(objetivos).map(([key, obj]) => (
                <label key={key}>
                  <input
                    type="radio"
                    name="objetivo"
                    value={key}
                    checked={formulario.objetivo === key}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className={`cursor-pointer text-center py-3 rounded-lg border-2 transition ${
                    formulario.objetivo === key
                      ? 'bg-uf-gold text-black border-uf-gold'
                      : 'bg-gray-800 text-white border-gray-700 hover:border-gray-600'
                  }`}>
                    <div className="text-2xl mb-1">{obj.icon}</div>
                    <div className="font-bold text-sm">{obj.nombre}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* BOTÓN CALCULAR */}
          <button
            onClick={calcular}
            className="w-full bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold py-4 rounded-lg hover:from-yellow-600 hover:to-uf-gold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Calcular Mis Necesidades
          </button>
        </div>
      ) : null}

      {/* RESULTADO */}
      {resultado && (
        <div className="mt-6 space-y-4">
          <div className="bg-black/30 rounded-lg p-4">
            <div className="text-center mb-4">
              <div className="text-gray-400 text-sm mb-1">TU OBJETIVO:</div>
              <div className="text-uf-gold text-2xl font-bold">{resultado.objetivo}</div>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center bg-gray-800/50 rounded-lg p-4">
                <div className="text-4xl font-bold text-uf-gold mb-1">{resultado.caloriasObjetivo}</div>
                <div className="text-gray-400 text-sm">kcal/día</div>
              </div>
              <div className="text-center bg-gray-800/50 rounded-lg p-4">
                <div className="text-4xl font-bold text-red-400 mb-1">{resultado.proteinas}g</div>
                <div className="text-gray-400 text-sm">Proteínas</div>
              </div>
              <div className="text-center bg-gray-800/50 rounded-lg p-4">
                <div className="text-4xl font-bold text-blue-400 mb-1">{resultado.carbohidratos}g</div>
                <div className="text-gray-400 text-sm">Carbohidratos</div>
              </div>
              <div className="text-center bg-gray-800/50 rounded-lg p-4">
                <div className="text-4xl font-bold text-yellow-400 mb-1">{resultado.grasas}g</div>
                <div className="text-gray-400 text-sm">Grasas</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={resetear}
            className="w-full bg-gray-700 text-white font-bold py-2 rounded-lg hover:bg-gray-600 transition text-sm"
          >
            Recalcular
          </button>
        </div>
      )}
    </div>
  );
}

export default CalculadoraNutricional;