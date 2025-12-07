import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { ChevronLeft, ChevronRight, Check, User, Activity, Target } from 'lucide-react';

function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Paso 1: Datos básicos
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        passwordConfirm: '',
        telefono: '',

        // Paso 2: Datos físicos
        sexo: '',
        edad: '',
        peso_actual: '',
        altura: '',
        peso_objetivo: '',

        // Paso 3: Objetivo y actividad
        objetivo: 'cuidar_alimentacion',
        nivel_actividad: 'ligero',
        notas_salud: '',

        // Aceptación de políticas
        aceptaPoliticas: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        setError('');
    };

    const validateStep1 = () => {
        if (!formData.nombre || !formData.apellidos || !formData.email || !formData.password) {
            setError('Por favor completa todos los campos obligatorios');
            return false;
        }
        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return false;
        }
        if (formData.password !== formData.passwordConfirm) {
            setError('Las contraseñas no coinciden');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Email inválido');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!formData.sexo || !formData.edad || !formData.peso_actual || !formData.altura) {
            setError('Por favor completa todos los campos de datos físicos');
            return false;
        }
        if (formData.edad < 12 || formData.edad > 120) {
            setError('Edad inválida');
            return false;
        }
        if (formData.peso_actual < 30 || formData.peso_actual > 300) {
            setError('Peso actual inválido');
            return false;
        }
        if (formData.altura < 100 || formData.altura > 250) {
            setError('Altura inválida (en cm)');
            return false;
        }
        return true;
    };

    const validateStep3 = () => {
        if (!formData.objetivo || !formData.nivel_actividad) {
            setError('Por favor selecciona tu objetivo y nivel de actividad');
            return false;
        }
        if (!formData.aceptaPoliticas) {
            setError('Debes aceptar la Política de Privacidad y Cookies para continuar');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        setError('');
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;
        if (step === 3 && !validateStep3()) return;
        setStep(step + 1);
    };

    const handlePrev = () => {
        setError('');
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        // IMPORTANTE: Solo enviar si estamos en paso 3 Y el usuario hizo click en el botón
        if (step !== 3) {
            return;
        }

        // Validar solo datos básicos requeridos
        if (!formData.nombre || !formData.apellidos || !formData.email || !formData.password) {
            setError('Por favor completa todos los datos básicos');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const registerData = {
                nombre: formData.nombre,
                apellidos: formData.apellidos,
                email: formData.email,
                password: formData.password,
                telefono: formData.telefono || null,
                sexo: formData.sexo || null,
                edad: formData.edad ? parseInt(formData.edad) : null,
                peso_actual: formData.peso_actual ? parseFloat(formData.peso_actual) : null,
                altura: formData.altura ? parseInt(formData.altura) : null,
                peso_objetivo: formData.peso_objetivo ? parseFloat(formData.peso_objetivo) : null,
                objetivo: formData.objetivo,
                nivel_actividad: formData.nivel_actividad,
                notas_salud: formData.notas_salud || null,
                quiere_premium: false
            };

            const response = await api.post('/register', registerData);

            if (response.data.success) {
                console.log("Registro exitoso. Iniciando auto-login...");
                // Auto-login después del registro
                try {
                    const loginResult = await login(formData.email, formData.password);
                    console.log("Resultado auto-login:", loginResult);

                    if (loginResult && loginResult.success) {
                        console.log("Auto-login exitoso. Redirigiendo a dashboard...");
                        navigate('/dashboard');
                    } else {
                        console.error("Auto-login falló:", loginResult);
                        // Si falla el auto-login, redirigir a login
                        navigate('/login');
                    }
                } catch (loginError) {
                    console.error("Excepción en auto-login:", loginError);
                    navigate('/login');
                }
            } else {
                setError(response.data.error || 'Error al registrar usuario');
            }
        } catch (err) {
            console.error('Error en registro:', err);
            setError(err.response?.data?.error || 'Error de conexión. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-uf-darker to-black px-4 py-12">
            <div className="w-full max-w-3xl">
                {/* Header */}
                <div className="bg-uf-gold py-6 text-center rounded-t-lg">
                    <h1 className="text-3xl font-bold text-black uppercase tracking-wider">
                        Crear Cuenta
                    </h1>
                    <p className="text-black/70 mt-2">Paso {step} de 3</p>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-900 px-6 py-4">
                    <div className="flex justify-between mb-2">
                        <span className={`text-sm font-bold ${step >= 1 ? 'text-uf-gold' : 'text-gray-500'}`}>Datos Básicos</span>
                        <span className={`text-sm font-bold ${step >= 2 ? 'text-uf-gold' : 'text-gray-500'}`}>Datos Físicos</span>
                        <span className={`text-sm font-bold ${step >= 3 ? 'text-uf-gold' : 'text-gray-500'}`}>Objetivos</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-uf-gold h-2 rounded-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-gray-800 rounded-b-lg shadow-2xl p-8">
                    <div>
                        {/* PASO 1: Datos Básicos */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <User className="w-6 h-6 text-uf-gold" />
                                    <h2 className="text-xl font-bold text-white">Datos Básicos</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre *" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-uf-gold focus:outline-none" required />
                                    <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} placeholder="Apellidos *" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-uf-gold focus:outline-none" required />
                                </div>

                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email *" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-uf-gold focus:outline-none" required />

                                <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono (opcional)" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-uf-gold focus:outline-none" />

                                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Contraseña *" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-uf-gold focus:outline-none" required />

                                <input type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} placeholder="Confirmar Contraseña *" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-uf-gold focus:outline-none" required />
                            </div>
                        )}

                        {/* PASO 2: Datos Físicos */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <Activity className="w-6 h-6 text-uf-gold" />
                                    <h2 className="text-xl font-bold text-white">Datos Físicos</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <select name="sexo" value={formData.sexo} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-uf-gold focus:outline-none" required>
                                        <option value="">Sexo *</option>
                                        <option value="masculino">Masculino</option>
                                        <option value="femenino">Femenino</option>
                                    </select>

                                    <input type="number" name="edad" value={formData.edad} onChange={handleChange} placeholder="Edad *" min="12" max="120" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-uf-gold focus:outline-none" required />

                                    <input type="number" step="0.1" name="peso_actual" value={formData.peso_actual} onChange={handleChange} placeholder="Peso Actual (kg) *" min="30" max="300" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-uf-gold focus:outline-none" required />

                                    <input type="number" name="altura" value={formData.altura} onChange={handleChange} placeholder="Altura (cm) *" min="100" max="250" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-uf-gold focus:outline-none" required />

                                    <input type="number" step="0.1" name="peso_objetivo" value={formData.peso_objetivo} onChange={handleChange} placeholder="Peso Objetivo (kg)" min="30" max="300" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-uf-gold focus:outline-none" />
                                </div>
                            </div>
                        )}

                        {/* PASO 3: Objetivos */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <Target className="w-6 h-6 text-uf-gold" />
                                    <h2 className="text-xl font-bold text-white">Objetivos y Actividad</h2>
                                </div>

                                <div>
                                    <label className="text-white font-bold mb-2 block">Objetivo Principal</label>
                                    <select name="objetivo" value={formData.objetivo} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-uf-gold focus:outline-none">
                                        <option value="perdida_peso">Pérdida de Peso</option>
                                        <option value="ganancia_muscular">Ganancia Muscular</option>
                                        <option value="mantenimiento">Mantenimiento</option>
                                        <option value="cuidar_alimentacion">Cuidar Alimentación</option>
                                        <option value="rendimiento">Mejorar Rendimiento</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-white font-bold mb-2 block">Nivel de Actividad</label>
                                    <select name="nivel_actividad" value={formData.nivel_actividad} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-uf-gold focus:outline-none">
                                        <option value="sedentario">Sedentario (poco o ningún ejercicio)</option>
                                        <option value="ligero">Ligero (ejercicio 1-3 días/semana)</option>
                                        <option value="moderado">Moderado (ejercicio 3-5 días/semana)</option>
                                        <option value="intenso">Intenso (ejercicio 6-7 días/semana)</option>
                                        <option value="muy_intenso">Muy Intenso (ejercicio 2 veces al día)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-white font-bold mb-2 block">Notas de Salud (opcional)</label>
                                    <textarea name="notas_salud" value={formData.notas_salud} onChange={handleChange} rows="3" placeholder="Alergias, condiciones médicas, restricciones alimentarias..." className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-uf-gold focus:outline-none"></textarea>
                                </div>

                                {/* Aceptación de Políticas */}
                                <div className="bg-gray-900 border-2 border-uf-gold/30 rounded-lg p-4 mt-4">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="aceptaPoliticas"
                                            checked={formData.aceptaPoliticas}
                                            onChange={handleChange}
                                            className="mt-1 w-5 h-5 accent-uf-gold cursor-pointer"
                                        />
                                        <span className="text-gray-300 text-sm leading-relaxed">
                                            Acepto la{' '}
                                            <Link
                                                to="/politica-privacidad"
                                                target="_blank"
                                                className="text-uf-gold hover:text-uf-blue font-bold underline"
                                            >
                                                Política de Privacidad y Cookies
                                            </Link>
                                            {' '}de Ultimate Fitness *
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            {step > 1 && (
                                <button type="button" onClick={handlePrev} className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 transition-all">
                                    <ChevronLeft className="w-5 h-5" />
                                    Anterior
                                </button>
                            )}

                            <div className="ml-auto">
                                {step < 3 ? (
                                    <button type="button" onClick={handleNext} className="flex items-center gap-2 px-6 py-3 bg-uf-gold text-black rounded-lg font-bold hover:bg-yellow-600 transition-all">
                                        Siguiente
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button type="button" onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-8 py-3 bg-uf-gold text-black rounded-lg font-bold hover:bg-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                                        <Check className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/login" className="text-uf-gold hover:underline font-bold">
                                Inicia Sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
