// ============================================
// PERFIL PÚBLICO - /perfil/:tipo/:id
// ============================================
import { ENTRENADORES } from "../../config/funciones";
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Camera, Clock, Dumbbell, Heart, Lock, Salad, Settings, UserX, Users, X } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Icono from '../../components/common/Icono';
import Avatar from '../../components/social/Avatar';
import BotonSeguir from '../../components/social/BotonSeguir';
import ListaCuentasModal from '../../components/social/ListaCuentasModal';
import TarjetaItemSocial from '../../components/social/TarjetaItemSocial';
import socialService, { urlFoto } from '../../services/socialService';

const PESTANAS = [
  { id: 'publicaciones', nombre: 'Publicaciones', Icono: Camera, vacio: 'Todavía no ha publicado ningún entreno.', vacioMio: 'Cuando completes un entreno, pulsa «Publicar en mi perfil» y aparecerá aquí.' },
  { id: 'entrenamientos', nombre: 'Entrenamientos', Icono: Dumbbell, vacio: 'Todavía no ha publicado ninguna rutina.', vacioMio: 'Aún no tienes rutinas. Las que crees aparecerán aquí y podrás decidir cuáles se ven.' },
  { id: 'dietas', nombre: 'Dietas', Icono: Salad, vacio: 'Todavía no ha publicado ninguna dieta.', vacioMio: 'Aún no tienes dietas creadas por ti.' },
  { id: 'favoritos', nombre: 'Favoritos', Icono: Heart, vacio: 'Todavía no ha guardado nada.', vacioMio: 'Guarda rutinas, dietas y platos de otras personas para tenerlos aquí.' },
];

const MOTIVOS = {
  seguidores: { Icono: Users, titulo: 'Solo para seguidores', texto: 'Sigue a esta persona para ver este contenido.' },
  privado: { Icono: Lock, titulo: 'Contenido privado', texto: 'Esta persona ha decidido no compartir esta sección.' },
  perfil_privado: { Icono: Lock, titulo: 'Este perfil es privado', texto: 'Su contenido no está disponible.' },
};

