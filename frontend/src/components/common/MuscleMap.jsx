import Model from 'react-body-highlighter';

const GOLD = '#CC941A';
const BODY = '#2b2b2b';

// Grupo muscular de la app -> regiones del modelo y vista en la que mejor se aprecian
const GRUPOS = {
  pecho: { vista: 'anterior', musculos: ['chest'] },
  espalda: { vista: 'posterior', musculos: ['trapezius', 'upper-back', 'lower-back'] },
  piernas: { vista: 'anterior', musculos: ['quadriceps', 'adductor', 'calves', 'hamstring'] },
  hombros: { vista: 'anterior', musculos: ['front-deltoids', 'back-deltoids'] },
  biceps: { vista: 'anterior', musculos: ['biceps'] },
  triceps: { vista: 'posterior', musculos: ['triceps'] },
  brazos: { vista: 'anterior', musculos: ['biceps', 'triceps', 'forearm'] },
  agarre: { vista: 'anterior', musculos: ['forearm'] },
  core: { vista: 'anterior', musculos: ['abs', 'obliques'] },
  gluteos: { vista: 'posterior', musculos: ['gluteal'] },
  cadera: { vista: 'posterior', musculos: ['gluteal', 'abductors', 'hamstring'] },
  fullbody: {
    vista: 'anterior',
    musculos: [
      'chest', 'abs', 'obliques', 'biceps', 'front-deltoids', 'quadriceps', 'calves',
      'trapezius', 'upper-back', 'lower-back', 'triceps', 'back-deltoids', 'gluteal', 'hamstring',
    ],
  },
  cardio: { vista: 'anterior', musculos: ['quadriceps', 'calves', 'abs', 'hamstring', 'gluteal'] },
};

export const normalizarGrupo = (grupo) =>
  (grupo || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\s_-]/g, '');

export const gruposDisponibles = Object.keys(GRUPOS);

/** Músculos del modelo para una lista de grupos de la app (sin repetir) */
const musculosDe = (grupos = []) => [
  ...new Set(grupos.flatMap((g) => GRUPOS[normalizarGrupo(g)]?.musculos || [])),
];

// Músculo pulsado en la figura -> grupo de la app (para elegir grupos tocando el cuerpo)
const GRUPO_DE_MUSCULO = {
  chest: 'pecho',
  trapezius: 'espalda', 'upper-back': 'espalda', 'lower-back': 'espalda',
  quadriceps: 'piernas', adductor: 'piernas', abductors: 'piernas', hamstring: 'piernas', calves: 'piernas', 'left-soleus': 'piernas', 'right-soleus': 'piernas',
  'front-deltoids': 'hombros', 'back-deltoids': 'hombros',
  biceps: 'biceps', forearm: 'biceps',
  triceps: 'triceps',
  abs: 'core', obliques: 'core',
  gluteal: 'gluteos',
};
const grupoDeMusculo = (musculo) => GRUPO_DE_MUSCULO[musculo] || null;

/**
 * Figura anatómica con lo trabajado resaltado en dorado.
 * grupo: un grupo muscular · grupos: varios a la vez (p. ej. los ejercicios de un entreno)
 * vista: 'auto' (la que mejor muestra el grupo) | 'anterior' | 'posterior' | 'ambas'
 * onGrupo (opcional): la figura se puede pulsar y devuelve el grupo de la app del músculo tocado
 */
function MuscleMap({ grupo, grupos, vista = 'auto', className = '', color = GOLD, bodyColor = BODY, onGrupo }) {
  const lista = grupos?.length ? grupos : grupo ? [grupo] : [];
  const config = lista.length === 1 ? GRUPOS[normalizarGrupo(lista[0])] : null;
  const musculos = musculosDe(lista);
  const data = musculos.length ? [{ name: lista.join(', '), muscles: musculos }] : [];
  const vistas =
    vista === 'ambas' ? ['anterior', 'posterior'] : [vista === 'auto' ? config?.vista || 'anterior' : vista];

  return (
    <div
      className={`uf-muscle-map flex items-center justify-center gap-[6%] ${onGrupo ? 'uf-muscle-map--interactivo' : ''} ${className}`}
      role={onGrupo ? 'group' : 'img'}
      aria-label={musculos.length ? `Zona trabajada: ${lista.join(', ')}` : 'Figura anatómica'}
    >
      {vistas.map((v) => (
        <Model
          key={v}
          type={v}
          data={data}
          bodyColor={bodyColor}
          highlightedColors={[color]}
          onClick={
            onGrupo
              ? ({ muscle }) => {
                  const g = grupoDeMusculo(muscle);
                  if (g) onGrupo(g);
                }
              : undefined
          }
          style={{ height: '100%', flex: '1 1 0', minWidth: 0, display: 'flex', justifyContent: 'center' }}
          svgStyle={{ height: '100%', width: 'auto', maxWidth: '100%' }}
        />
      ))}
    </div>
  );
}

export default MuscleMap;
