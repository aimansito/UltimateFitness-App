import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  User,
  Dumbbell,
  Utensils,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Award,
  CreditCard,
  Target,
  Activity,
  Zap,
  Star,
  UserCheck,
  Mail,
  Phone
} from 'lucide-react';

function DashboardUsuario() {
  const { user, isPremium } = useAuth();
  const [estadisticas, setEstadisticas] = useState(null);
  const [entrenador, setEntrenador] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const data = isPremium ? {
        entrenamientos_completados: 12,
        entrenamientos_pendientes: 3,
        dias_activo_mes: 18,
        objetivo: user?.objetivo || 'Mantener peso',
        peso_inicial: 75,
        peso_actual: 72,
        imc: 23.5,
        calorias_objetivo: 2000,
        proximo_entrenamiento: '2025-11-27',
        racha_dias: 5
      } : {
        demo_entrenamientos: 2,
        demo_dietas: 1,
        objetivo: user?.objetivo || 'Mantener peso'
      };

      setEstadisticas(data);
      setLoading(false);
    };

    if (user) fetchDashboardData();
  }, [user, isPremium]);

  useEffect(() => {
    const fetchEntrenador = async () => {
      if (isPremium) {
        try {
          const response = await api.get('/suscripciones/mi-entrenador');
          if (response.data.success) {
            setEntrenador(response.data.entrenador);
          }
        } catch (error) {
          console.log('Usuario premium sin entrenador asignado aún');
        }
      }
    };

    fetchEntrenador();
  }, [isPremium]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Cargando dashboard...
      </div>
    );
  }

  /* USUARIO GRATUITO */
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-black py-12 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="bg-uf-gold py-6 px-8 rounded-t-lg shadow-lg text-black">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <User /> Mi Panel
                </h1>
                <p>Bienvenido, {user?.nombre}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Calendar size={18} />
                {new Date().toLocaleDateString('es-ES')}
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="bg-gray-900 p-8 rounded-b-lg border border-gray-700">

            <div className="border border-blue-500 p-6 rounded-lg mb-8">
              <h3 className="text-xl text-white mb-2 flex items-center gap-2">
                <Target className="text-blue-400" /> Objetivo
              </h3>
              <p className="text-2xl text-blue-400 font-bold">
                {estadisticas?.objetivo}
              </p>
              <p className="text-gray-400">Mejora a Premium para plan personalizado</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card
                icon={<Dumbbell className="w-12 h-12" />}
                title="Mis Entrenamientos"
              />
              <Card
                icon={<Utensils className="w-12 h-12" />}
                title="Mi Dieta"
              />
              <Card
                icon={<TrendingUp className="w-12 h-12" />}
                title="Seguimiento"
              />
            </div>

            <div className="mt-10 text-center border border-uf-gold p-8 rounded-lg">
              <Award className="mx-auto text-uf-gold mb-4" size={50} />
              <Link
                to="/servicios"
                className="bg-uf-gold px-6 py-3 text-black font-bold rounded-lg hover:bg-yellow-600 transition-all inline-block"
              >
                Pasar a Premium
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* USUARIO PREMIUM */
  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-red-700 py-6 px-8 rounded-t-lg text-white">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <User /> <h1 className="text-2xl font-bold">Panel Premium</h1>
              <Star />
            </div>
            {new Date().toLocaleDateString('es-ES')}
          </div>
        </div>

        <div className="bg-gray-900 p-8 rounded-b-lg border border-red-700">

          <div className="grid md:grid-cols-4 gap-6 mb-8">

            <Stat icon={<CheckCircle />} label="Completados" value={estadisticas?.entrenamientos_completados} />
            <Stat icon={<Clock />} label="Pendientes" value={estadisticas?.entrenamientos_pendientes} />
            <Stat icon={<Activity />} label="Días activo" value={estadisticas?.dias_activo_mes} />
            <Stat icon={<Zap />} label="Racha" value={estadisticas?.racha_dias} />

          </div>

          {/* MI ENTRENADOR - Solo para premium */}
          {entrenador && (
            <div className="mb-8 border-2 border-uf-gold rounded-lg overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-uf-gold to-yellow-600 px-6 py-4">
                <h3 className="text-black text-2xl font-bold flex items-center gap-2">
                  <UserCheck className="w-6 h-6" />
                  Mi Entrenador Personal
                </h3>
              </div>
              <div className="bg-gray-900 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-uf-gold to-yellow-600 rounded-full flex items-center justify-center text-black text-5xl font-bold">
                      {entrenador.nombre.charAt(0)}{entrenador.apellidos.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-2">{entrenador.nombre_completo}</h4>
                    <p className="text-uf-gold font-bold mb-4 uppercase">{entrenador.especialidad_formateada}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Mail className="w-4 h-4 text-uf-gold" />
                        <span className="text-sm">{entrenador.email}</span>
                      </div>
                      {entrenador.telefono && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone className="w-4 h-4 text-uf-gold" />
                          <span className="text-sm">{entrenador.telefono}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-300">
                        <Award className="w-4 h-4 text-uf-gold" />
                        <span className="text-sm">{entrenador.anos_experiencia} años de experiencia</span>
                      </div>
                      {entrenador.total_valoraciones > 0 && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{entrenador.valoracion_promedio.toFixed(1)} / 5.0 ({entrenador.total_valoraciones} valoraciones)</span>
                        </div>
                      )}
                    </div>

                    {entrenador.biografia && (
                      <p className="text-gray-400 text-sm mb-4">{entrenador.biografia}</p>
                    )}

                    {entrenador.certificacion && (
                      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Certificación:</p>
                        <p className="text-white text-sm">{entrenador.certificacion}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-8">

            <div className="border border-purple-700 p-6 rounded-lg">
              <h3 className="text-white text-xl mb-4">Objetivo</h3>
              <p className="text-purple-400 font-bold text-2xl">{estadisticas?.objetivo}</p>
              <p className="text-white">Peso: {estadisticas?.peso_actual} kg</p>
            </div>

            <div className="border border-red-700 p-6 rounded-lg">
              <h3 className="text-white text-xl mb-4">Próximo Entrenamiento</h3>
              <p className="text-red-400 text-2xl font-bold">
                {new Date(estadisticas?.proximo_entrenamiento).toLocaleDateString('es-ES')}
              </p>
              <Link
                to="/mis-entrenamientos"
                className="inline-block mt-4 bg-red-600 px-6 py-2 text-white rounded"
              >
                Ver Entrenamientos
              </Link>
            </div>

          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Quick to="/mis-entrenamientos" icon={<Dumbbell />} title="Entrenamientos" />
            <Quick to="/mis-dietas" icon={<Utensils />} title="Mis Dietas" />
            <Quick to="/mi-suscripcion" icon={<CreditCard />} title="Suscripción" />
          </div>

        </div>
      </div>
    </div>
  );
}

/* Componentes reutilizables (limpios y simples) */

const Card = ({ icon, title }) => (
  <div className="border border-gray-700 p-6 rounded-lg text-white">
    {icon}
    <h4 className="font-bold mt-4">{title}</h4>
    <Link
      to="/servicios"
      className="mt-4 inline-block bg-uf-gold text-black px-4 py-2 rounded hover:bg-yellow-600 transition-all"
    >
      Mejorar a Premium
    </Link>
  </div>
);

const Stat = ({ icon, label, value }) => (
  <div className="border border-gray-700 p-6 rounded-lg text-white">
    {icon}
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

const Quick = ({ to, icon, title }) => (
  <Link to={to} className="border border-gray-700 p-6 rounded-lg text-white hover:scale-105 transition">
    {icon}
    <h4 className="font-bold mt-3">{title}</h4>
  </Link>
);

export default DashboardUsuario;
