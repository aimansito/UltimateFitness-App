import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
    Users,
    Shield,
    TrendingUp,
    Calendar,
    Settings,
    Database,
    Activity,
    DollarSign
} from 'lucide-react';

function DashboardAdmin() {
    const { user } = useAuth();
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // TODO: Llamar al endpoint del backend
                // const response = await axios.get(`/api/admin/dashboard`);

                // Simulación de datos
                await new Promise(resolve => setTimeout(resolve, 1000));

                const estadisticasMock = {
                    total_usuarios: 1247,
                    usuarios_premium: 342,
                    usuarios_gratuitos: 905,
                    total_entrenadores: 28,
                    usuarios_activos_mes: 856,
                    ingresos_mes: 12450,
                    nuevos_usuarios_mes: 134
                };

                setEstadisticas(estadisticasMock);
            } catch (error) {
                console.error('Error al cargar dashboard admin:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold mx-auto mb-4"></div>
                    <p className="text-white text-xl">Cargando panel de administración...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-800 py-6 px-8 rounded-t-lg shadow-lg">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                <Shield className="w-8 h-8" />
                                Panel de Administración
                            </h1>
                            <p className="text-white/80 mt-1">Bienvenido, {user?.nombre}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-white" />
                            <span className="text-white font-semibold">
                                {new Date().toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contenido */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-b-lg shadow-2xl border border-gray-700">

                    {/* Estadísticas principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Usuarios */}
                        <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-2 border-blue-700 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-500/20 rounded-lg">
                                    <Users className="w-8 h-8 text-blue-400" />
                                </div>
                            </div>
                            <p className="text-blue-400 text-sm font-semibold uppercase tracking-wide mb-1">Total Usuarios</p>
                            <p className="text-4xl font-bold text-white">{estadisticas?.total_usuarios}</p>
                            <p className="text-gray-400 text-xs mt-2">
                                +{estadisticas?.nuevos_usuarios_mes} este mes
                            </p>
                        </div>

                        {/* Usuarios Premium */}
                        <div className="bg-gradient-to-br from-uf-gold/20 to-yellow-600/10 border-2 border-uf-gold rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-uf-gold/20 rounded-lg">
                                    <TrendingUp className="w-8 h-8 text-uf-gold" />
                                </div>
                            </div>
                            <p className="text-uf-gold text-sm font-semibold uppercase tracking-wide mb-1">Premium</p>
                            <p className="text-4xl font-bold text-white">{estadisticas?.usuarios_premium}</p>
                            <p className="text-gray-400 text-xs mt-2">
                                {((estadisticas?.usuarios_premium / estadisticas?.total_usuarios) * 100).toFixed(1)}% del total
                            </p>
                        </div>

                        {/* Entrenadores */}
                        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-2 border-purple-700 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-500/20 rounded-lg">
                                    <Activity className="w-8 h-8 text-purple-400" />
                                </div>
                            </div>
                            <p className="text-purple-400 text-sm font-semibold uppercase tracking-wide mb-1">Entrenadores</p>
                            <p className="text-4xl font-bold text-white">{estadisticas?.total_entrenadores}</p>
                            <p className="text-gray-400 text-xs mt-2">Activos en la plataforma</p>
                        </div>

                        {/* Ingresos */}
                        <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border-2 border-green-700 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-500/20 rounded-lg">
                                    <DollarSign className="w-8 h-8 text-green-400" />
                                </div>
                            </div>
                            <p className="text-green-400 text-sm font-semibold uppercase tracking-wide mb-1">Ingresos Mes</p>
                            <p className="text-4xl font-bold text-white">${estadisticas?.ingresos_mes}</p>
                            <p className="text-gray-400 text-xs mt-2">Suscripciones activas</p>
                        </div>
                    </div>

                    {/* Accesos rápidos a funciones de admin */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-lg p-6">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Settings className="w-6 h-6 text-uf-gold" />
                            Gestión Rápida
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link
                                to="/admin/usuarios"
                                className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-2 border-blue-700 rounded-lg p-6 hover:scale-105 transition-all duration-300 group"
                            >
                                <Users className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold text-white mb-2">Gestionar Usuarios</h3>
                                <p className="text-gray-400 text-sm">Ver y administrar todos los usuarios</p>
                            </Link>

                            <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 border-2 border-gray-700 rounded-lg p-6 hover:scale-105 transition-all duration-300 group opacity-50">
                                <Database className="w-12 h-12 text-gray-400 mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold text-white mb-2">Base de Datos</h3>
                                <p className="text-gray-400 text-sm">Próximamente disponible</p>
                            </div>

                            <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 border-2 border-gray-700 rounded-lg p-6 hover:scale-105 transition-all duration-300 group opacity-50">
                                <Settings className="w-12 h-12 text-gray-400 mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold text-white mb-2">Configuración</h3>
                                <p className="text-gray-400 text-sm">Próximamente disponible</p>
                            </div>
                        </div>
                    </div>

                    {/* Nota informativa */}
                    <div className="mt-8 bg-gradient-to-r from-uf-gold/10 to-yellow-600/10 border-2 border-uf-gold rounded-lg p-6">
                        <div className="flex items-start gap-3">
                            <Shield className="w-6 h-6 text-uf-gold flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="text-white font-bold text-lg mb-2">Panel en Desarrollo</h4>
                                <p className="text-gray-300 text-sm">
                                    Este panel de administración está en construcción. Las estadísticas mostradas son de ejemplo.
                                    Próximamente se añadirán más funcionalidades de gestión y análisis.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardAdmin;
