import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { EntrenadorCard } from '../../components/user/EntrenadorCard';
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
  Phone,
  ChevronRight,
  Loader,
  Crown
} from 'lucide-react';

function DashboardUsuario() {
  const { user, isPremium } = useAuth();
  const [estadisticas, setEstadisticas] = useState(null);
  const [entrenador, setEntrenador] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get(`/usuarios/${user.id}/progreso`);
        if (response.data.success) {
          const stats = response.data.estadisticas;
          const uData = response.data.usuario;

          const data = isPremium ? {
            entrenamientos_completados: stats.totalCompletados || 0,
            entrenamientos_pendientes: (stats.totalAgendados || 0) - (stats.totalCompletados || 0),
            dias_activo_mes: stats.diasActivo || 0,
            objetivo: uData.objetivo || user?.objetivo || 'Mantener peso',
            peso_actual: user?.peso_actual || 70,
            proximo_entrenamiento: new Date().toISOString(),
            racha_dias: stats.diasActivo > 0 ? 1 : 0
          } : {
            demo_entrenamientos: stats.totalAgendados || 0,
            demo_dietas: 0,
            objetivo: uData.objetivo || user?.objetivo || 'Mantener peso'
          };

          setEstadisticas(data);
        }
      } catch (error) {
        console.error('Error cargando estadísticas del dashboard:', error);
      } finally {
        setLoading(false);
      }
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
        <Loader className="w-12 h-12 text-uf-gold animate-spin" />
      </div>
    );
  }

  /* =======================================
     LAYOUT - USUARIO GRATUITO
  ======================================= */
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-uf-darker to-black py-12 px-4 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-uf-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="bg-gradient-to-r from-uf-gold to-yellow-600 p-8 rounded-t-2xl shadow-xl shadow-uf-gold/10 text-black flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-black/70 font-semibold uppercase tracking-wider text-sm mb-1">Plan Básico</p>
              <h1 className="text-4xl font-anton font-bold uppercase tracking-wider">
                Bienvenido, {user?.nombre}
              </h1>
            </div>
            <div className="bg-black/10 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-3 font-semibold text-black/80">
              <Calendar className="w-5 h-5 text-black" />
              {new Date().toLocaleDateString('es-ES')}
            </div>
          </div>

          {/* Contenido principal */}
          <div className="bg-gray-900/80 backdrop-blur-2xl p-8 rounded-b-2xl border-x border-b border-gray-800 shadow-2xl">

            {/* Banner Objetivo */}
            <div className="bg-gradient-to-r from-blue-900/40 to-black border border-blue-500/30 p-8 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-500/50 transition">
              <div>
                <h3 className="text-xl text-blue-300 mb-2 flex items-center gap-2 font-bold font-anton uppercase tracking-wider">
                  <Target className="text-blue-400 w-6 h-6" /> Objetivo Principal
                </h3>
                <p className="text-4xl text-white font-bold capitalize">
                  {estadisticas?.objetivo}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 mb-2">Desbloquea rutinas específicas para este objetivo</p>
                <Link to="/upgrade-premium" className="text-blue-400 font-semibold hover:text-blue-300 flex items-center justify-end gap-1">
                  Ver planes <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card isLocked icon={<Dumbbell className="w-10 h-10 text-gray-500 mb-4" />} title="Mis Entrenamientos" />
              <Card isLocked icon={<Utensils className="w-10 h-10 text-gray-500 mb-4" />} title="Mi Dieta Personalizada" />
              <Card isLocked icon={<TrendingUp className="w-10 h-10 text-gray-500 mb-4" />} title="Seguimiento Premium" />
            </div>

            {/* Upsell Zone */}
            <div className="text-center bg-gradient-to-br from-black to-gray-900 border-2 border-uf-gold border-dashed p-10 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-uf-gold/5 group-hover:bg-uf-gold/10 transition duration-500"></div>
              <Award className="mx-auto text-uf-gold mb-6 relative z-10" size={64} />
              <h2 className="text-3xl font-anton font-bold text-white mb-4 relative z-10">LLEVA TUS RESULTADOS AL SIGUIENTE NIVEL</h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto relative z-10">
                Obtén un entrenador personal, planes de dieta a medida y rutinas exclusivas con el Plan Premium.
              </p>
              <Link
                to="/upgrade-premium"
                className="relative z-10 bg-uf-gold px-10 py-4 text-black font-bold uppercase tracking-wider rounded-xl hover:bg-yellow-500 transition-all transform hover:scale-105 shadow-xl shadow-uf-gold/20 inline-flex items-center gap-2"
              >
                <Zap className="w-5 h-5" /> Ver Beneficios Premium
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  /* =======================================
     LAYOUT - USUARIO PREMIUM
  ======================================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12 px-4 relative overflow-hidden">
      {/* Background glow effects for Premium */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-uf-gold/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-800 via-red-700 to-red-900 py-8 px-10 rounded-t-2xl text-white shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-10 rotate-12">
            <Crown className="w-64 h-64" />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-black/20 p-4 rounded-full backdrop-blur-md">
              <Star className="w-8 h-8 text-uf-gold fill-uf-gold" />
            </div>
            <div>
              <p className="text-red-200 uppercase tracking-widest text-xs font-bold mb-1">Miembro Exclusivo</p>
              <h1 className="text-4xl font-anton font-bold tracking-wide">
                HOLA, {user?.nombre?.toUpperCase()}
              </h1>
            </div>
          </div>
          <div className="relative z-10 bg-black/20 backdrop-blur-md px-6 py-3 rounded-xl border border-red-500/30 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-red-300" />
            <span className="font-semibold tracking-wide">{new Date().toLocaleDateString('es-ES')}</span>
          </div>
        </div>

        {/* Contenido Dashboard Premium */}
        <div className="bg-gray-900/60 backdrop-blur-2xl p-6 md:p-10 rounded-b-2xl border-x border-b border-red-900/50 shadow-2xl">

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
            <Stat icon={<CheckCircle className="text-green-500" />} label="Completados" value={estadisticas?.entrenamientos_completados} border="border-green-500/30" bg="bg-green-500/5" />
            <Stat icon={<Clock className="text-orange-500" />} label="Pendientes" value={estadisticas?.entrenamientos_pendientes} border="border-orange-500/30" bg="bg-orange-500/5" />
            <Stat icon={<Activity className="text-blue-500" />} label="Días Activo" value={estadisticas?.dias_activo_mes} border="border-blue-500/30" bg="bg-blue-500/5" />
            <Stat icon={<Zap className="text-uf-gold" />} label="Racha Actual" value={`${estadisticas?.racha_dias} 🔥`} border="border-uf-gold/30" bg="bg-uf-gold/5" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-10">
            {/* Columna Izquierda: Entrenador (ocupa 2 columnas) */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* MI ENTRENADOR */}
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-1">
                <EntrenadorCard entrenador={entrenador} />
              </div>
            </div>

            {/* Columna Derecha: Objetivos y Próximo entrenamiento */}
            <div className="flex flex-col gap-6">
              <div className="bg-gradient-to-br from-purple-900/30 to-black border border-purple-500/30 p-6 rounded-2xl shadow-xl group hover:border-purple-500/60 transition">
                <h3 className="text-purple-300 text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" /> Mi Meta
                </h3>
                <p className="text-white font-anton text-2xl uppercase tracking-wider mb-2 group-hover:text-purple-200 transition">
                  {estadisticas?.objetivo}
                </p>
                <div className="bg-black/50 rounded-lg p-3 inline-flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300 font-semibold">{estadisticas?.peso_actual} kg</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-900/30 to-black border border-red-600/30 p-6 rounded-2xl shadow-xl flex-1 flex flex-col justify-between group hover:border-red-500/60 transition">
                <div>
                  <h3 className="text-red-300 text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-red-500" /> Siguiente Cita
                  </h3>
                  <p className="text-white font-anton text-3xl mb-4">
                    {new Date(estadisticas?.proximo_entrenamiento).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>
                <Link
                  to="/mis-entrenamientos"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl uppercase tracking-wider text-center transition shadow-lg shadow-red-600/20 w-full"
                >
                  Empezar ahora
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Quick to="/mis-entrenamientos" icon={<Dumbbell className="w-8 h-8 text-blue-400 mb-3" />} title="Rutinas" hoverColor="hover:border-blue-500/50 hover:shadow-blue-500/10" />
            <Quick to="/mis-dietas" icon={<Utensils className="w-8 h-8 text-green-400 mb-3" />} title="Mi Dieta" hoverColor="hover:border-green-500/50 hover:shadow-green-500/10" />
            <Quick to="/mi-suscripcion" icon={<CreditCard className="w-8 h-8 text-uf-gold mb-3" />} title="Facturación" hoverColor="hover:border-uf-gold/50 hover:shadow-uf-gold/10" />
          </div>

        </div>
      </div>
    </div>
  );
}

