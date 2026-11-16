// ============================================
// CALCULADORA NUTRICIONAL
// Formulario de calorías y macros. El cálculo vive en utils/calculoNutricional.js
// ============================================
import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import Icono from '../common/Icono';
import { BicepsFlexed, Calculator, Scale, Target, TrendingDown } from 'lucide-react';
import {
  DATOS_VACIOS,
  NIVELES_ACTIVIDAD,
  OBJETIVOS,
  calcularNecesidades,
  validarDatos,
} from '../../utils/calculoNutricional';

const ICONOS_OBJETIVO = { perder_peso: TrendingDown, tonificar: Target, mantener: Scale, ganar_masa: BicepsFlexed };

/**
 * onCalcular(resultado, datos) se llama con cada cálculo.
 * mostrarResultado: enseña el resultado aquí mismo (planificador de dietas).
 *   Con false, el padre decide qué hacer (en el landing: pedir cuenta antes de enseñarlo).
 */
function CalculadoraNutricional({
  onCalcular,
  valoresIniciales,
  mostrarResultado = true,
  textoBoton = 'Calcular mis necesidades',
  titulo = 'Calculadora Nutricional',
  sinMarco = false,
}) {
  const toast = useToast();
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [formulario, setFormulario] = useState({ ...DATOS_VACIOS, ...(valoresIniciales || {}) });
  const [resultado, setResultado] = useState(null);

  const handleChange = (e) => setFormulario({ ...formulario, [e.target.name]: e.target.value });

  const calcular = () => {
    const error = validarDatos(formulario);
    if (error) {
      toast.warning(error);
      return;
    }
    const r = calcularNecesidades(formulario);
    if (mostrarResultado) {
      setResultado(r);
      setMostrarFormulario(false);
    }
    onCalcular?.(r, formulario);
  };

  const resetear = () => {
    setResultado(null);
    setMostrarFormulario(true);
    setFormulario({ ...DATOS_VACIOS });
  };

  const campo = 'w-full rounded-xl border border-uf-line bg-black/50 px-4 py-3 text-white placeholder-gray-600 transition focus:border-uf-gold focus:outline-none';
  const opcion = (activa) =>
    `cursor-pointer rounded-xl border-2 py-3 text-center transition ${
      activa ? 'border-uf-gold bg-uf-gold text-black' : 'border-uf-line bg-black/40 text-white hover:border-gray-500'
    }`;

  return (
    <div className={sinMarco ? '' : 'uf-card border-uf-gold/40 p-6 md:p-8'}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-3 font-anton text-2xl uppercase text-white">
          <Calculator className="h-7 w-7 text-uf-gold" aria-hidden="true" />
          {titulo}
        </h2>
        {resultado && (
          <button type="button" onClick={() => setMostrarFormulario(!mostrarFormulario)} className="text-sm font-semibold text-uf-gold hover:text-white">
            {mostrarFormulario ? 'Ocultar' : 'Editar datos'}
          </button>
        )}
      </div>

      {mostrarFormulario && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-300">Peso (kg)</span>
              <input type="number" name="peso" value={formulario.peso} onChange={handleChange} placeholder="75" min="30" max="300" step="0.1" className={campo} />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-300">Altura (cm)</span>
              <input type="number" name="altura" value={formulario.altura} onChange={handleChange} placeholder="175" min="100" max="250" className={campo} />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-300">Edad</span>
              <input type="number" name="edad" value={formulario.edad} onChange={handleChange} placeholder="30" min="14" max="120" className={campo} />
            </label>
          </div>

          <fieldset>
            <legend className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-300">Sexo</legend>
            <div className="flex gap-3">
              {[
                ['hombre', 'Hombre'],
                ['mujer', 'Mujer'],
              ].map(([valor, nombre]) => (
                <label key={valor} className="flex-1">
                  <input type="radio" name="sexo" value={valor} checked={formulario.sexo === valor} onChange={handleChange} className="sr-only" />
                  <div className={opcion(formulario.sexo === valor)}>{nombre}</div>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-300">Nivel de actividad</legend>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
              {Object.entries(NIVELES_ACTIVIDAD).map(([clave, nivel]) => (
                <label key={clave}>
                  <input type="radio" name="actividad" value={clave} checked={formulario.actividad === clave} onChange={handleChange} className="sr-only" />
                  <div className={`${opcion(formulario.actividad === clave)} px-2`}>
                    <div className="text-sm font-bold">{nivel.nombre}</div>
                    <div className="text-xs opacity-75">{nivel.descripcion}</div>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-300">Objetivo</legend>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {Object.entries(OBJETIVOS).map(([clave, obj]) => (
                <label key={clave}>
                  <input type="radio" name="objetivo" value={clave} checked={formulario.objetivo === clave} onChange={handleChange} className="sr-only" />
                  <div className={opcion(formulario.objetivo === clave)}>
                    <Icono de={ICONOS_OBJETIVO[clave]} className="mx-auto mb-1 h-6 w-6" />
                    <div className="text-sm font-bold">{obj.nombre}</div>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          <button type="button" onClick={calcular} className="uf-btn uf-btn-primary w-full">
            <Calculator className="h-4 w-4" aria-hidden="true" />
            {textoBoton}
          </button>
        </div>
      )}

      {mostrarResultado && resultado && (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-uf-line bg-black/40 p-5">
            <div className="mb-4 text-center">
              <div className="text-xs uppercase tracking-widest text-uf-muted">Tu objetivo</div>
              <div className="font-anton text-2xl uppercase text-uf-gold">{resultado.objetivo}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Dato valor={resultado.caloriasObjetivo} unidad="kcal/día" color="text-uf-gold" />
              <Dato valor={`${resultado.proteinas}g`} unidad="Proteínas" color="text-red-400" />
              <Dato valor={`${resultado.carbohidratos}g`} unidad="Carbohidratos" color="text-blue-400" />
              <Dato valor={`${resultado.grasas}g`} unidad="Grasas" color="text-yellow-400" />
            </div>
          </div>
          <button type="button" onClick={resetear} className="uf-btn uf-btn-ghost w-full !py-2.5 text-sm">
            Recalcular
          </button>
        </div>
      )}
    </div>
  );
}

function Dato({ valor, unidad, color }) {
  return (
    <div className="rounded-xl bg-white/[0.04] p-4 text-center">
      <div className={`font-anton text-3xl ${color}`}>{valor}</div>
      <div className="mt-1 text-xs text-uf-muted">{unidad}</div>
    </div>
  );
}

export default CalculadoraNutricional;