function PerfilPublico() {
  const { tipo, id } = useParams();
  const [datos, setDatos] = useState(null);
  const [estado, setEstado] = useState('cargando'); // cargando | listo | no_encontrado | error
  const [pestana, setPestana] = useState('entrenamientos');
  const [lista, setLista] = useState(null); // 'seguidores' | 'seguidos' | null
  const [ampliada, setAmpliada] = useState(null); // publicación abierta en grande

  const cargar = useCallback(
    async (silencioso = false) => {
      if (!silencioso) setEstado('cargando');
      try {
        if (!ENTRENADORES && tipo !== 'usuario') {
          setEstado('no_encontrado');
          return;
        }
        const r = await socialService.perfilPublico(tipo, id);
        setDatos(r);
        // Los perfiles de entrenador no tienen publicaciones: se empieza por sus rutinas
        if (!silencioso) setPestana(r.publicaciones ? 'publicaciones' : 'entrenamientos');
        setEstado('listo');
      } catch (error) {
        setEstado(error?.response?.status === 404 ? 'no_encontrado' : 'error');
      }
    },
    [tipo, id]
  );

  useEffect(() => {
    setLista(null);
    setAmpliada(null);
    cargar();
  }, [cargar]);

  if (estado === 'cargando') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-uf-darker" role="status" aria-label="Cargando perfil">
        <div className="h-14 w-14 animate-spin rounded-full border-b-4 border-t-4 border-uf-gold" />
      </div>
    );
  }

  if (estado !== 'listo') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-uf-darker px-4">
        <div className="uf-card max-w-md p-10 text-center">
          <UserX className="mx-auto h-12 w-12 text-uf-muted" aria-hidden="true" />
          <h1 className="mt-5 font-anton text-3xl uppercase text-white">
            {estado === 'no_encontrado' ? 'Perfil no encontrado' : 'No se pudo cargar el perfil'}
          </h1>
          <p className="mt-3 text-uf-muted">
            {estado === 'no_encontrado'
              ? 'Puede que el enlace sea incorrecto o que la cuenta ya no exista.'
              : 'Inténtalo de nuevo en unos segundos.'}
          </p>
          {estado === 'error' ? (
            <button type="button" onClick={() => cargar()} className="uf-btn uf-btn-primary mt-7">
              Reintentar
            </button>
          ) : (
            <Link to="/" className="uf-btn uf-btn-primary mt-7">
              Volver al inicio
            </Link>
          )}
        </div>
      </div>
    );
  }

  const { perfil } = datos;
  const oculto = !perfil.perfilPublico && !perfil.esMio && perfil.seguidores === null;
  const bloque = datos[pestana];
  const pestanas = PESTANAS.filter((p) => datos[p.id]);
  const pestanaActual = PESTANAS.find((p) => p.id === pestana);

  const alSeguir = ({ loSigo, seguidores, delta }) => {
    setDatos((d) => ({
      ...d,
      perfil: {
        ...d.perfil,
        loSigo,
        seguidores: seguidores ?? Math.max(0, (d.perfil.seguidores ?? 0) + (delta ?? 0)),
      },
    }));
    // Al confirmar el servidor, se recarga por si algún bloque es "solo seguidores"
    if (seguidores !== undefined) cargar(true);
  };

  return (
    <div className="min-h-screen bg-uf-darker pb-24">
      <SEO
        title={`${perfil.nombre} en Ultimate Fitness`}
        description={`Rutinas, dietas y favoritos de ${perfil.nombre} en Ultimate Fitness.`}
      />

      {/* CABECERA */}
      <header className="relative isolate overflow-hidden border-b border-uf-line">
        <div className="uf-grid-bg absolute inset-0 -z-10" aria-hidden="true" />
        <div className="uf-glow -z-10 left-1/2 top-[-55%] h-80 w-[44rem] -translate-x-1/2" aria-hidden="true" />
        <div className="h-28 sm:h-36" aria-hidden="true" />

        <div className="container mx-auto max-w-5xl px-4 pb-8">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-end sm:text-left">
            <Avatar
              nombre={perfil.nombre}
              fotoUrl={perfil.fotoUrl}
              tamano="xl"
              className="-mt-14 border-2 !border-uf-gold shadow-2xl shadow-uf-gold/20 ring-4 ring-uf-darker sm:-mt-20"
            />

            <div className="min-w-0 flex-1">
              <span className="uf-eyebrow justify-center sm:justify-start">
                {perfil.tipo === 'entrenador' ? 'Entrenador' : 'Miembro'}
              </span>
              <h1 className="mt-2 break-words font-anton text-4xl uppercase leading-none text-white sm:text-6xl">
                {perfil.nombre}
              </h1>
              {perfil.bio && <p className="mt-3 max-w-2xl text-gray-300">{perfil.bio}</p>}
            </div>

            <div className="shrink-0">
              {perfil.esMio ? (
                <Link to="/dashboard" className="uf-btn uf-btn-ghost">
                  <Settings className="h-4 w-4" aria-hidden="true" />
                  Editar perfil
                </Link>
              ) : (
                !oculto && <BotonSeguir tipo={perfil.tipo} id={perfil.id} loSigo={perfil.loSigo} onCambio={alSeguir} />
              )}
            </div>
          </div>

          {!oculto && (
            <div className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
              {[
                { modo: 'seguidores', etiqueta: 'Seguidores', valor: perfil.seguidores },
                { modo: 'seguidos', etiqueta: 'Siguiendo', valor: perfil.seguidos },
              ].map((c) => (
                <button
                  key={c.modo}
                  type="button"
                  onClick={() => setLista(c.modo)}
                  className="min-w-24 flex-1 rounded-2xl border border-uf-line bg-uf-card px-4 py-3 text-center transition hover:border-uf-gold/60 sm:flex-none sm:px-5"
                >
                  <span className="block font-anton text-3xl leading-none text-white">{c.valor}</span>
                  <span className="mt-1 block text-xs uppercase tracking-wider text-uf-muted">{c.etiqueta}</span>
                </button>
              ))}
              <div className="min-w-24 flex-1 rounded-2xl border border-uf-line bg-uf-card px-4 py-3 text-center sm:flex-none sm:px-5">
                <span className="block font-anton text-3xl leading-none text-white">
                  {datos.entrenamientos.visible ? datos.entrenamientos.items.length : '—'}
                </span>
                <span className="mt-1 block text-xs uppercase tracking-wider text-uf-muted">Rutinas</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto max-w-5xl px-4 pt-8">
        {oculto ? (
          <EstadoBloqueado motivo="perfil_privado" />
        ) : (
          <>
            {perfil.esMio && !perfil.perfilPublico && (
              <p className="mb-6 flex items-center gap-2 rounded-2xl border border-uf-gold/40 bg-uf-gold/5 px-4 py-3 text-sm text-gray-200">
                <Lock className="h-4 w-4 shrink-0 text-uf-gold" aria-hidden="true" />
                Tu perfil está en privado: solo tú ves esta página.
              </p>
            )}

            {/* PESTAÑAS */}
            <div role="tablist" aria-label="Contenido del perfil" className="mb-8 flex gap-1 overflow-x-auto rounded-full border border-uf-line bg-uf-card p-1">
              {pestanas.map(({ id: pid, nombre, Icono: IconoPestana }) => {
                const activa = pestana === pid;
                return (
                  <button
                    key={pid}
                    type="button"
                    role="tab"
                    id={`tab-${pid}`}
                    aria-selected={activa}
                    aria-controls="panel-perfil"
                    onClick={() => setPestana(pid)}
                    className={`inline-flex min-h-11 flex-auto items-center justify-center gap-2 whitespace-nowrap rounded-full px-3 text-xs sm:flex-1 sm:px-4 font-bold uppercase tracking-wider transition sm:text-sm ${
                      activa ? 'bg-uf-gold text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icono de={IconoPestana} className="hidden h-4 w-4 sm:block" />
                    {nombre}
                    {datos[pid].visible && (
                      <span className={`text-[11px] ${activa ? 'text-black/60' : 'text-gray-600'}`}>
                        {datos[pid].items.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div id="panel-perfil" role="tabpanel" aria-labelledby={`tab-${pestana}`}>
              {!bloque.visible && <EstadoBloqueado motivo={bloque.motivo} />}

              {bloque.visible && bloque.items.length === 0 && (
                <div className="uf-card px-6 py-16 text-center">
                  <pestanaActual.Icono className="mx-auto h-10 w-10 text-uf-muted" aria-hidden="true" />
                  <p className="mx-auto mt-4 max-w-sm text-uf-muted">
                    {perfil.esMio ? pestanaActual.vacioMio : pestanaActual.vacio}
                  </p>
                </div>
              )}

              {pestana === 'publicaciones' && bloque.visible && bloque.items.length > 0 && (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {bloque.items.map((pub) => (
                    <li key={pub.id} className="min-w-0">
                      <TarjetaPublicacion pub={pub} onAbrir={() => setAmpliada(pub)} />
                    </li>
                  ))}
                </ul>
              )}

              {pestana !== 'publicaciones' && bloque.visible && bloque.items.length > 0 && (
                <>
                  {perfil.esMio && pestana !== 'favoritos' && (
                    <p className="mb-4 text-sm text-uf-muted">
                      Solo tú ves lo que está oculto. Pulsa el botón de cada tarjeta para mostrarlo u ocultarlo en tu perfil.
                    </p>
                  )}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {bloque.items.map((item) => (
                      <TarjetaItemSocial
                        key={`${pestana}-${item.itemTipo}-${item.id}`}
                        item={item}
                        gestionable={perfil.esMio && pestana !== 'favoritos'}
                        onCambio={perfil.esMio && pestana === 'favoritos' ? () => cargar(true) : undefined}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {ampliada?.fotoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Entreno: ${ampliada.entrenamiento}`}
          onClick={() => setAmpliada(null)}
        >
          <button type="button" onClick={() => setAmpliada(null)} aria-label="Cerrar" className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-uf-line bg-black/60 text-white">
            <X className="h-5 w-5" />
          </button>
          <img src={urlFoto(ampliada.fotoUrl)} alt={`Entreno ${ampliada.entrenamiento}`} className="max-h-full max-w-full rounded-2xl object-contain" />
        </div>
      )}

      {lista && (
        <ListaCuentasModal tipo={perfil.tipo} id={perfil.id} modo={lista} onCerrar={() => setLista(null)} />
      )}
    </div>
  );
}

const fechaCorta = (f) => (f ? new Date(f.replace(' ', 'T')).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : '');

function TarjetaPublicacion({ pub, onAbrir }) {
  const pie = (
    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-10 text-left">
      <span className="block truncate font-anton text-lg uppercase leading-tight text-white">{pub.entrenamiento}</span>
      <span className="mt-0.5 flex items-center gap-2 text-[11px] uppercase tracking-wider text-gray-300">
        {fechaCorta(pub.fecha)}
        {pub.duracionMinutos ? (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {pub.duracionMinutos} min
          </span>
        ) : null}
      </span>
    </span>
  );
  if (!pub.fotoUrl) {
    return (
      <div className="relative flex aspect-[9/16] items-center justify-center overflow-hidden rounded-2xl border border-uf-line bg-uf-card">
        <Dumbbell className="h-10 w-10 text-uf-gold/60" aria-hidden="true" />
        {pie}
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onAbrir}
      className="group relative block aspect-[9/16] w-full overflow-hidden rounded-2xl border border-uf-line bg-black transition hover:border-uf-gold/60"
      aria-label={`Ver entreno ${pub.entrenamiento}`}
    >
      <img src={urlFoto(pub.fotoUrl)} alt="" loading="lazy" className={`h-full w-full transition group-hover:scale-[1.02] ${pub.fotoEsTarjeta ? 'object-contain' : 'object-cover'}`} />
      {!pub.fotoEsTarjeta && pie}
    </button>
  );
}

function EstadoBloqueado({ motivo }) {
  const { Icono, titulo, texto } = MOTIVOS[motivo] || MOTIVOS.privado;
  return (
    <div className="uf-card px-6 py-16 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-uf-gold/30 bg-uf-gold/10 text-uf-gold">
        <Icono className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 font-anton text-2xl uppercase text-white">{titulo}</h2>
      <p className="mx-auto mt-2 max-w-sm text-uf-muted">{texto}</p>
    </div>
  );
}

export default PerfilPublico;
