import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Clock, X, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import solicitudesService from '../../services/solicitudesService';
import TarjetaEntrenador from '../../components/common/TarjetaEntrenador';
import { useToast } from '../../context/ToastContext';

function DescubrirEntrenadores() {
  const { isPremium } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [entrenadores, setEntrenadores] = useState([]);
  const [miSolicitud, setMiSolicitud] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const cargar = async () => {
    setLoading(true);

    const resSolicitud = await solicitudesService.miSolicitud();
    if (resSolicitud.success) {
      setMiSolicitud(resSolicitud.solicitud);
    } else {
      setMiSolicitud(null);
    }

    if (!resSolicitud.success) {
      const resEntrenadores = await solicitudesService.descubrirEntrenadores();
      if (resEntrenadores.success) {
        setEntrenadores(resEntrenadores.entrenadores);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isPremium) cargar();
    else setLoading(false);
  }, [isPremium]);

  const handleSolicitar = async (entrenador) => {
    setEnviando(true);
    const res = await solicitudesService.solicitar(entrenador.id);
    if (res.success) {
      toast.success(`Solicitud enviada a ${entrenador.nombre_completo}`);
      await cargar();
    } else {
      toast.error(res.error);
    }
    setEnviando(false);
  };

  const handleCancelar = async () => {
    if (!miSolicitud) return;
    const res = await solicitudesService.cancelar(miSolicitud.id);
    if (res.success) {
      toast.success('Solicitud cancelada');
      await cargar();
    } else {
      toast.error(res.error);
    }
  };

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <h1 className="text-3xl font-anton text-white mb-4 uppercase">Solo para Premium</h1>
          <p className="text-gray-400 mb-8">Hazte premium para buscar y solicitar un entrenador personal.</p>
          <Link to="/upgrade-premium" className="bg-uf-gold px-8 py-3 text-black font-bold uppercase rounded-lg">
            Ver planes Premium
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader className="w-12 h-12 text-uf-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-uf-darker to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-anton font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-3">
          <Search className="w-8 h-8 text-uf-gold" /> Buscar Entrenador
        </h1>
        <p className="text-gray-400 mb-10">Encuentra al entrenador ideal para ti y solicita entrenar con él.</p>

        {miSolicitud ? (
          <div className="bg-gray-900/80 border-2 border-uf-gold rounded-2xl p-8 max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-uf-gold" />
              <h2 className="text-xl font-bold text-white">
                {miSolicitud.estado === 'pendiente' ? 'Solicitud pendiente' : 'Solicitud aceptada'}
              </h2>
            </div>
            <p className="text-gray-300 mb-6">
              {miSolicitud.estado === 'pendiente'
                ? `Esperando respuesta de ${miSolicitud.entrenador?.nombre_completo}.`
                : `¡${miSolicitud.entrenador?.nombre_completo} ha aceptado tu solicitud!`}
            </p>
            {miSolicitud.estado === 'pendiente' && (
              <button
                onClick={handleCancelar}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold"
              >
                <X className="w-4 h-4" /> Cancelar solicitud
              </button>
            )}
            {miSolicitud.estado === 'aceptada' && (
              <Link to="/user/dashboard" className="text-uf-gold hover:text-yellow-400 font-semibold">
                Ir a mi panel
              </Link>
            )}
          </div>
        ) : entrenadores.length === 0 ? (
          <p className="text-gray-400">No hay entrenadores disponibles ahora mismo.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entrenadores.map((entrenador) => (
              <TarjetaEntrenador
                key={entrenador.id}
                entrenador={entrenador}
                onSolicitar={handleSolicitar}
                deshabilitado={enviando}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DescubrirEntrenadores;
