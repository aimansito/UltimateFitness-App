import { useState } from 'react';
import { Dumbbell, Globe, Heart, Lock, Salad, Users } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import socialService, { mensajeError } from '../../services/socialService';
import Icono from '../common/Icono';

const NIVELES = [
  { id: 'publico', nombre: 'Público', Icono: Globe },
  { id: 'seguidores', nombre: 'Seguidores', Icono: Users },
  { id: 'privado', nombre: 'Solo yo', Icono: Lock },
];

const BLOQUES = [
  { id: 'entrenamientos', nombre: 'Entrenamientos', detalle: 'Tus rutinas y el entreno que compartes cada día', Icono: Dumbbell },
  { id: 'dietas', nombre: 'Dietas', detalle: 'Los planes de alimentación que has creado', Icono: Salad },
  { id: 'favoritos', nombre: 'Favoritos', detalle: 'Rutinas, dietas y platos que has guardado', Icono: Heart },
];

// Ajustes de privacidad del perfil. Cada cambio se guarda al momento; si falla, se revierte.
function AjustesPrivacidad({ privacidad, onCambio }) {
  const toast = useToast();
  const [guardando, setGuardando] = useState(null);

  const guardar = async (clave, valor) => {
    if (guardando || privacidad[clave] === valor) return;
    const anterior = privacidad;
    onCambio({ ...privacidad, [clave]: valor });
    setGuardando(clave);
    try {
      const r = await socialService.guardarPrivacidad({ [clave]: valor });
      onCambio(r.privacidad);
    } catch (error) {
      onCambio(anterior);
      toast.error(mensajeError(error, 'No se pudo guardar el ajuste'));
    } finally {
      setGuardando(null);
    }
  };

  const perfilPublico = privacidad.perfilPublico;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-uf-line bg-black/30 p-4">
        <div className="min-w-0">
          <p id="etiqueta-perfil-publico" className="font-semibold text-white">Perfil público</p>
          <p className="mt-0.5 text-sm text-uf-muted">
            {perfilPublico
              ? 'Cualquiera puede ver tu perfil y seguirte.'
              : 'Nadie más puede ver tu contenido ni seguirte.'}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={perfilPublico}
          aria-labelledby="etiqueta-perfil-publico"
          onClick={() => guardar('perfilPublico', !perfilPublico)}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${perfilPublico ? 'bg-uf-gold' : 'bg-gray-700'}`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              perfilPublico ? 'translate-x-5' : ''
            }`}
          />
        </button>
      </div>

      <div className={`space-y-4 ${perfilPublico ? '' : 'pointer-events-none opacity-40'}`} aria-hidden={!perfilPublico}>
        {BLOQUES.map(({ id, nombre, detalle, Icono: IconoBloque }) => (
          <fieldset key={id} disabled={!perfilPublico}>
            <legend className="flex items-center gap-2 font-semibold text-white">
              <Icono de={IconoBloque} className="h-4 w-4 text-uf-gold" />
              {nombre}
            </legend>
            <p className="mb-2 mt-0.5 text-sm text-uf-muted">{detalle}</p>
            <div className="grid grid-cols-3 gap-1 rounded-full border border-uf-line bg-black/40 p-1">
              {NIVELES.map((nivel) => {
                const activo = privacidad[id] === nivel.id;
                return (
                  <button
                    key={nivel.id}
                    type="button"
                    aria-pressed={activo}
                    onClick={() => guardar(id, nivel.id)}
                    className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full px-2 text-xs font-bold transition ${
                      activo ? 'bg-uf-gold text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <nivel.Icono className="hidden h-3.5 w-3.5 sm:block" aria-hidden="true" />
                    {nivel.nombre}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

export default AjustesPrivacidad;
