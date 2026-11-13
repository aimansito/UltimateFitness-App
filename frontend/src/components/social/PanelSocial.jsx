import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, ShieldCheck } from 'lucide-react';
import socialService, { rutaPerfil } from '../../services/socialService';
import AjustesPrivacidad from './AjustesPrivacidad';
import EntrenoHoy from './EntrenoHoy';
import FeedEntrenos from './FeedEntrenos';
import SubirAvatar from './SubirAvatar';

// Bloque social del dashboard: mi perfil (foto + privacidad), entreno del día y feed
function PanelSocial() {
  const [perfil, setPerfil] = useState(null);
  const [verPrivacidad, setVerPrivacidad] = useState(false);
  const [refrescoFeed, setRefrescoFeed] = useState(0);

  useEffect(() => {
    socialService
      .miPerfil()
      .then(setPerfil)
      .catch(() => setPerfil(null));
  }, []);

  return (
    <div className="mb-10 grid gap-6 lg:grid-cols-3">
      <section className="uf-card p-6" aria-labelledby="titulo-mi-perfil">
        <span className="uf-eyebrow">Comunidad</span>
        <h2 id="titulo-mi-perfil" className="mt-2 font-anton text-2xl uppercase text-white">
          Mi perfil
        </h2>

        {!perfil ? (
          <div className="mt-5 h-24 animate-pulse rounded-2xl bg-white/5" />
        ) : (
          <>
            <div className="mt-5">
              <SubirAvatar
                nombre={perfil.nombre}
                fotoUrl={perfil.fotoUrl}
                onCambio={(fotoUrl) => setPerfil((p) => ({ ...p, fotoUrl }))}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl border border-uf-line bg-black/30 py-3">
                <p className="font-anton text-2xl text-white">{perfil.seguidores}</p>
                <p className="text-xs uppercase tracking-wider text-uf-muted">Seguidores</p>
              </div>
              <div className="rounded-2xl border border-uf-line bg-black/30 py-3">
                <p className="font-anton text-2xl text-white">{perfil.seguidos}</p>
                <p className="text-xs uppercase tracking-wider text-uf-muted">Siguiendo</p>
              </div>
            </div>

            <Link to={rutaPerfil(perfil)} className="uf-btn uf-btn-primary mt-5 w-full">
              Ver mi perfil público
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={() => setVerPrivacidad((v) => !v)}
              aria-expanded={verPrivacidad}
              aria-controls="ajustes-privacidad"
              className="mt-3 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-white/5 hover:text-white"
            >
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-uf-gold" aria-hidden="true" />
                Privacidad
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${verPrivacidad ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>

            {verPrivacidad && (
              <div id="ajustes-privacidad" className="mt-3">
                <AjustesPrivacidad
                  privacidad={perfil.privacidad}
                  onCambio={(privacidad) => setPerfil((p) => ({ ...p, privacidad }))}
                />
              </div>
            )}
          </>
        )}
      </section>

      <EntrenoHoy onCompartido={() => setRefrescoFeed((n) => n + 1)} />
      <FeedEntrenos refresco={refrescoFeed} />
    </div>
  );
}

export default PanelSocial;
