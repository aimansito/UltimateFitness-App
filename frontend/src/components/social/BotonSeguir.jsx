import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import socialService, { mensajeError } from '../../services/socialService';

// Seguir / Siguiendo con actualización optimista; si el servidor falla, se revierte
function BotonSeguir({ tipo, id, loSigo, onCambio, compacto = false }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [ocupado, setOcupado] = useState(false);

  const alternar = async () => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }
    if (ocupado) return;

    const siguiente = !loSigo;
    setOcupado(true);
    onCambio({ loSigo: siguiente, delta: siguiente ? 1 : -1 });
    try {
      const r = siguiente ? await socialService.seguir(tipo, id) : await socialService.dejarDeSeguir(tipo, id);
      onCambio({ loSigo: r.loSigo, seguidores: r.seguidores });
    } catch (error) {
      onCambio({ loSigo, delta: siguiente ? -1 : 1 });
      toast.error(mensajeError(error, 'No se pudo actualizar el seguimiento'));
    } finally {
      setOcupado(false);
    }
  };

  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={loSigo}
      aria-busy={ocupado}
      className={`uf-btn ${loSigo ? 'uf-btn-ghost' : 'uf-btn-primary'} ${compacto ? '!px-4 !py-2 !text-xs' : ''}`}
    >
      {loSigo ? <Check className="h-4 w-4" aria-hidden="true" /> : <UserPlus className="h-4 w-4" aria-hidden="true" />}
      {loSigo ? 'Siguiendo' : 'Seguir'}
    </button>
  );
}

export default BotonSeguir;
