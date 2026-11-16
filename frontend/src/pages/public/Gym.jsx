// ============================================
// GYM - Biblioteca de ejercicios de gimnasio
// ============================================
import RutinasOficiales from '../../components/social/RutinasOficiales';
import BibliotecaEjercicios from '../../components/gym/BibliotecaEjercicios';

const EJERCICIOS_MUESTRA = [
  {
    id: 1,
    nombre: 'Press de Banca',
    descripcion: 'Ejercicio fundamental para el desarrollo del pecho',
    grupoMuscular: 'pecho',
    tipo: 'compuesto',
    nivelDificultad: 'intermedio',
    valoracionPromedio: 4.8,
    totalValoraciones: 245,
    videoUrl: null,
  },
  {
    id: 2,
    nombre: 'Sentadillas',
    descripcion: 'El rey de los ejercicios para piernas',
    grupoMuscular: 'piernas',
    tipo: 'compuesto',
    nivelDificultad: 'intermedio',
    valoracionPromedio: 4.9,
    totalValoraciones: 312,
    videoUrl: null,
  },
  {
    id: 3,
    nombre: 'Dominadas',
    descripcion: 'Ejercicio completo para la espalda',
    grupoMuscular: 'espalda',
    tipo: 'compuesto',
    nivelDificultad: 'avanzado',
    valoracionPromedio: 4.7,
    totalValoraciones: 198,
    videoUrl: null,
  },
  {
    id: 4,
    nombre: 'Curl de Bíceps',
    descripcion: 'Aislamiento para el desarrollo de bíceps',
    grupoMuscular: 'biceps',
    tipo: 'aislamiento',
    nivelDificultad: 'principiante',
    valoracionPromedio: 4.5,
    totalValoraciones: 167,
    videoUrl: null,
  },
  {
    id: 5,
    nombre: 'Press Militar',
    descripcion: 'Press de hombro de pie con barra, básico de fuerza para deltoides',
    grupoMuscular: 'hombros',
    tipo: 'compuesto',
    nivelDificultad: 'avanzado',
    valoracionPromedio: 4.7,
    totalValoraciones: 198,
    videoUrl: null,
  },
  {
    id: 6,
    nombre: 'Plancha Abdominal',
    descripcion: 'Isométrico de core manteniendo el cuerpo alineado',
    grupoMuscular: 'core',
    tipo: 'aislamiento',
    nivelDificultad: 'principiante',
    valoracionPromedio: 4.7,
    totalValoraciones: 289,
    videoUrl: null,
  },
];

function Gym() {
  return (
    <>
    <BibliotecaEjercicios
      seo={{
        title: 'Gimnasio y Ejercicios',
        description:
          'Biblioteca completa de ejercicios de gimnasio, clasificados por grupo muscular y nivel. Domina la técnica perfecta.',
        keywords:
          'ejercicios gimnasio, cómo hacer press de banca, rutinas gym, ejercicios pecho, ejercicios espalda, fitness',
      }}
      eyebrow="Gym training"
      title="Biblioteca de"
      highlight="Ejercicios"
      subtitle="Explora los ejercicios por grupo muscular y nivel, con la zona trabajada marcada en cada uno."
      ejerciciosMuestra={EJERCICIOS_MUESTRA}
    />
    <RutinasOficiales />
    </>
  );
}

export default Gym;
