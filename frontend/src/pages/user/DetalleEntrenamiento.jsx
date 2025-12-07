import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useAuthEntrenador from '../../context/AuthContextEntrenador';
import api from '../../services/api';
import { ArrowLeft, Calendar, Dumbbell, Target, Clock, Zap, Flame, Trophy, Star, Moon, Palmtree } from 'lucide-react';

const DIAS_SEMANA_NOMBRES = {
    1: { nombre: 'Lunes', icon: Dumbbell },
    2: { nombre: 'Martes', icon: Flame },
    3: { nombre: 'Miércoles', icon: Zap },
    4: { nombre: 'Jueves', icon: Target },
    5: { nombre: 'Viernes', icon: Dumbbell },
    6: { nombre: 'Sábado', icon: Trophy },
    7: { nombre: 'Domingo', icon: Palmtree }
};

function DetalleEntrenamiento() {
    const { entrenamientoId } = useParams();
    const { user } = useAuth();
    const { entrenador } = useAuthEntrenador();
    const navigate = useNavigate();
    const [entrenamiento, setEntrenamiento] = useState(null);
    const [diaSeleccionado, setDiaSeleccionado] = useState(1); // por defecto Lunes
    const [loading, setLoading] = useState(true);

    const isEntrenador = !!entrenador;

    useEffect(() => {
        if ((user || entrenador) && entrenamientoId) {
            fetchDetalleEntrenamiento();
        }
    }, [user, entrenador, entrenamientoId]);

    const fetchDetalleEntrenamiento = async () => {
        try {
            let endpoint;
            if (isEntrenador) {
                endpoint = `/entrenador/entrenamiento/${entrenamientoId}`;
            } else {
                endpoint = `/usuario/entrenamiento/${entrenamientoId}`;
            }

            // Usar el endpoint que devuelve la estructura completa con días
            const response = await api.get(endpoint);

            if (response.data.success && response.data.entrenamiento) {
                const entrenamientoData = response.data.entrenamiento;
                setEntrenamiento(entrenamientoData);

                // Seleccionar el primer día activo por defecto
                if (entrenamientoData.dias && entrenamientoData.dias.length > 0) {
                    const primerDiaActivo = entrenamientoData.dias.find(d => !d.es_descanso);
                    if (primerDiaActivo) {
                        setDiaSeleccionado(primerDiaActivo.dia_semana);
                    }
                }
            }
        } catch (error) {
            console.error('Error al cargar entrenamiento:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (isEntrenador) {
            navigate('/entrenador/mis-entrenamientos');
        } else {
            navigate('/mis-entrenamientos');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold mx-auto mb-4"></div>
                    <p className="text-white text-xl">Cargando entrenamiento...</p>
                </div>
            </div>
        );
    }

    if (!entrenamiento) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Entrenamiento no encontrado</h2>
                    <button
                        onClick={handleBack}
                        className="bg-uf-gold text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-600"
                    >
                        Volver a Mis Entrenamientos
                    </button>
                </div>
            </div>
        );
    }

    const diaActual = entrenamiento.dias?.find(d => d.dia_semana === diaSeleccionado);
    const diasActivos = entrenamiento.dias?.filter(d => !d.es_descanso).length || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={handleBack}
                        className="text-uf-gold hover:text-yellow-600 font-semibold flex items-center gap-2 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver a Mis Entrenamientos
                    </button>

                    <div className="bg-gradient-to-r from-uf-gold to-yellow-600 py-6 px-8 rounded-lg">
                        <h1 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
                            <Dumbbell className="w-8 h-8" />
                            {entrenamiento.nombre}
                        </h1>
                        <p className="text-gray-800">{entrenamiento.descripcion || 'Plan de entrenamiento personalizado'}</p>
                    </div>
                </div>

                {/* Información general */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-uf-gold rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-gray-400 text-sm mb-1">Tipo</p>
                            <p className="text-white font-bold text-lg capitalize">{entrenamiento.tipo}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-sm mb-1">Nivel</p>
                            <p className="text-white font-bold text-lg capitalize">{entrenamiento.nivel_dificultad}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-sm mb-1">Días Activos</p>
                            <p className="text-uf-gold font-bold text-2xl">{diasActivos}/7</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-sm mb-1">Duración Aprox.</p>
                            <p className="text-white font-bold text-lg">{entrenamiento.duracion_minutos} min</p>
                        </div>
                    </div>
                </div>

                {/* Selección día */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-uf-gold" />
                        Selecciona un día
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        {entrenamiento.dias?.map((dia) => {
                            const info = DIAS_SEMANA_NOMBRES[dia.dia_semana];
                            return (
                                <button
                                    key={dia.dia_semana}
                                    onClick={() => setDiaSeleccionado(dia.dia_semana)}
                                    className={`py-4 px-3 rounded-lg font-bold transition-all relative ${diaSeleccionado === dia.dia_semana
                                        ? 'bg-uf-gold text-black scale-105 shadow-lg'
                                        : dia.es_descanso
                                            ? 'bg-gray-700 text-gray-500'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    {!!dia.es_descanso && (
                                        <span className="absolute top-1 right-1 text-xs bg-red-500 text-white p-1 rounded-full">
                                            <Moon className="w-3 h-3" />
                                        </span>
                                    )}
                                    <div className="mb-1"><info.icon className="w-8 h-8" /></div>
                                    <div className="text-xs">{info?.nombre}</div>
                                    {!dia.es_descanso && dia.concepto && (
                                        <div className="text-[10px] mt-1 opacity-70 truncate">
                                            {dia.concepto}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Concepto del día actual */}
                {diaActual && !diaActual.es_descanso && (
                    <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-2 border-purple-700 rounded-lg p-6 mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                            <Target className="w-6 h-6 text-uf-gold" />
                            {DIAS_SEMANA_NOMBRES[diaActual.dia_semana]?.nombre}
                        </h3>
                        <p className="text-uf-gold text-xl font-semibold">{diaActual.concepto}</p>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="bg-gray-900 rounded-lg p-4 text-center">
                                <Dumbbell className="w-6 h-6 text-uf-gold mx-auto mb-2" />
                                <p className="text-gray-400 text-sm">Ejercicios</p>
                                <p className="text-2xl font-bold text-white">{diaActual.ejercicios?.length || 0}</p>
                            </div>
                            <div className="bg-gray-900 rounded-lg p-4 text-center">
                                <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                <p className="text-gray-400 text-sm">Series Totales</p>
                                <p className="text-2xl font-bold text-white">
                                    {diaActual.ejercicios?.reduce((sum, ej) => sum + ej.series, 0) || 0}
                                </p>
                            </div>
                            <div className="bg-gray-900 rounded-lg p-4 text-center">
                                <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                                <p className="text-gray-400 text-sm">Est. Tiempo</p>
                                <p className="text-2xl font-bold text-white">
                                    ~{Math.round((diaActual.ejercicios?.reduce((sum, ej) => sum + ej.series, 0) || 0) * 2.5)} min
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Ejercicios del día */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-white mb-6">
                        Ejercicios del {DIAS_SEMANA_NOMBRES[diaSeleccionado]?.nombre}
                    </h3>

                    {!diaActual || diaActual.es_descanso ? (
                        <div className="text-center py-12">
                            <div className="mb-4"><Moon className="w-16 h-16 text-blue-300 mx-auto" /></div>
                            <p className="text-gray-400 text-xl font-bold">Día de Descanso</p>
                            <p className="text-gray-500 mt-2">No hay ejercicios programados para este día</p>
                        </div>
                    ) : diaActual.ejercicios && diaActual.ejercicios.length > 0 ? (
                        <div className="space-y-4">
                            {diaActual.ejercicios.map((ejercicio, index) => (
                                <div
                                    key={ejercicio.id || index}
                                    className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-lg p-6 hover:border-uf-gold transition-all"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="bg-uf-gold text-black rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                                            {index + 1}
                                        </div>

                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-white mb-2">
                                                {ejercicio.ejercicio_nombre || 'Ejercicio'}
                                            </h4>
                                            <p className="text-gray-400 text-sm mb-4">
                                                {ejercicio.grupo_muscular || 'General'}
                                            </p>

                                            <div className="grid grid-cols-3 gap-4 mb-4">
                                                <div className="bg-gray-800 rounded-lg p-3 text-center">
                                                    <p className="text-gray-400 text-xs mb-1">Series</p>
                                                    <p className="text-2xl font-bold text-uf-gold">{ejercicio.series}</p>
                                                </div>
                                                <div className="bg-gray-800 rounded-lg p-3 text-center">
                                                    <p className="text-gray-400 text-xs mb-1">Repeticiones</p>
                                                    <p className="text-2xl font-bold text-blue-400">{ejercicio.repeticiones}</p>
                                                </div>
                                                <div className="bg-gray-800 rounded-lg p-3 text-center">
                                                    <p className="text-gray-400 text-xs mb-1">Descanso</p>
                                                    <p className="text-2xl font-bold text-green-400">{ejercicio.descanso_segundos}s</p>
                                                </div>
                                            </div>

                                            {ejercicio.notas && (
                                                <div className="bg-gray-800 rounded-lg p-3 border-l-4 border-uf-gold">
                                                    <p className="text-gray-400 text-xs mb-1">NOTAS:</p>
                                                    <p className="text-white text-sm">{ejercicio.notas}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">No hay ejercicios programados para este día</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DetalleEntrenamiento;
