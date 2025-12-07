import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Star,
  Receipt,
  Clock,
  AlertCircle,
  Crown,
  X
} from 'lucide-react';
import api from '../../services/api';

function MiSuscripcion() {
  const { user, isPremium } = useAuth();
  const toast = useToast();
  const [suscripcion, setSuscripcion] = useState(null);
  const [historialPagos, setHistorialPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const fetchSuscripcion = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isPremium) {
        setSuscripcion({
          id: 1,
          plan: 'Premium Mensual',
          estado: 'activa',
          precio_mensual: 19.99,
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

  const handleCancelarSuscripcion = async () => {
    try {
      const response = await api.post('/suscripciones/cancelar');

      if (response.data.success) {
        setShowCancelModal(false);
        toast.success('✅ Suscripción cancelada correctamente');

        if (response.data.force_logout) {
          setTimeout(() => {
            // Limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirigir
            window.location.href = '/login';
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Error al cancelar:', error);
      setShowCancelModal(false);
      toast.error('❌ ' + (error.response?.data?.error || 'Error al cancelar la suscripción'));
    }
  };

  const handleReactivarSuscripcion = () => {
    toast.success('✅ Suscripción reactivada');
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
              onClick={() => setShowCancelModal(true)}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
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

      {/* Modal de Confirmación */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border-2 border-red-600 rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex justify-center mb-4">
              <div className="bg-red-600/20 p-4 rounded-full">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white text-center mb-3">
              ¿Cancelar Suscripción Premium?
            </h3>

            <p className="text-gray-300 text-center mb-6">
              Perderás acceso inmediato a todas las funciones premium:
            </p>

            <ul className="text-gray-400 text-sm space-y-2 mb-6 pl-6">
              <li className="list-disc">Entrenador personal asignado</li>
              <li className="list-disc">Planes de entrenamiento personalizados</li>
              <li className="list-disc">Dietas personalizadas</li>
              <li className="list-disc">Acceso completo al blog</li>
            </ul>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 transition"
              >
                Mantener Premium
              </button>
              <button
                onClick={handleCancelarSuscripcion}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
              >
                Sí, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MiSuscripcion;
