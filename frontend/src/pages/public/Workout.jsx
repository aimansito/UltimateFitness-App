// ============================================
// WORKOUT - Entrenamiento funcional y calistenia
// ============================================
import BibliotecaEjercicios from '../../components/gym/BibliotecaEjercicios';

const EJERCICIOS_MUESTRA = [
  {
    id: 1,
    nombre: 'Flexiones',
    descripcion: 'Ejercicio clásico de calistenia para pecho y tríceps',
    grupoMuscular: 'pecho',
    tipo: 'calistenia',
    nivelDificultad: 'principiante',
    valoracionPromedio: 4.7,
    totalValoraciones: 289,
    videoUrl: null,
  },
  {
    id: 2,
    nombre: 'Burpees',
    descripcion: 'Ejercicio funcional de cuerpo completo',
    grupoMuscular: 'core',
    tipo: 'funcional',
    nivelDificultad: 'intermedio',
    valoracionPromedio: 4.6,
    totalValoraciones: 234,
    videoUrl: null,
  },
  {
    id: 3,
    nombre: 'Plancha',
    descripcion: 'Isométrico fundamental para el core',
    grupoMuscular: 'core',
    tipo: 'isométrico',
    nivelDificultad: 'principiante',
    valoracionPromedio: 4.8,
    totalValoraciones: 312,
    videoUrl: null,
  },
  {
    id: 4,
    nombre: 'Mountain Climbers',
    descripcion: 'Ejercicio dinámico para cardio y core',
    grupoMuscular: 'core',
    tipo: 'funcional',
    nivelDificultad: 'intermedio',
    valoracionPromedio: 4.5,
    totalValoraciones: 198,
    videoUrl: null,
  },
];

function Workout() {
  return (
    <BibliotecaEjercicios
      seo={{
        title: 'Entrenamiento Funcional y Calistenia',
        description:
          'Consigue resultados entrenando al aire libre o en casa con ejercicios funcionales y rutinas de calistenia.',
        keywords: 'entrenamiento funcional, calistenia, rutinas en casa, peso corporal, flexiones, burpees',
      }}
      eyebrow="Al aire libre"
      title="Workout"
      highlight="Exercises"
      subtitle="Rutinas de entrenamiento funcional y calistenia para entrenar donde quieras."
      ejerciciosMuestra={EJERCICIOS_MUESTRA}
    />
  );
}

export default Workout;
