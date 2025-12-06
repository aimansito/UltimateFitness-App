import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Star,
  Receipt,
  Clock,
  AlertCircle,
  Crown
} from 'lucide-react';

function MiSuscripcion() {
  const { user, isPremium } = useAuth();
  const [suscripcion, setSuscripcion] = useState(null);
  const [historialPagos, setHistorialPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuscripcion = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isPremium) {
        setSuscripcion({
          id: 1,
          plan: 'Premium Mensual',
          estado: 'activa',
          precio_mensual: 29.99,
          fecha_inicio: '2024-11-01',
          fecha_renovacion: '2025-12-01',
          metodo_pago: 'Tarjeta terminada en 4242',
          auto_renovacion: true,
          dias_restantes: 5
        });

        setHistorialPagos([
          { id: 1, fecha: '2024-11-01', monto: 29.99, estado: 'completado', concepto: 'Premium Noviembre 2024' },
          { id: 2, fecha: '2024-10-01', monto: 29.99, estado: 'completado', concepto: 'Premium Octubre 2024' }
        ]);
      }

      setLoading(false);
    };

    if (user) fetchSuscripcion();
  }, [user, isPremium]);

  const handleCancelarSuscripcion = () => {
    if (!confirm('¿Cancelar suscripción Premium?')) return;
    alert('Suscripción cancelada (simulado)');
  };

  const handleReactivarSuscripcion = () => {
    alert('Suscripción reactivada (simulado)');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Cargando...
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-black py-12 px-4">
        <div className="max-w-5xl mx-auto bg-gray-900 p-10 rounded-lg border">
          <h1 className="text-3xl font-bold text-uf-gold mb-6 text-center">
            Usuario Gratuito
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border">
              <h4 className="text-xl font-bold text-white mb-2">
                Premium Mensual
              </h4>
              <p className="text-3xl text-uf-gold mb-4">29.99€/mes</p>

              <a
                href="/upgrade-premium"
                className="block w-full text-center bg-uf-gold text-black font-bold py-3 rounded-lg"
              >
                Suscribirse
              </a>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-red-500 relative">
              <span className="absolute -top-3 right-4 bg-red-600 px-3 py-1 text-xs font-bold rounded-full">
                AHORRA
              </span>
              <h4 className="text-xl font-bold text-white mb-2">
                Premium Anual
              </h4>
              <p className="text-3xl text-uf-gold mb-4">287.99€/año</p>

              <a
                href="/upgrade-premium"
                className="block w-full text-center bg-red-600 text-white font-bold py-3 rounded-lg"
              >
                Suscribirse
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-6xl mx-auto bg-gray-900 p-8 rounded-lg border">

        {/* Estado */}
        <div className="border rounded-lg p-6 mb-8 flex justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {suscripcion?.plan}
            </h2>

            <p className="text-gray-300">
              {suscripcion?.precio_mensual}€/mes
            </p>

            <p className="text-gray-400 flex items-center gap-2">
              <CreditCard size={16} /> {suscripcion?.metodo_pago}
            </p>
          </div>

          <div className="text-white text-right">
            <p>Renovación:</p>
            <p className="font-bold">
              {new Date(suscripcion?.fecha_renovacion).toLocaleDateString('es-ES')}
            </p>
            <p className="text-sm text-gray-400">
              {suscripcion?.dias_restantes} días restantes
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 mb-8">
          {suscripcion?.estado === 'activa' ? (
            <button
              onClick={handleCancelarSuscripcion}
              className="px-6 py-2 bg-red-600 text-white rounded"
            >
              Cancelar Suscripción
            </button>
          ) : (
            <button
              onClick={handleReactivarSuscripcion}
              className="px-6 py-2 bg-green-600 text-white rounded"
            >
              Reactivar Suscripción
            </button>
          )}
        </div>

        {/* Pagos */}
        <h3 className="text-xl text-white mb-4">Historial de pagos</h3>

        {historialPagos.map(pago => (
          <div key={pago.id} className="bg-gray-800 p-4 rounded mb-3 flex justify-between">
            <div>
              <p className="text-white">{pago.concepto}</p>
              <p className="text-gray-400 text-sm">
                {new Date(pago.fecha).toLocaleDateString()}
              </p>
            </div>
            <p className="text-uf-gold font-bold">{pago.monto}€</p>
          </div>
        ))}

      </div>
    </div>
  );
}

export default MiSuscripcion;
