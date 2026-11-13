import { Award, Star, Send } from 'lucide-react';
import Card from './Card';
import Button from './Button';

function TarjetaEntrenador({ entrenador, onSolicitar, deshabilitado = false, motivoDeshabilitado = '' }) {
  const iniciales = `${entrenador.nombre?.charAt(0) || ''}${entrenador.apellidos?.charAt(0) || ''}`;

  return (
    <Card className="p-6 flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        {entrenador.foto_url ? (
          <img
            src={entrenador.foto_url}
            alt={entrenador.nombre_completo}
            className="w-16 h-16 rounded-full object-cover border-2 border-uf-gold"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-uf-gold to-yellow-600 rounded-full flex items-center justify-center text-black text-xl font-bold">
            {iniciales}
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-white">{entrenador.nombre_completo}</h3>
          <p className="text-uf-gold text-xs font-bold uppercase">{entrenador.especialidad_formateada}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
        <span className="flex items-center gap-1">
          <Award className="w-4 h-4 text-uf-gold" /> {entrenador.anos_experiencia} años
        </span>
        {entrenador.total_valoraciones > 0 && (
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            {Number(entrenador.valoracion_promedio).toFixed(1)} ({entrenador.total_valoraciones})
          </span>
        )}
      </div>

      {entrenador.biografia && (
        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">{entrenador.biografia}</p>
      )}

      <Button
        onClick={() => onSolicitar(entrenador)}
        disabled={deshabilitado}
        className="w-full flex items-center justify-center gap-2"
        title={deshabilitado ? motivoDeshabilitado : ''}
      >
        <Send className="w-4 h-4" /> Solicitar entrenamiento
      </Button>
    </Card>
  );
}

export default TarjetaEntrenador;
