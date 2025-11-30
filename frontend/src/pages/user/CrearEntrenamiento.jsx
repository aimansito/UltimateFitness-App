import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { ArrowLeft, Save, Plus, Trash2, Dumbbell, Clock, Activity } from "lucide-react";

function CrearEntrenamiento() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [tipo, setTipo] = useState("gym");
    const [nivelDificultad, setNivelDificultad] = useState("intermedio");
    const [duracionMinutos, setDuracionMinutos] = useState(60);
    const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState([]);
    const [ejerciciosSeleccionados, setEjerciciosSeleccionados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar ejercicios disponibles
    useEffect(() => {
        const fetchEjercicios = async () => {
            try {
                // Asumiendo que existe un endpoint para listar ejercicios
                // Si no existe, usaremos mocks o habrá que crearlo.
                // Por ahora intentaremos llamar a un endpoint genérico o usar mock si falla.
                const response = await axios.get("http://localhost:8000/api/ejercicios");
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
                // Fallback mock
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

    const agregarEjercicio = () => {
        setEjerciciosSeleccionados([
            ...ejerciciosSeleccionados,
            {
                id: Date.now(), // ID temporal para la UI
                ejercicio_id: "",
                series: 3,
                repeticiones: 12,
                descanso: 60,
                notas: ""
            }
        ]);
    };

    const actualizarEjercicio = (id, campo, valor) => {
        setEjerciciosSeleccionados(prev =>
            prev.map(ej => ej.id === id ? { ...ej, [campo]: valor } : ej)
        );
    };

    const eliminarEjercicio = (id) => {
        setEjerciciosSeleccionados(prev => prev.filter(ej => ej.id !== id));
    };

    const guardarEntrenamiento = async () => {
        if (!nombre.trim()) {
            alert("Por favor ingresa un nombre para el entrenamiento");
            return;
        }

        if (ejerciciosSeleccionados.length === 0) {
            alert("Agrega al menos un ejercicio");
            return;
        }

        // Validar que todos los ejercicios tengan un ejercicio seleccionado
        const ejerciciosValidos = ejerciciosSeleccionados.every(ej => ej.ejercicio_id);
        if (!ejerciciosValidos) {
            alert("Por favor selecciona un ejercicio para cada ítem de la lista");
            return;
        }

        const payload = {
            nombre,
            descripcion,
            tipo,
            nivelDificultad,
            duracionMinutos: parseInt(duracionMinutos),
            esPublico: false, // Por defecto privado para usuarios
            ejercicios: ejerciciosSeleccionados.map(ej => ({
                ejercicio_id: parseInt(ej.ejercicio_id),
                series: parseInt(ej.series),
                repeticiones: parseInt(ej.repeticiones),
                descanso: parseInt(ej.descanso),
                notas: ej.notas
            }))
        };

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:8000/api/custom/entrenamientos/crear", payload);
            if (response.data.success) {
                alert("Entrenamiento creado exitosamente");
                navigate("/mis-entrenamientos");
            } else {
                setError(response.data.error || "Error al crear entrenamiento");
            }
        } catch (err) {
            console.error("Error guardando entrenamiento", err);
            setError("Error de conexión o servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
            <div className="max-w-4xl mx-auto">
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
                        Crear Nuevo Entrenamiento
                    </h1>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Formulario Principal */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-300 mb-2">Nombre</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-uf-gold outline-none"
                                placeholder="Ej: Rutina de Pecho y Tríceps"
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
                            <label className="block text-gray-300 mb-2">Duración (min)</label>
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
                                placeholder="Describe el objetivo de esta rutina..."
                            />
                        </div>
                    </div>
                </div>

                {/* Lista de Ejercicios */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-uf-gold" />
                            Ejercicios
                        </h2>
                        <button
                            onClick={agregarEjercicio}
                            className="bg-uf-gold text-black px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-yellow-500"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar Ejercicio
                        </button>
                    </div>

                    <div className="space-y-4">
                        {ejerciciosSeleccionados.map((item, index) => (
                            <div key={item.id} className="bg-gray-800 p-4 rounded border border-gray-700 relative">
                                <button
                                    onClick={() => eliminarEjercicio(item.id)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-400"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-400 text-sm mb-1">Ejercicio</label>
                                        <select
                                            value={item.ejercicio_id}
                                            onChange={(e) => actualizarEjercicio(item.id, 'ejercicio_id', e.target.value)}
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
                                            value={item.series}
                                            onChange={(e) => actualizarEjercicio(item.id, 'series', e.target.value)}
                                            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">Reps</label>
                                        <input
                                            type="number"
                                            value={item.repeticiones}
                                            onChange={(e) => actualizarEjercicio(item.id, 'repeticiones', e.target.value)}
                                            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">Descanso (s)</label>
                                        <input
                                            type="number"
                                            value={item.descanso}
                                            onChange={(e) => actualizarEjercicio(item.id, 'descanso', e.target.value)}
                                            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <label className="block text-gray-400 text-sm mb-1">Notas</label>
                                    <input
                                        type="text"
                                        value={item.notas}
                                        onChange={(e) => actualizarEjercicio(item.id, 'notas', e.target.value)}
                                        className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                                        placeholder="Ej: Aumentar peso en última serie"
                                    />
                                </div>
                            </div>
                        ))}

                        {ejerciciosSeleccionados.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No hay ejercicios agregados.</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={guardarEntrenamiento}
                        disabled={loading}
                        className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-500 flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-6 h-6" />
                        {loading ? "Guardando..." : "Guardar Entrenamiento"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CrearEntrenamiento;
