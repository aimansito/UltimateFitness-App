import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { ArrowLeft, Calendar, Dumbbell, Target, Clock, Zap } from 'lucide-react';

const DIAS_SEMANA_NOMBRES = {
    1: { nombre: 'Lunes', emoji: '💪' },
    2: { nombre: 'Martes', emoji: '🔥' },
    3: { nombre: 'Miércoles', emoji: '⚡' },
    4: { nombre: 'Jueves', emoji: '🎯' },
    5: { nombre: 'Viernes', emoji: '🏋️' },
    6: { nombre: 'Sábado', emoji: '💯' },
    7: { nombre: 'Domingo', emoji: '🌟' }
};

function DetalleEntrenamiento() {
    const { entrenamientoId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [entrenamiento, setEntrenamiento] = useState(null);
    const [diaSeleccionado, setDiaSeleccionado] = useState(1); // por defecto Lunes
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && entrenamientoId) {
            fetchDetalleEntrenamiento();
        }
    }, [user, entrenamientoId]);

    const fetchDetalleEntrenamiento = async () => {
        try {
            // Usar el endpoint custom que devuelve la estructura completa con días
            const response = await axios.get(
                `http://localhost:8000/api/entrenamientos/${entrenamientoId}`
            );

            if (response.data) {
                setEntrenamiento(response.data);

                // Seleccionar el primer día activo por defecto
                if (response.data.dias && response.data.dias.length > 0) {
                    const primerDiaActivo = response.data.dias.find(d => !d.esDescanso);
                    if (primerDiaActivo) {
                        setDiaSeleccionado(primerDiaActivo.diaSemana);
                    }
                }
            }
        } catch (error) {
            console.error('Error al cargar entrenamiento:', error);
        } finally {
            setLoading(false);
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
                        onClick={() => navigate('/mis-entrenamientos')}
                        className="bg-uf-gold text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-600"
                    >
                        Volver a Mis Entrenamientos
                    </button>
                </div>
            </div>
        );
    }

    const diaActual = entrenamiento.dias?.find(d => d.diaSemana === diaSeleccionado);
    const diasActivos = entrenamiento.dias?.filter(d => !d.esDescanso).length || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/mis-entrenamientos')}
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
                            <p className="text-white font-bold text-lg capitalize">{entrenamiento.nivelDificultad}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-sm mb-1">Días Activos</p>
                            <p className="text-uf-gold font-bold text-2xl">{diasActivos}/7</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-sm mb-1">Duración Aprox.</p>
                            <p className="text-white font-bold text-lg">{entrenamiento.duracionMinutos} min</p>
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
                            const info = DIAS_SEMANA_NOMBRES[dia.diaSemana];
                            return (
                                <button
                                    key={dia.diaSemana}
                                    onClick={() => setDiaSeleccionado(dia.diaSemana)}
                                    className={`py-4 px-3 rounded-lg font-bold transition-all relative ${diaSeleccionado === dia.diaSemana
                                            ? 'bg-uf-gold text-black scale-105 shadow-lg'
                                            : dia.esDescanso
                                                ? 'bg-gray-700 text-gray-500'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    {dia.esDescanso && (
                                        <span className="absolute top-1 right-1 text-xs bg-red-500 text-white px-1 rounded">
                                            💤
                                        </span>
                                    )}
                                    <div className="text-2xl mb-1">{info?.emoji}</div>
                                    <div className="text-xs">{info?.nombre}</div>
                                    {!dia.esDescanso && dia.concepto && (
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
                {diaActual && !diaActual.esDescanso && (
                    <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-2 border-purple-700 rounded-lg p-6 mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                            <Target className="w-6 h-6 text-uf-gold" />
                            {DIAS_SEMANA_NOMBRES[diaActual.diaSemana]?.nombre}
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

                    {!diaActual || diaActual.esDescanso ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">😴</div>
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
                                                {ejercicio.ejercicio?.nombre || 'Ejercicio'}
                                            </h4>
                                            <p className="text-gray-400 text-sm mb-4">
                                                {ejercicio.ejercicio?.grupoMuscular || 'General'}
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
                                                    <p className="text-2xl font-bold text-green-400">{ejercicio.descansoSegundos}s</p>
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
