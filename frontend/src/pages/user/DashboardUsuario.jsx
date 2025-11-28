import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
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
  Star
} from 'lucide-react';

function DashboardUsuario() {
  const { user, isPremium } = useAuth();
  const [estadisticas, setEstadisticas] = useState(null);
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
                className="bg-uf-gold px-6 py-3 text-black font-bold rounded-lg"
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
            <Quick to="/mi-dieta" icon={<Utensils />} title="Mi Dieta" />
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
      className="mt-4 inline-block bg-uf-gold text-black px-4 py-2 rounded"
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