/* =======================================
   REUSABLE COMPONENTS
======================================= */

const Card = ({ icon, title, isLocked }) => (
  <div className="bg-gray-800/40 border border-gray-700/50 p-8 rounded-2xl text-center relative overflow-hidden group">
    {isLocked && (
      <div className="absolute top-4 right-4 bg-gray-900/80 p-2 rounded-full border border-gray-700">
        <Star className="w-4 h-4 text-gray-500" />
      </div>
    )}
    <div className="flex justify-center">{icon}</div>
    <h4 className="font-bold text-white text-lg mb-6">{title}</h4>
    <Link
      to="/upgrade-premium"
      className="inline-flex items-center gap-2 bg-gray-700/50 text-gray-300 font-semibold px-6 py-2.5 rounded-lg hover:bg-uf-gold hover:text-black transition-all"
    >
      Desbloquear
    </Link>
  </div>
);

const Stat = ({ icon, label, value, border, bg }) => (
  <div className={`${bg} border ${border} p-6 rounded-2xl flex items-center justify-between shadow-lg group hover:scale-[1.02] transition-transform`}>
    <div>
      <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">{label}</p>
      <p className="text-3xl font-anton text-white">{value}</p>
    </div>
    <div className="opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all">
      {icon}
    </div>
  </div>
);

const Quick = ({ to, icon, title, hoverColor }) => (
  <Link to={to} className={`bg-gray-800/40 border border-gray-700/50 p-6 rounded-2xl flex flex-col items-center justify-center transition-all shadow-lg ${hoverColor} group`}>
    <div className="group-hover:-translate-y-2 transition-transform duration-300">
      {icon}
    </div>
    <h4 className="font-bold text-white tracking-wide uppercase text-sm mt-2">{title}</h4>
  </Link>
);

export default DashboardUsuario;
