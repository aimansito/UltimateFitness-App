import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { ArrowLeft, Calendar, Dumbbell, Target } from 'lucide-react';

function DetalleEntrenamiento() {
    const { entrenamientoId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [entrenamiento, setEntrenamiento] = useState(null);
    const [ejerciciosPorDia, setEjerciciosPorDia] = useState({});
    const [diaSeleccionado, setDiaSeleccionado] = useState('lunes');
    const [loading, setLoading] = useState(true);

    const diasSemana = [
        { key: 'lunes', label: 'LUNES', emoji: '💪' },
        { key: 'martes', label: 'MARTES', emoji: '🔥' },
        { key: 'miercoles', label: 'MIÉRCOLES', emoji: '⚡' },
        { key: 'jueves', label: 'JUEVES', emoji: '🎯' },
        { key: 'viernes', label: 'VIERNES', emoji: '🏋️' },
        { key: 'sabado', label: 'SÁBADO', emoji: '💯' },
        { key: 'domingo', label: 'DOMINGO', emoji: '🌟' }
    ];

    useEffect(() => {
        if (user && entrenamientoId) {
            fetchDetalleEntrenamiento();
        }
    }, [user, entrenamientoId]);

    const fetchDetalleEntrenamiento = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/entrenamientos/${entrenamientoId}`
            );

            if (response.data) {
                setEntrenamiento(response.data);
                organizarEjerciciosPorDia(response.data.entrenamientoEjercicios || []);
            }
        } catch (error) {
            console.error('Error al cargar entrenamiento:', error);
        } finally {
            setLoading(false);
        }
    };

    const organizarEjerciciosPorDia = (ejercicios) => {
        const porDia = {
            lunes: [],
            martes: [],
            miercoles: [],
            jueves: [],
            viernes: [],
            sabado: [],
            domingo: []
        };

        ejercicios.forEach(ej => {
            // Extraer el día de las notas (formato: "Lunes (Pierna): notas")
            const notasLower = (ej.notas || '').toLowerCase();
            const dia = diasSemana.find(d => notasLower.includes(d.label.toLowerCase()));

            if (dia) {
                porDia[dia.key].push(ej);
            }
        });

        setEjerciciosPorDia(porDia);
    };

    const calcularTotalesDia = () => {
        const ejerciciosDia = ejerciciosPorDia[diaSeleccionado] || [];

        return ejerciciosDia.reduce((totales, ej) => ({
            series: totales.series + parseInt(ej.series || 0),
            repeticiones: totales.repeticiones + parseInt(ej.repeticiones || 0),
            duracion: totales.duracion + (parseInt(ej.series || 0) * 2.5)
        }), { series: 0, repeticiones: 0, duracion: 0 });
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

    const totalesDia = calcularTotalesDia();

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
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Tipo: {entrenamiento.tipo} | Nivel: {entrenamiento.nivelDificultad}
                            </h3>
                            <p className="text-gray-400 text-sm flex items-center gap-2 mt-2">
                                <Calendar className="w-4 h-4" />
                                Plan semanal
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-uf-gold/20 to-yellow-600/20 border-2 border-uf-gold rounded-lg p-4 text-center min-w-[150px]">
                            <p className="text-uf-gold text-sm font-semibold mb-1">DURACIÓN</p>
                            <p className="text-4xl font-bold text-white">{entrenamiento.duracionMinutos}</p>
                            <p className="text-gray-400 text-xs">minutos</p>
                        </div>
                    </div>
                </div>

                {/* Selección día */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        📅 Selecciona un día
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        {diasSemana.map((dia) => (
                            <button
                                key={dia.key}
                                onClick={() => setDiaSeleccionado(dia.key)}
                                className={`py-3 px-4 rounded-lg font-bold transition-all ${diaSeleccionado === dia.key
                                        ? 'bg-uf-gold text-black'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                <div className="text-2xl mb-1">{dia.emoji}</div>
                                {dia.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Resumen del día */}
                <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-2 border-purple-700 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Target className="w-6 h-6 text-uf-gold" />
                        Resumen del día
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-900 rounded-lg p-4 text-center">
                            <div className="text-uf-gold mb-2">💪</div>
                            <p className="text-gray-400 text-sm">Ejercicios</p>
                            <p className="text-2xl font-bold text-white">{ejerciciosPorDia[diaSeleccionado]?.length || 0}</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-4 text-center">
                            <div className="text-blue-400 mb-2">🔢</div>
                            <p className="text-gray-400 text-sm">Series Totales</p>
                            <p className="text-2xl font-bold text-white">{totalesDia.series}</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-4 text-center">
                            <div className="text-green-400 mb-2">⏱️</div>
                            <p className="text-gray-400 text-sm">Duración Est.</p>
                            <p className="text-2xl font-bold text-white">~{Math.round(totalesDia.duracion)} min</p>
                        </div>
                    </div>
                </div>

                {/* Ejercicios del día */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-white mb-6">
                        Ejercicios del {diasSemana.find(d => d.key === diaSeleccionado)?.label}
                    </h3>

                    {!ejerciciosPorDia[diaSeleccionado] || ejerciciosPorDia[diaSeleccionado].length === 0 ? (
                        <div className="text-center py-12">
                            <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">Día de descanso - No hay ejercicios programados</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {ejerciciosPorDia[diaSeleccionado].map((ejercicio, index) => (
                                <div
                                    key={index}
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
                    )}
                </div>
            </div>
        </div>
    );
}

export default DetalleEntrenamiento;
