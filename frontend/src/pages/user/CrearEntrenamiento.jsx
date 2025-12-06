import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { ArrowLeft, Save, Plus, Trash2, Dumbbell, Calendar, ChevronDown, ChevronUp } from "lucide-react";

const DIAS_SEMANA = [
    { numero: 1, nombre: "Lunes" },
    { numero: 2, nombre: "Martes" },
    { numero: 3, nombre: "Miércoles" },
    { numero: 4, nombre: "Jueves" },
    { numero: 5, nombre: "Viernes" },
    { numero: 6, nombre: "Sábado" },
    { numero: 7, nombre: "Domingo" },
];

function CrearEntrenamiento() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [tipo, setTipo] = useState("gym");
    const [nivelDificultad, setNivelDificultad] = useState("intermedio");
    const [duracionMinutos, setDuracionMinutos] = useState(60);

    // Estado para los 7 días de la semana
    const [dias, setDias] = useState(DIAS_SEMANA.map(dia => ({
        diaSemana: dia.numero,
        nombre: dia.nombre,
        concepto: "",
        esDescanso: dia.numero === 6 || dia.numero === 7, // Sábado y Domingo descanso por defecto
        ejercicios: []
    })));

    const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState([]);
    const [diaExpandido, setDiaExpandido] = useState(1); // Lunes expandido por defecto
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar ejercicios disponibles
    useEffect(() => {
        const fetchEjercicios = async () => {
            try {
                // Endpoint correcto según backend: /api/custom/ejercicios
                const response = await api.get("/custom/ejercicios");
                if (response.data && Array.isArray(response.data['hydra:member'])) {
                    setEjerciciosDisponibles(response.data['hydra:member']);
                } else {
                    // Fallback mock
                    setEjerciciosDisponibles([
                        { id: 1, nombre: "Press de Banca", grupoMuscular: "Pecho" },
                        { id: 2, nombre: "Sentadilla", grupoMuscular: "Piernas" },
                        { id: 3, nombre: "Peso Muerto", grupoMuscular: "Espalda/Piernas" },
                        { id: 4, nombre: "Dominadas", grupoMuscular: "Espalda" },
                        { id: 5, nombre: "Press Militar", grupoMuscular: "Hombros" },
                    ]);
                }
            } catch (err) {
                console.error("Error cargando ejercicios", err);
                setEjerciciosDisponibles([
                    { id: 1, nombre: "Press de Banca", grupoMuscular: "Pecho" },
                    { id: 2, nombre: "Sentadilla", grupoMuscular: "Piernas" },
                    { id: 3, nombre: "Peso Muerto", grupoMuscular: "Espalda/Piernas" },
                    { id: 4, nombre: "Dominadas", grupoMuscular: "Espalda" },
                    { id: 5, nombre: "Press Militar", grupoMuscular: "Hombros" },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchEjercicios();
    }, []);

    const toggleDescanso = (diaSemana) => {
        setDias(prev => prev.map(dia =>
            dia.diaSemana === diaSemana
                ? { ...dia, esDescanso: !dia.esDescanso, concepto: !dia.esDescanso ? "" : dia.concepto }
                : dia
        ));
    };

    const actualizarConcepto = (diaSemana, concepto) => {
        setDias(prev => prev.map(dia =>
            dia.diaSemana === diaSemana ? { ...dia, concepto } : dia
        ));
    };

    const agregarEjercicio = (diaSemana) => {
        setDias(prev => prev.map(dia =>
            dia.diaSemana === diaSemana
                ? {
                    ...dia,
                    ejercicios: [
                        ...dia.ejercicios,
                        {
                            id: Date.now(),
                            ejercicio_id: "",
                            series: 3,
                            repeticiones: 12,
                            descanso: 60,
                            notas: ""
                        }
                    ]
                }
                : dia
        ));
    };

    const actualizarEjercicio = (diaSemana, ejercicioId, campo, valor) => {
        setDias(prev => prev.map(dia =>
            dia.diaSemana === diaSemana
                ? {
                    ...dia,
                    ejercicios: dia.ejercicios.map(ej =>
                        ej.id === ejercicioId ? { ...ej, [campo]: valor } : ej
                    )
                }
                : dia
        ));
    };

    const eliminarEjercicio = (diaSemana, ejercicioId) => {
        setDias(prev => prev.map(dia =>
            dia.diaSemana === diaSemana
                ? { ...dia, ejercicios: dia.ejercicios.filter(ej => ej.id !== ejercicioId) }
                : dia
        ));
    };

    const guardarEntrenamiento = async () => {
        if (!nombre.trim()) {
            alert("Por favor ingresa un nombre para el entrenamiento");
            return;
        }

        // Validar mínimo 5 días activos
        const diasActivos = dias.filter(d => !d.esDescanso);
        if (diasActivos.length < 5) {
            alert("Debes tener al menos 5 días de entrenamiento (máximo 2 días de descanso)");
            return;
        }

        // Validar que días activos tengan concepto
        const diaActivoSinConcepto = diasActivos.find(d => !d.concepto.trim());
        if (diaActivoSinConcepto) {
            alert(`El día ${diaActivoSinConcepto.nombre} está activo pero no tiene un concepto/título`);
            return;
        }

        // Validar que días activos tengan ejercicios
        const diaActivoSinEjercicios = diasActivos.find(d => d.ejercicios.length === 0);
        if (diaActivoSinEjercicios) {
            alert(`El día ${diaActivoSinEjercicios.nombre} está activo pero no tiene ejercicios`);
            return;
        }

        // Validar que todos los ejercicios tengan un ejercicio seleccionado
        for (const dia of diasActivos) {
            const ejercicioSinSeleccionar = dia.ejercicios.find(ej => !ej.ejercicio_id);
            if (ejercicioSinSeleccionar) {
                alert(`El día ${dia.nombre} tiene ejercicios sin seleccionar`);
                return;
            }
        }

        const payload = {
            nombre,
            descripcion,
            tipo,
            nivelDificultad,
            duracionMinutos: parseInt(duracionMinutos),
            esPublico: false,
            creador_usuario_id: user?.id, // ID del usuario que crea el entrenamiento
            dias: dias.map(dia => ({
                diaSemana: dia.diaSemana,
                concepto: dia.concepto,
                esDescanso: dia.esDescanso,
                ejercicios: dia.esDescanso ? [] : dia.ejercicios.map(ej => ({
                    ejercicio_id: parseInt(ej.ejercicio_id),
                    series: parseInt(ej.series),
                    repeticiones: parseInt(ej.repeticiones),
                    descanso: parseInt(ej.descanso),
                    notas: ej.notas
                }))
            }))
        };

        try {
            setLoading(true);
            const response = await api.post("/usuario/crear-entrenamiento", payload);
            if (response.data.success) {
                alert("Plan de entrenamiento semanal creado exitosamente");
                navigate("/mis-entrenamientos");
            } else {
                setError(response.data.error || "Error al crear entrenamiento");
            }
        } catch (err) {
            console.error("Error guardando entrenamiento", err);
            setError(err.response?.data?.error || "Error de conexión o servidor");
        } finally {
            setLoading(false);
        }
    };

    const diasActivosCount = dias.filter(d => !d.esDescanso).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/mis-entrenamientos")}
                        className="text-uf-gold hover:text-yellow-600 font-semibold flex items-center gap-2 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver
                    </button>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Dumbbell className="w-8 h-8 text-uf-gold" />
                        Crear Plan de Entrenamiento Semanal
                    </h1>
                    <p className="text-gray-400 mt-2">Diseña tu rutina completa de 7 días con ejercicios específicos por día</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Información general */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-bold text-white mb-4">Información General</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-300 mb-2">Nombre del Plan</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-uf-gold outline-none"
                                placeholder="Ej: Plan Hipertrofia 5 días"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Tipo</label>
                            <select
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-uf-gold outline-none"
                            >
                                <option value="gym">Gimnasio</option>
                                <option value="casa">En Casa</option>
                                <option value="cardio">Cardio</option>
                                <option value="flexibilidad">Flexibilidad</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Dificultad</label>
                            <select
                                value={nivelDificultad}
                                onChange={(e) => setNivelDificultad(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-uf-gold outline-none"
                            >
                                <option value="principiante">Principiante</option>
                                <option value="intermedio">Intermedio</option>
                                <option value="avanzado">Avanzado</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Duración promedio (min)</label>
                            <input
                                type="number"
                                value={duracionMinutos}
                                onChange={(e) => setDuracionMinutos(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-uf-gold outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-300 mb-2">Descripción</label>
                            <textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-uf-gold outline-none h-24"
                                placeholder="Describe el objetivo de este plan..."
                            />
                        </div>
                    </div>
                </div>

                {/* Validación visual */}
                <div className={`mb-6 p-4 rounded-lg border-2 ${diasActivosCount >= 5 ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
                    <p className="text-white font-bold">
                        Días activos: {diasActivosCount}/7
                        <span className="text-gray-400 ml-2 font-normal">
                            (Mínimo 5 días requeridos)
                        </span>
                    </p>
                </div>

                {/* Días de la semana */}
                <div className="space-y-4 mb-6">
                    {dias.map((dia) => (
                        <div
                            key={dia.diaSemana}
                            className={`bg-gray-900 border-2 rounded-lg overflow-hidden transition-all ${dia.esDescanso ? 'border-gray-700' : 'border-uf-gold/50'
                                }`}
                        >
                            {/* Header del día */}
                            <div
                                className={`p-4 cursor-pointer flex items-center justify-between ${dia.esDescanso ? 'bg-gray-800' : 'bg-gradient-to-r from-uf-gold/20 to-transparent'
                                    }`}
                                onClick={() => setDiaExpandido(diaExpandido === dia.diaSemana ? null : dia.diaSemana)}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <Calendar className="w-6 h-6 text-uf-gold" />
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white">{dia.nombre}</h3>
                                        {!dia.esDescanso && dia.concepto && (
                                            <p className="text-uf-gold text-sm">{dia.concepto}</p>
                                        )}
                                        {dia.esDescanso && (
                                            <p className="text-gray-500 text-sm">Día de descanso</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleDescanso(dia.diaSemana); }}
                                        className={`px-4 py-2 rounded font-bold transition-all ${dia.esDescanso
                                                ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                                : 'bg-green-600 text-white hover:bg-green-500'
                                            }`}
                                    >
                                        {dia.esDescanso ? 'Descanso' : 'Activo'}
                                    </button>
                                    {diaExpandido === dia.diaSemana ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            {/* Contenido del día (expandible) */}
                            {diaExpandido === dia.diaSemana && !dia.esDescanso && (
                                <div className="p-6 border-t border-gray-700">
                                    {/* Concepto del día */}
                                    <div className="mb-6">
                                        <label className="block text-gray-300 mb-2 font-bold">
                                            Concepto del entrenamiento *
                                        </label>
                                        <input
                                            type="text"
                                            value={dia.concepto}
                                            onChange={(e) => actualizarConcepto(dia.diaSemana, e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-600 rounded p-3 text-white focus:border-uf-gold outline-none"
                                            placeholder="Ej: Pecho y Tríceps, Pierna Completa, Espalda y Bíceps..."
                                        />
                                    </div>

                                    {/* Lista de ejercicios */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-lg font-bold text-white">Ejercicios</h4>
                                            <button
                                                onClick={() => agregarEjercicio(dia.diaSemana)}
                                                className="bg-uf-gold text-black px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-yellow-500"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Agregar Ejercicio
                                            </button>
                                        </div>

                                        {dia.ejercicios.length === 0 ? (
                                            <p className="text-gray-500 text-center py-4">
                                                No hay ejercicios. Agrega al menos uno.
                                            </p>
                                        ) : (
                                            dia.ejercicios.map((ejercicio, index) => (
                                                <div key={ejercicio.id} className="bg-gray-800 p-4 rounded border border-gray-700 relative">
                                                    <button
                                                        onClick={() => eliminarEjercicio(dia.diaSemana, ejercicio.id)}
                                                        className="absolute top-2 right-2 text-red-500 hover:text-red-400"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div className="md:col-span-2">
                                                            <label className="block text-gray-400 text-sm mb-1">Ejercicio</label>
                                                            <select
                                                                value={ejercicio.ejercicio_id}
                                                                onChange={(e) => actualizarEjercicio(dia.diaSemana, ejercicio.id, 'ejercicio_id', e.target.value)}
                                                                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                                                            >
                                                                <option value="">Seleccionar ejercicio...</option>
                                                                {ejerciciosDisponibles.map(ej => (
                                                                    <option key={ej.id} value={ej.id}>
                                                                        {ej.nombre} ({ej.grupoMuscular || 'General'})
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block text-gray-400 text-sm mb-1">Series</label>
                                                            <input
                                                                type="number"
                                                                value={ejercicio.series}
                                                                onChange={(e) => actualizarEjercicio(dia.diaSemana, ejercicio.id, 'series', e.target.value)}
                                                                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-gray-400 text-sm mb-1">Reps</label>
                                                            <input
                                                                type="number"
                                                                value={ejercicio.repeticiones}
                                                                onChange={(e) => actualizarEjercicio(dia.diaSemana, ejercicio.id, 'repeticiones', e.target.value)}
                                                                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-gray-400 text-sm mb-1">Descanso (s)</label>
                                                            <input
                                                                type="number"
                                                                value={ejercicio.descanso}
                                                                onChange={(e) => actualizarEjercicio(dia.diaSemana, ejercicio.id, 'descanso', e.target.value)}
                                                                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mt-3">
                                                        <label className="block text-gray-400 text-sm mb-1">Notas</label>
                                                        <input
                                                            type="text"
                                                            value={ejercicio.notas}
                                                            onChange={(e) => actualizarEjercicio(dia.diaSemana, ejercicio.id, 'notas', e.target.value)}
                                                            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                                                            placeholder="Ej: Aumentar peso en última serie"
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Botón guardar */}
                <div className="flex justify-end">
                    <button
                        onClick={guardarEntrenamiento}
                        disabled={loading || diasActivosCount < 5}
                        className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-500 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-6 h-6" />
                        {loading ? "Guardando..." : "Guardar Plan Semanal"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CrearEntrenamiento;
