import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import Modal from '../../components/admin/Modal';
import {
    Users, Activity, Utensils, Apple, Dumbbell, FileText, LayoutDashboard,
    Search, Trash2, Crown, Edit, Plus, Star, Award, Loader, Save, X, Eye, Calendar
} from 'lucide-react';

function DashboardAdmin() {
    const { user } = useAuth();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [searchUsuarios, setSearchUsuarios] = useState('');
    const [searchAlimentos, setSearchAlimentos] = useState('');

    // Estados para datos
    const [estadisticas, setEstadisticas] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [entrenadores, setEntrenadores] = useState([]);
    const [dietas, setDietas] = useState([]);
    const [alimentos, setAlimentos] = useState([]);
    const [ejercicios, setEjercicios] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);

    // Estados para modales
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' o 'edit'
    const [currentEntity, setCurrentEntity] = useState(null);
    const [formData, setFormData] = useState({});

    // Estados para detalle de dieta
    const [dietaDetalleOpen, setDietaDetalleOpen] = useState(false);
    const [dietaActual, setDietaActual] = useState(null);
    const [planSemanal, setPlanSemanal] = useState({});
    const [diaSeleccionado, setDiaSeleccionado] = useState('lunes');

    const tabs = [
        { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
        { id: 'usuarios', label: 'USUARIOS', icon: Users },
        { id: 'entrenadores', label: 'ENTRENADORES', icon: Activity },
        { id: 'dietas', label: 'DIETAS', icon: Utensils },
        { id: 'alimentos', label: 'ALIMENTOS', icon: Apple },
        { id: 'ejercicios', label: 'EJERCICIOS', icon: Dumbbell },
        { id: 'blog', label: 'BLOG', icon: FileText }
    ];

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'overview') await fetchEstadisticas();
            else if (activeTab === 'usuarios') await fetchUsuarios();
            else if (activeTab === 'entrenadores') await fetchEntrenadores();
            else if (activeTab === 'dietas') await fetchDietas();
            else if (activeTab === 'alimentos') await fetchAlimentos();
            else if (activeTab === 'ejercicios') await fetchEjercicios();
            else if (activeTab === 'blog') await fetchBlogPosts();
        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEstadisticas = async () => {
        const response = await api.get('/admin/dashboard');
        if (response.data.success) setEstadisticas(response.data.estadisticas);
    };

    const fetchUsuarios = async () => {
        const response = await api.get('/admin/usuarios');
        if (response.data.success) setUsuarios(response.data.usuarios);
    };

    const fetchEntrenadores = async () => {
        const response = await api.get('/admin/entrenadores');
        if (response.data.success) setEntrenadores(response.data.entrenadores);
    };

    const fetchDietas = async () => {
        const response = await api.get('/admin/dietas');
        if (response.data.success) {
            setDietas(response.data.dietas.map(d => ({
                ...d,
                destacada: (d.valoracion_promedio > 4.5 && d.total_valoraciones > 100)
            })));
        }
    };

    const fetchAlimentos = async () => {
        const response = await api.get('/admin/alimentos');
        if (response.data.success) setAlimentos(response.data.alimentos);
    };

    const fetchEjercicios = async () => {
        const response = await api.get('/admin/ejercicios');
        if (response.data.success) setEjercicios(response.data.ejercicios);
    };

    const fetchBlogPosts = async () => {
        const response = await api.get('/admin/blog');
        if (response.data.success) setBlogPosts(response.data.posts);
    };

    const handleCreate = (type) => {
        setModalMode('create');
        setCurrentEntity(type);
        setFormData({});
        setModalOpen(true);
    };

    const handleEdit = (type, item) => {
        setModalMode('edit');
        setCurrentEntity(type);
        setFormData(item);
        setModalOpen(true);
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este elemento?')) return;

        try {
            const endpoint = `/${type}/${id}`;
            const response = await api.delete(`/admin${endpoint}`);
            if (response.data.success) {
                toast.success('✅ Eliminado exitosamente');
                loadData();
            }
        } catch (error) {
            toast.error('❌ No se pudo eliminar');
        }
    };

    const handleSave = async () => {
        try {
            const endpoint = `/admin/${currentEntity}${modalMode === 'edit' ? `/${formData.id}` : ''}`;
            const method = modalMode === 'edit' ? 'put' : 'post';

            const response = await api[method](endpoint, formData);

            if (response.data.success) {
                toast.success(modalMode === 'edit' ? '✅ Actualizado exitosamente' : '✅ Creado exitosamente');
                setModalOpen(false);
                loadData();
            }
        } catch (error) {
            toast.error('❌ No se pudo guardar. Intenta de nuevo');
        }
    };

    const handleUpdateUsuario = async (usuarioId, updates) => {
        try {
            const response = await api.put(`/admin/usuarios/${usuarioId}`, updates);
            if (response.data.success) {
                toast.success('✅ Usuario actualizado exitosamente');
                loadData();
            }
        } catch (error) {
            toast.error('❌ Error al actualizar usuario');
        }
    };

    const handleVerDetalleDieta = async (dietaId) => {
        try {
            const response = await api.get(`/usuario/dieta/${dietaId}`);
            if (response.data.success) {
                setDietaActual(response.data.dieta);
                setPlanSemanal(response.data.plan_semanal);
                setDiaSeleccionado('lunes');
                setDietaDetalleOpen(true);
            }
        } catch (error) {
            toast.error('❌ Error al cargar dieta');
        }
    };

    const calcularTotalesDia = () => {
        const dia = planSemanal[diaSeleccionado];
        if (!dia) return { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };

        let totales = { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };

        Object.values(dia).forEach(momentoPlatos => {
            momentoPlatos.forEach(plato => {
                totales.calorias += plato.calorias || 0;
                totales.proteinas += plato.proteinas || 0;
                totales.carbohidratos += plato.carbohidratos || 0;
                totales.grasas += plato.grasas || 0;
            });
        });

        return totales;
    };

    const getMomentoNombre = (momento) => {
        const nombres = {
            'desayuno': 'Desayuno',
            'media_manana': 'Media Mañana',
            'almuerzo': 'Almuerzo',
            'merienda': 'Merienda',
            'cena': 'Cena',
            'post_entreno': 'Post-Entreno'
        };
        return nombres[momento] || momento;
    };

    const renderForm = () => {
        if (currentEntity === 'usuarios') {
            return (
                <div className="space-y-4">
                    <input type="text" placeholder="Nombre" value={formData.nombre || ''} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                    <input type="text" placeholder="Apellidos" value={formData.apellidos || ''} onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                    <input type="email" placeholder="Email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                    <input type="tel" placeholder="Teléfono" value={formData.telefono || ''} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />

                    {/* Campos de contraseña solo para crear nuevo usuario */}
                    {modalMode === 'create' && (
                        <>
                            <input
                                type="password"
                                placeholder="Contraseña (dejar vacío para usar 'cambiar123')"
                                value={formData.password || ''}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                            />
                            <input
                                type="password"
                                placeholder="Confirmar contraseña"
                                value={formData.passwordConfirm || ''}
                                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                            />
                        </>
                    )}

                    <select value={formData.objetivo || ''} onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
                        <option value="">Objetivo</option>
                        <option value="perdida_peso">Pérdida de peso</option>
                        <option value="ganancia_muscular">Ganancia muscular</option>
                        <option value="mantenimiento">Mantenimiento</option>
                        <option value="rendimiento">Rendimiento</option>
                    </select>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Edad" value={formData.edad || ''} onChange={(e) => setFormData({ ...formData, edad: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                        <input type="number" step="0.1" placeholder="Peso (kg)" value={formData.peso_actual || ''} onChange={(e) => setFormData({ ...formData, peso_actual: parseFloat(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                        <input type="number" step="0.1" placeholder="Altura (cm)" value={formData.altura || ''} onChange={(e) => setFormData({ ...formData, altura: parseFloat(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                        <select value={formData.sexo || ''} onChange={(e) => setFormData({ ...formData, sexo: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
                            <option value="">Sexo</option>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                        </select>
                    </div>
                    <label className="flex items-center gap-2 text-white">
                        <input type="checkbox" checked={formData.es_premium || false} onChange={(e) => setFormData({ ...formData, es_premium: e.target.checked })} className="w-5 h-5" />
                        <span>Usuario Premium</span>
                    </label>
                    <label className="flex items-center gap-2 text-white">
                        <input type="checkbox" checked={formData.es_admin || false} onChange={(e) => setFormData({ ...formData, es_admin: e.target.checked })} className="w-5 h-5" />
                        <span>🔐 Es Administrador</span>
                    </label>
                </div>
            );
        }

        if (currentEntity === 'entrenadores') {
            return (
                <div className="space-y-4">
                    <input type="text" placeholder="Nombre" value={formData.nombre || ''} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                    <input type="text" placeholder="Apellidos" value={formData.apellidos || ''} onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                    <input type="email" placeholder="Email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                    <input type="tel" placeholder="Teléfono" value={formData.telefono || ''} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                    <select value={formData.especialidad || 'ambos'} onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
                        <option value="nutricion">Nutrición</option>
                        <option value="entrenamiento">Entrenamiento</option>
                        <option value="ambos">Nutrición y Entrenamiento</option>
                    </select>
                    <input type="number" placeholder="Años de experiencia" value={formData.anos_experiencia || ''} onChange={(e) => setFormData({ ...formData, anos_experiencia: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                    <textarea placeholder="Certificación" value={formData.certificacion || ''} onChange={(e) => setFormData({ ...formData, certificacion: e.target.value })} rows="3" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"></textarea>
                    <textarea placeholder="Biografía" value={formData.biografia || ''} onChange={(e) => setFormData({ ...formData, biografia: e.target.value })} rows="3" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"></textarea>
                </div>
            );
        }

        if (currentEntity === 'alimentos') {
            return (
                <div className="space-y-4">
                    <input type="text" placeholder="Nombre" value={formData.nombre || ''} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                    <input type="text" placeholder="Categoría" value={formData.categoria || ''} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                    <textarea placeholder="Descripción" value={formData.descripcion || ''} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} rows="2" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"></textarea>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" step="0.1" placeholder="Calorías" value={formData.calorias || ''} onChange={(e) => setFormData({ ...formData, calorias: parseFloat(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                        <input type="number" step="0.1" placeholder="Proteínas (g)" value={formData.proteinas || ''} onChange={(e) => setFormData({ ...formData, proteinas: parseFloat(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                        <input type="number" step="0.1" placeholder="Carbohidratos (g)" value={formData.carbohidratos || ''} onChange={(e) => setFormData({ ...formData, carbohidratos: parseFloat(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                        <input type="number" step="0.1" placeholder="Grasas (g)" value={formData.grasas || ''} onChange={(e) => setFormData({ ...formData, grasas: parseFloat(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                    </div>
                    <input type="number" step="0.01" placeholder="Precio por kg" value={formData.precio_kg || ''} onChange={(e) => setFormData({ ...formData, precio_kg: parseFloat(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                </div>
            );
        }

        if (currentEntity === 'ejercicios') {
            return (
                <div className="space-y-4">
                    <input type="text" placeholder="Nombre del ejercicio" value={formData.nombre || ''} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                    <select value={formData.tipo || ''} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
                        <option value="">Seleccionar tipo</option>
                        <option value="Fuerza">Fuerza</option>
                        <option value="Cardio">Cardio</option>
                        <option value="Flexibilidad">Flexibilidad</option>
                        <option value="Funcional">Funcional</option>
                    </select>
                    <input type="text" placeholder="Grupo muscular" value={formData.grupo_muscular || ''} onChange={(e) => setFormData({ ...formData, grupo_muscular: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                    <textarea placeholder="Descripción" value={formData.descripcion || ''} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} rows="3" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"></textarea>
                    <select value={formData.nivel_dificultad || ''} onChange={(e) => setFormData({ ...formData, nivel_dificultad: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
                        <option value="">Nivel de dificultad</option>
                        <option value="principiante">Principiante</option>
                        <option value="intermedio">Intermedio</option>
                        <option value="avanzado">Avanzado</option>
                    </select>
                </div>
            );
        }

        if (currentEntity === 'blog') {
            return (
                <div className="space-y-4">
                    <input type="text" placeholder="Título" value={formData.titulo || ''} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                    <textarea placeholder="Extracto" value={formData.extracto || ''} onChange={(e) => setFormData({ ...formData, extracto: e.target.value })} rows="2" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"></textarea>
                    <textarea placeholder="Contenido" value={formData.contenido || ''} onChange={(e) => setFormData({ ...formData, contenido: e.target.value })} rows="6" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"></textarea>

                    {/* Campo de URL para imagen */}
                    <input
                        type="url"
                        placeholder="URL Imagen de portada (ej: https://images.unsplash.com/...)"
                        value={formData.imagen_portada || ''}
                        onChange={(e) => setFormData({ ...formData, imagen_portada: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                    />

                    <select value={formData.categoria || 'noticias'} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
                        <option value="noticias">Noticias</option>
                        <option value="nutricion">Nutrición</option>
                        <option value="entrenamiento">Entrenamiento</option>
                        <option value="salud">Salud</option>
                        <option value="motivacion">Motivación</option>
                        <option value="recetas">Recetas</option>
                    </select>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-white">
                            <input type="checkbox" checked={formData.es_premium || false} onChange={(e) => setFormData({ ...formData, es_premium: e.target.checked })} className="w-5 h-5" />
                            <span>Premium</span>
                        </label>
                        <label className="flex items-center gap-2 text-white">
                            <input type="checkbox" checked={formData.destacado || false} onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })} className="w-5 h-5" />
                            <span>Destacado</span>
                        </label>
                    </div>
                    <input type="datetime-local" value={formData.fecha_publicacion || ''} onChange={(e) => setFormData({ ...formData, fecha_publicacion: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                </div>
            );
        }

        return null;
    };

    const filteredUsuarios = usuarios.filter(u =>
        u.nombre_completo.toLowerCase().includes(searchUsuarios.toLowerCase()) ||
        u.email.toLowerCase().includes(searchUsuarios.toLowerCase())
    );

    const filteredAlimentos = alimentos.filter(a =>
        a.nombre.toLowerCase().includes(searchAlimentos.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="bg-black border-b border-gray-800 py-6 px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold"><span className="text-uf-gold">PANEL</span> ADMIN</h1>
                    <p className="text-gray-400 mt-2">Gestión completa de la plataforma</p>
                    <div className="h-1 w-20 bg-uf-gold mt-4"></div>
                </div>
            </div>

            <div className="bg-black border-b border-gray-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex gap-2 overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 font-semibold text-xs uppercase tracking-wider transition-all duration-300 whitespace-nowrap border-b-2 ${activeTab === tab.id ? 'text-uf-gold border-uf-gold bg-uf-gold/10' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-700'}`}>
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader className="animate-spin w-12 h-12 text-uf-gold" />
                    </div>
                ) : (
                    <>
                        {activeTab === 'overview' && estadisticas && (
                            <div>
                                <h2 className="text-2xl font-bold text-uf-gold mb-6">ESTADÍSTICAS GENERALES</h2>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-uf-gold transition-all">
                                        <div className="flex items-center justify-between">
                                            <Users className="w-8 h-8 text-blue-400" />
                                            <span className="text-3xl font-bold">{estadisticas.total_usuarios}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-2">Total Usuarios</p>
                                    </div>
                                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-uf-gold transition-all">
                                        <div className="flex items-center justify-between">
                                            <Crown className="w-8 h-8 text-uf-gold" />
                                            <span className="text-3xl font-bold">{estadisticas.usuarios_premium}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-2">Usuarios Premium</p>
                                    </div>
                                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-uf-gold transition-all">
                                        <div className="flex items-center justify-between">
                                            <Activity className="w-8 h-8 text-purple-400" />
                                            <span className="text-3xl font-bold">{estadisticas.total_entrenadores}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-2">Entrenadores</p>
                                    </div>
                                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-uf-gold transition-all">
                                        <div className="flex items-center justify-between">
                                            <Users className="w-8 h-8 text-green-400" />
                                            <span className="text-3xl font-bold">{estadisticas.usuarios_normales}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-2">Usuarios Normales</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'usuarios' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-uf-gold">GESTIÓN DE USUARIOS</h2>
                                    <button onClick={() => handleCreate('usuarios')} className="flex items-center gap-2 bg-uf-gold text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-all">
                                        <Plus className="w-5 h-5" />Nuevo Usuario
                                    </button>
                                </div>
                                <div className="mb-6">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input type="text" placeholder="Buscar usuarios..." value={searchUsuarios} onChange={(e) => setSearchUsuarios(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {filteredUsuarios.map((u) => (
                                        <div key={u.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-uf-gold transition-all group">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-white font-bold">{u.nombre_completo}</h3>
                                                        {u.es_premium && <span className="inline-flex items-center gap-1 px-2 py-1 bg-uf-gold text-black text-xs font-bold rounded uppercase"><Crown className="w-3 h-3" />PREMIUM</span>}
                                                        {u.rol === 'admin' && <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded uppercase">ADMIN</span>}
                                                        {u.rol === 'entrenador' && <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded uppercase">ENTRENADOR</span>}
                                                    </div>
                                                    <p className="text-gray-400 text-sm mt-2">📧 {u.email}</p>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button
                                                        onClick={() => handleEdit('usuarios', u)}
                                                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded"
                                                        title="Editar usuario"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const newStatus = !u.es_premium;
                                                            handleUpdateUsuario(u.id, { es_premium: newStatus });
                                                        }}
                                                        className="p-2 text-yellow-400 hover:bg-yellow-500/10 rounded"
                                                        title={u.es_premium ? 'Quitar Premium' : 'Hacer Premium'}
                                                    >
                                                        <Crown className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete('usuarios', u.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-5 h-5" /></button>
                                                </div>
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
                                    <button onClick={() => handleCreate('entrenadores')} className="flex items-center gap-2 bg-uf-gold text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-all"><Plus className="w-5 h-5" />Nuevo Entrenador</button>
                                </div>
                                <div className="space-y-3">
                                    {entrenadores.map((e) => (
                                        <div key={e.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-uf-gold transition-all group">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <Award className="w-5 h-5 text-uf-gold" />
                                                        <h3 className="text-white font-bold">{e.nombre_completo || e.nombre}</h3>
                                                        <span className="px-2 py-1 text-xs font-bold rounded uppercase bg-purple-600 text-white">{e.especialidad}</span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm mt-2">📧 {e.email} • {e.anos_experiencia} años de experiencia</p>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button onClick={() => handleEdit('entrenadores', e)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded"><Edit className="w-5 h-5" /></button>
                                                    <button onClick={() => handleDelete('entrenadores', e.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-5 h-5" /></button>
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
                                                        <Utensils className="w-5 h-5 text-uf-gold" />
                                                        <h3 className="text-white font-bold">{d.nombre}</h3>
                                                        {d.destacada && <span className="px-2 py-1 bg-uf-gold text-black text-xs font-bold rounded uppercase">DESTACADA</span>}
                                                        {d.es_publica && <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded uppercase">PÚBLICA</span>}
                                                    </div>
                                                    <p className="text-gray-400 text-sm mt-2">
                                                        {d.calorias_totales} kcal •
                                                        {d.creador_nombre && ` Creada por ${d.creador_nombre} ${d.creador_apellidos || ''}`}
                                                        {d.valoracion_promedio > 0 && ` • ⭐ ${d.valoracion_promedio.toFixed(1)}`}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button
                                                        onClick={() => handleVerDetalleDieta(d.id)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-all"
                                                        title="Ver detalle completo"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                        Ver Detalle
                                                    </button>
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
                                    <button onClick={() => handleCreate('alimentos')} className="flex items-center gap-2 bg-uf-gold text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-all"><Plus className="w-5 h-5" />Nuevo Alimento</button>
                                </div>
                                <div className="mb-6">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input type="text" placeholder="Buscar alimentos..." value={searchAlimentos} onChange={(e) => setSearchAlimentos(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white" />
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
                                                    <button onClick={() => handleEdit('alimentos', a)} className="p-1 text-blue-400 hover:bg-blue-500/10 rounded"><Edit className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDelete('alimentos', a.id)} className="p-1 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-4 h-4" /></button>
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
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-uf-gold">GESTIÓN DE EJERCICIOS</h2>
                                    <button onClick={() => handleCreate('ejercicios')} className="flex items-center gap-2 bg-uf-gold text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-all"><Plus className="w-5 h-5" />Nuevo Ejercicio</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {ejercicios.map((ej) => (
                                        <div key={ej.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-uf-gold transition-all group">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <Dumbbell className="w-5 h-5 text-uf-gold" />
                                                    <div>
                                                        <h3 className="text-white font-bold">{ej.nombre}</h3>
                                                        <p className="text-gray-400 text-xs">{ej.grupo_muscular} • {ej.tipo}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button onClick={() => handleEdit('ejercicios', ej)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded"><Edit className="w-5 h-5" /></button>
                                                    <button onClick={() => handleDelete('ejercicios', ej.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-5 h-5" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'blog' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-uf-gold">GESTIÓN DE BLOG</h2>
                                    <button onClick={() => handleCreate('blog')} className="flex items-center gap-2 bg-uf-gold text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-all"><Plus className="w-5 h-5" />Nuevo Post</button>
                                </div>
                                <div className="space-y-3">
                                    {blogPosts.map((post) => (
                                        <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-uf-gold transition-all group">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-white font-bold">{post.titulo}</h3>
                                                        {post.es_premium && <span className="px-2 py-1 bg-uf-gold text-black text-xs font-bold rounded uppercase">PREMIUM</span>}
                                                        {post.destacado && <span className="px-2 py-1 bg-uf-red text-white text-xs font-bold rounded uppercase">DESTACADO</span>}
                                                        <span className="px-2 py-1 bg-gray-700 text-white text-xs font-bold rounded uppercase">{post.categoria}</span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm mt-2">{post.extracto?.substring(0, 100)}...</p>
                                                    <p className="text-gray-500 text-xs mt-1">📅 {post.fecha_publicacion || 'No publicado'}</p>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button onClick={() => handleEdit('blog', post)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded"><Edit className="w-5 h-5" /></button>
                                                    <button onClick={() => handleDelete('blog', post.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-5 h-5" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`${modalMode === 'create' ? 'Crear' : 'Editar'} ${currentEntity}`} size="lg">
                {renderForm()}
                <div className="flex gap-3 mt-6">
                    <button onClick={handleSave} className="flex items-center gap-2 flex-1 bg-uf-gold text-black px-4 py-3 rounded-lg font-bold hover:bg-yellow-600 transition-all justify-center">
                        <Save className="w-5 h-5" />
                        Guardar
                    </button>
                    <button onClick={() => setModalOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-gray-700 text-white hover:bg-gray-800 transition-all">
                        <X className="w-5 h-5" />
                        Cancelar
                    </button>
                </div>
            </Modal>

            {/* Modal de Detalle de Dieta */}
            <Modal isOpen={dietaDetalleOpen} onClose={() => setDietaDetalleOpen(false)} title={dietaActual?.nombre || 'Detalle de Dieta'} size="xl">
                {dietaActual && (
                    <div className="space-y-6">
                        {/* Info general */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                <p className="text-gray-400 text-sm">Calorías Totales</p>
                                <p className="text-2xl font-bold text-uf-gold">{dietaActual.calorias_totales} kcal</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                <p className="text-gray-400 text-sm">Valoración</p>
                                <p className="text-2xl font-bold text-white">⭐ {dietaActual.valoracion_promedio?.toFixed(1) || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                <p className="text-gray-400 text-sm">Visibilidad</p>
                                <p className="text-lg font-bold text-white">{dietaActual.es_publica ? '🌐 Pública' : '🔒 Privada'}</p>
                            </div>
                        </div>

                        {/* Selector de días */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-uf-gold" />
                                Plan Semanal
                            </h3>
                            <div className="grid grid-cols-7 gap-2">
                                {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map((dia) => (
                                    <button
                                        key={dia}
                                        onClick={() => setDiaSeleccionado(dia)}
                                        className={`px-3 py-2 rounded-lg font-bold text-xs uppercase transition-all ${diaSeleccionado === dia
                                            ? 'bg-uf-gold text-black'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                            }`}
                                    >
                                        {dia.substring(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Platos del día seleccionado */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-3 capitalize">
                                {diaSeleccionado} - Totales del día
                            </h3>
                            <div className="grid grid-cols-4 gap-4 mb-4">
                                {(() => {
                                    const totales = calcularTotalesDia();
                                    return (
                                        <>
                                            <div className="bg-orange-600/20 border border-orange-600 rounded-lg p-3 text-center">
                                                <p className="text-orange-400 text-xs">Calorías</p>
                                                <p className="text-white font-bold text-lg">{totales.calorias.toFixed(0)}</p>
                                            </div>
                                            <div className="bg-red-600/20 border border-red-600 rounded-lg p-3 text-center">
                                                <p className="text-red-400 text-xs">Proteínas</p>
                                                <p className="text-white font-bold text-lg">{totales.proteinas.toFixed(0)}g</p>
                                            </div>
                                            <div className="bg-blue-600/20 border border-blue-600 rounded-lg p-3 text-center">
                                                <p className="text-blue-400 text-xs">Carbohidratos</p>
                                                <p className="text-white font-bold text-lg">{totales.carbohidratos.toFixed(0)}g</p>
                                            </div>
                                            <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-3 text-center">
                                                <p className="text-yellow-400 text-xs">Grasas</p>
                                                <p className="text-white font-bold text-lg">{totales.grasas.toFixed(0)}g</p>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            {/* Comidas del día */}
                            <div className="space-y-4">
                                {planSemanal[diaSeleccionado] && Object.entries(planSemanal[diaSeleccionado]).map(([momento, platos]) => (
                                    <div key={momento} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                        <h4 className="text-uf-gold font-bold mb-3 uppercase text-sm">{getMomentoNombre(momento)}</h4>
                                        <div className="space-y-2">
                                            {platos.map((plato, index) => (
                                                <div key={index} className="bg-gray-900 rounded-lg p-3 border border-gray-600">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h5 className="text-white font-bold">{plato.nombre}</h5>
                                                        <span className="text-orange-400 font-bold">{plato.calorias} kcal</span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                                        <span className="text-red-400">P: {plato.proteinas}g</span>
                                                        <span className="text-blue-400">C: {plato.carbohidratos}g</span>
                                                        <span className="text-yellow-400">G: {plato.grasas}g</span>
                                                    </div>
                                                    {plato.descripcion && (
                                                        <p className="text-gray-400 text-xs mt-2">{plato.descripcion}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default DashboardAdmin;
