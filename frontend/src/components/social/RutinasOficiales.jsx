import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import socialService, { rutaPerfil } from '../../services/socialService';
import TarjetaItemSocial from './TarjetaItemSocial';

const NIVELES = [
  { id: 'todos', nombre: 'Todas' },
  { id: 'principiante', nombre: 'Principiante' },
  { id: 'intermedio', nombre: 'Intermedio' },
  { id: 'avanzado', nombre: 'Avanzado' },
];

// Rutinas preparadas por la cuenta oficial: se pueden guardar o copiar desde aquí
function RutinasOficiales() {
  const [datos, setDatos] = useState(null);
  const [nivel, setNivel] = useState('todos');

  useEffect(() => {
    socialService
      .perfilOficial()
      .then(setDatos)
      .catch(() => setDatos(null));
  }, []);

  const rutinas = datos?.entrenamientos?.items || [];
  if (rutinas.length === 0) return null;

  const visibles = nivel === 'todos' ? rutinas : rutinas.filter((r) => r.nivel === nivel);

  return (
    <section className="container mx-auto px-4 pb-24" aria-labelledby="titulo-rutinas-oficiales">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="uf-eyebrow">Planes listos</span>
          <h2 id="titulo-rutinas-oficiales" className="mt-3 font-anton text-4xl uppercase text-white md:text-5xl">
            Rutinas <span className="uf-text-gold">listas para usar</span>
          </h2>
          <p className="mt-3 max-w-2xl text-uf-muted">
            Preparadas por el equipo de Ultimate Fitness. Guárdalas en favoritos o cópialas a tu cuenta y adáptalas a ti.
          </p>
        </div>
        <Link to={rutaPerfil(datos.perfil)} className="uf-btn uf-btn-ghost shrink-0">
          Ver todo el contenido
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar por nivel">
        {NIVELES.map((n) => (
          <button
            key={n.id}
            type="button"
            aria-pressed={nivel === n.id}
            onClick={() => setNivel(n.id)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              nivel === n.id ? 'border-uf-gold bg-uf-gold text-black' : 'border-uf-line text-gray-300 hover:border-uf-gold/60'
            }`}
          >
            {n.nombre}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((item) => (
          <TarjetaItemSocial key={`oficial-${item.id}`} item={item} />
        ))}
      </div>
    </section>
  );
}

export default RutinasOficiales;
