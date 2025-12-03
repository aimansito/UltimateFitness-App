import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
    Users,
    Activity,
    Utensils,
    Apple,
    Dumbbell,
    FileText,
    CreditCard,
    LayoutDashboard,
    Search,
    Trash2,
    Crown,
    Edit,
    Plus,
    Star,
    Award
} from 'lucide-react';

function DashboardAdmin() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [usuarios, setUsuarios] = useState([]);
    const [entrenadores, setEntrenadores] = useState([]);
    const [dietas, setDietas] = useState([]);
    const [alimentos, setAlimentos] = useState([]);
    const [ejercicios, setEjercicios] = useState([]);
    const [suscripciones, setSuscripciones] = useState([]);
    const [searchUsuarios, setSearchUsuarios] = useState('');
    const [searchAlimentos, setSearchAlimentos] = useState('');
    const [loading, setLoading] = useState(false);
    const [estadisticas, setEstadisticas] = useState(null);

    const tabs = [
        { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
        { id: 'usuarios', label: 'USUARIOS', icon: Users },
        { id: 'entrenadores', label: 'ENTRENADORES', icon: Activity },
        { id: 'dietas', label: 'DIETAS', icon: Utensils },
        { id: 'alimentos', label: 'ALIMENTOS', icon: Apple },
        { id: 'ejercicios', label: 'EJERCICIOS', icon: Dumbbell },
        { id: 'blog', label: 'BLOG', icon: FileText },
        { id: 'suscripciones', label: 'SUSCRIPCIONES', icon: CreditCard },
    ];

    useEffect(() => {
        if (activeTab === 'overview') fetchEstadisticas();
        else if (activeTab === 'usuarios') fetchUsuarios();
        else if (activeTab === 'entrenadores') fetchEntrenadores();
        else if (activeTab === 'dietas') fetchDietas();
        else if (activeTab === 'alimentos') fetchAlimentos();
        else if (activeTab === 'ejercicios') fetchEjercicios();
        else if (activeTab === 'suscripciones') fetchSuscripciones();
    }, [activeTab]);

    const fetchEstadisticas = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/dashboard');
            if (response.data.success) {
                setEstadisticas(response.data.estadisticas);
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
            // Si falla, usar valores por defecto
            setEstadisticas({
                total_usuarios: 0,
                usuarios_normales: 0,
                usuarios_premium: 0,
                total_entrenadores: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/usuarios');
            if (response.data.success) {
                setUsuarios(response.data.usuarios.map(u => ({
                    id: u.id,
                    nombre: u.nombre_completo || `${u.nombre} ${u.apellidos}`,
                    email: u.email,
                    es_premium: u.es_premium,
                    fecha_premium: u.fecha_premium,
                    rol: u.rol
                })));
            }
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            setUsuarios([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchEntrenadores = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/entrenadores');
            if (response.data.success) {
                setEntrenadores(response.data.entrenadores);
            }
        } catch (error) {
            console.error('Error al cargar entrenadores:', error);
            setEntrenadores([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchDietas = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/dietas');
            if (response.data.success) {
                setDietas(response.data.dietas.map(d => ({
                    id: d.id,
                    nombre: d.nombre,
                    calorias: d.calorias_totales,
                    valoracion: d.valoracion_promedio,
                    num_valoraciones: d.total_valoraciones,
                    destacada: d.destacada
                })));
            }
        } catch (error) {
            console.error('Error al cargar dietas:', error);
            setDietas([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAlimentos = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/alimentos');
            if (response.data.success) {
                setAlimentos(response.data.alimentos);
            }
        } catch (error) {
            console.error('Error al cargar alimentos:', error);
            setAlimentos([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchEjercicios = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/ejercicios');
            if (response.data.success) {
                setEjercicios(response.data.ejercicios);
            }
        } catch (error) {
            console.error('Error al cargar ejercicios:', error);
            setEjercicios([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchSuscripciones = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/suscripciones');
            if (response.data.success) {
                setSuscripciones(response.data.suscripciones);
            }
        } catch (error) {
            console.error('Error al cargar suscripciones:', error);
            setSuscripciones([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsuarios = usuarios.filter(u =>
        u.nombre.toLowerCase().includes(searchUsuarios.toLowerCase()) ||
        u.email.toLowerCase().includes(searchUsuarios.toLowerCase())
    );

    const filteredAlimentos = alimentos.filter(a =>
        a.nombre.toLowerCase().includes(searchAlimentos.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="bg-black border-b border-gray-800 py-6 px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold">
                        <span className="text-uf-gold">PANEL</span> ADMIN
                    </h1>
                    <p className="text-gray-400 mt-2">Gestión completa de la plataforma</p>
                    <div className="h-1 w-20 bg-uf-gold mt-4"></div>
                </div>
            </div>

            <div className="bg-black border-b border-gray-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 font-semibold text-xs uppercase tracking-wider transition-all duration-300 whitespace-nowrap border-b-2 ${isActive ? 'text-uf-gold border-uf-gold bg-uf-gold/10' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-700'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-8">
                {activeTab === 'overview' && (
                    <div>
                        <h2 className="text-2xl font-bold text-uf-gold mb-6">ESTADÍSTICAS GENERALES</h2>
                        {loading ? (
                            <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-uf-gold mx-auto"></div></div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-uf-gold transition-all">
                                    <div className="flex items-center justify-between">
                                        <Users className="w-8 h-8 text-blue-400" />
                                        <span className="text-3xl font-bold">{estadisticas?.total_usuarios}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-2">Total Usuarios</p>
                                </div>
                                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-uf-gold transition-all">
                                    <div className="flex items-center justify-between">
                                        <Crown className="w-8 h-8 text-uf-gold" />
                                        <span className="text-3xl font-bold">{estadisticas?.usuarios_premium}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-2">Usuarios Premium</p>
                                </div>
                                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-uf-gold transition-all">
                                    <div className="flex items-center justify-between">
                                        <Activity className="w-8 h-8 text-purple-400" />
                                        <span className="text-3xl font-bold">{estadisticas?.total_entrenadores}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-2">Entrenadores</p>
                                </div>
                                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-uf-gold transition-all">
                                    <div className="flex items-center justify-between">
                                        <Users className="w-8 h-8 text-green-400" />
                                        <span className="text-3xl font-bold">{estadisticas?.usuarios_activos}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-2">Usuarios Activos</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'usuarios' && (
                    <div>
                        <h2 className="text-2xl font-bold text-uf-gold mb-6">GESTIÓN DE USUARIOS</h2>
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" placeholder="Buscar usuarios..." value={searchUsuarios} onChange={(e) => setSearchUsuarios(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-uf-gold transition-all" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            {filteredUsuarios.map((u) => (
                                <div key={u.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-uf-gold transition-all group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-white font-bold">{u.nombre}</h3>
                                                {u.es_premium && <span className="inline-flex items-center gap-1 px-2 py-1 bg-uf-gold text-black text-xs font-bold rounded uppercase"><Crown className="w-3 h-3" />PREMIUM</span>}
                                                {u.rol === 'admin' && <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded uppercase">ADMIN</span>}
                                            </div>
                                            <p className="text-gray-400 text-sm mt-2">📧 {u.email}</p>
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'entrenadores' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-uf-gold">GESTIÓN DE ENTRENADORES</h2>
                            <button className="flex items-center gap-2 bg-uf-gold text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-all"><Plus className="w-5 h-5" />Nuevo Entrenador</button>
                        </div>
                        <div className="space-y-3">
                            {entrenadores.map((e) => (
                                <div key={e.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-uf-gold transition-all group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <Award className="w-5 h-5 text-uf-gold" />
                                                <h3 className="text-white font-bold">{e.nombre}</h3>
                                                <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${e.especialidad === 'Hipertrofia' ? 'bg-orange-600' : e.especialidad === 'Rendimiento' ? 'bg-purple-600' : 'bg-green-600'} text-white`}>{e.especialidad}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm mt-2">{e.anos_experiencia} años de experiencia</p>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-2 text-blue-400 hover:bg-blue-500/10 rounded"><Edit className="w-5 h-5" /></button>
                                            <button className="p-2 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'dietas' && (
                    <div>
                        <h2 className="text-2xl font-bold text-uf-gold mb-6">GESTIÓN DE DIETAS</h2>
                        <div className="space-y-3">
                            {dietas.map((d) => (
                                <div key={d.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-uf-gold transition-all group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-white font-bold">{d.nombre}</h3>
                                                {d.destacada && <span className="px-2 py-1 bg-uf-gold text-black text-xs font-bold rounded uppercase">DESTACADA</span>}
                                                <div className="flex items-center gap-1 text-uf-gold">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <span className="text-sm font-bold">{d.valoracion}</span>
                                                    <span className="text-xs text-gray-400">({d.num_valoraciones})</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-400 text-sm mt-2">{d.calorias} kcal</p>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-2 text-blue-400 hover:bg-blue-500/10 rounded"><Edit className="w-5 h-5" /></button>
                                            <button className="p-2 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'alimentos' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-uf-gold">GESTIÓN DE ALIMENTOS</h2>
                            <button className="flex items-center gap-2 bg-uf-gold text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-all"><Plus className="w-5 h-5" />Nuevo Alimento</button>
                        </div>
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" placeholder="Buscar alimentos..." value={searchAlimentos} onChange={(e) => setSearchAlimentos(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-uf-gold transition-all" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredAlimentos.map((a) => (
                                <div key={a.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-uf-gold transition-all group">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Apple className="w-5 h-5 text-uf-gold" />
                                            <h3 className="text-white font-bold">{a.nombre}</h3>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-1 text-blue-400 hover:bg-blue-500/10 rounded"><Edit className="w-4 h-4" /></button>
                                            <button className="p-1 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2">{a.categoria}</p>
                                    <div className="grid grid-cols-4 gap-2 text-xs">
                                        <span className="text-gray-400">{a.calorias} kcal</span>
                                        <span className="text-orange-400">P:{a.proteinas}g</span>
                                        <span className="text-blue-400">C:{a.carbohidratos}g</span>
                                        <span className="text-yellow-400">G:{a.grasas}g</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'ejercicios' && (
                    <div>
                        <h2 className="text-2xl font-bold text-uf-gold mb-6">GESTIÓN DE EJERCICIOS</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ejercicios.map((ej) => (
                                <div key={ej.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-uf-gold transition-all group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <Dumbbell className="w-5 h-5 text-uf-gold" />
                                            <h3 className="text-white font-bold">{ej.nombre}</h3>
                                            {ej.premium && <span className="px-2 py-1 bg-orange-600 text-white text-xs font-bold rounded uppercase">PREMIUM</span>}
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-2 text-blue-400 hover:bg-blue-500/10 rounded"><Edit className="w-5 h-5" /></button>
                                            <button className="p-2 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'suscripciones' && (
                    <div>
                        <h2 className="text-2xl font-bold text-uf-gold mb-6">GESTIÓN DE SUSCRIPCIONES</h2>
                        {loading ? (
                            <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-uf-gold mx-auto"></div></div>
                        ) : suscripciones.length === 0 ? (
                            <div className="text-center py-12">
                                <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg">No hay suscripciones registradas</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {suscripciones.map((sus) => (
                                    <div key={sus.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-uf-gold transition-all">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <CreditCard className="w-5 h-5 text-uf-gold" />
                                                    <h3 className="text-white font-bold">{sus.usuario_nombre_completo}</h3>
                                                    <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${sus.estado === 'activa' ? 'bg-green-600' : sus.estado === 'cancelada' ? 'bg-red-600' : 'bg-gray-600'} text-white`}>
                                                        {sus.estado}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                                    <p className="text-gray-400">📧 {sus.usuario_email}</p>
                                                    <p className="text-gray-400">💳 Plan: {sus.plan_nombre || 'N/A'}</p>
                                                    <p className="text-gray-400">💰 {sus.precio_pagado}€</p>
                                                    <p className="text-gray-400">📅 {new Date(sus.fecha_inicio).toLocaleDateString('es-ES')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {!['overview', 'usuarios', 'entrenadores', 'dietas', 'alimentos', 'ejercicios', 'suscripciones'].includes(activeTab) && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900 border-2 border-gray-800 rounded-full mb-4">
                            {tabs.find(t => t.id === activeTab)?.icon && (() => {
                                const Icon = tabs.find(t => t.id === activeTab).icon;
                                return <Icon className="w-10 h-10 text-uf-gold" />;
                            })()}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{tabs.find(t => t.id === activeTab)?.label}</h3>
                        <p className="text-gray-400">Próximamente disponible</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardAdmin;
