import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { CreditCard, Check, Crown, Loader, Sparkles, Shield, Users } from 'lucide-react';

function UpgradePremium() {
    const navigate = useNavigate();
    const { user, isPremium, logout } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        numero_tarjeta: '',
        nombre_titular: '',
        fecha_expiracion: '',
        cvv: '',
        metodo_pago: 'tarjeta'
    });

    // Si no está logueado, mostrar mensaje y redirigir al login
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-uf-darker to-black flex items-center justify-center px-4">
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-md w-full text-center">
                    <Shield className="w-16 h-16 text-uf-gold mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">Inicia Sesión</h2>
                    <p className="text-gray-400 mb-6">
                        Necesitas iniciar sesión para activar Premium
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-uf-gold text-black font-bold py-3 rounded hover:bg-yellow-600 transition"
                    >
                        Ir al Login
                    </button>
                </div>
            </div>
        );
    }

    // Si ya es premium, redirigir
    if (isPremium) {
        navigate('/dashboard');
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Formatear número de tarjeta
        if (name === 'numero_tarjeta') {
            const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            setFormData({ ...formData, [name]: formatted });
        }
        // Formatear fecha MM/AA
        else if (name === 'fecha_expiracion') {
            let formatted = value.replace(/\D/g, '');
            if (formatted.length >= 2) {
                formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
            }
            setFormData({ ...formData, [name]: formatted });
        }
        // CVV solo números
        else if (name === 'cvv') {
            setFormData({ ...formData, [name]: value.replace(/\D/g, '').slice(0, 3) });
        }
        else {
            setFormData({ ...formData, [name]: value });
        }

        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validaciones básicas
        if (formData.numero_tarjeta.replace(/\s/g, '').length !== 16) {
            setError('Número de tarjeta inválido');
            setLoading(false);
            return;
        }

        if (formData.cvv.length !== 3) {
            setError('CVV inválido');
            setLoading(false);
            return;
        }

        try {
            // Llamar al endpoint de activar premium
            const response = await api.post('/suscripciones/activar-premium', {
                metodo_pago: formData.metodo_pago,
                referencia: `TARJETA-${formData.numero_tarjeta.slice(-4)}-${Date.now()}`,
                ultimos4_digitos: formData.numero_tarjeta.replace(/\s/g, '').slice(-4)
            });

            if (response.data.success) {
                // Si el backend pide force_logout, cerrar sesión y redirigir
                if (response.data.force_logout) {
                    alert(response.data.message || '¡Pago completado! Vuelve a iniciar sesión para activar Premium.');
                    logout();
                    navigate('/login');
                    return;
                }

                // Fallback: si no hay force_logout (compatibilidad)
                alert(`¡Bienvenido a Premium! ${response.data.message}`);
                navigate('/dashboard');
            } else {
                setError(response.data.error || 'Error al procesar el pago');
            }
        } catch (err) {
            console.error('Error al activar premium:', err);

            // Manejo específico de error 401
            if (err.response?.status === 401) {
                setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(err.response?.data?.error || 'Error de conexión. Intenta de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-uf-darker to-black px-4 py-12">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <Crown className="w-16 h-16 text-uf-gold" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Hazte <span className="text-uf-gold">Premium</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Desbloquea todo el potencial de Ultimate Fitness
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Beneficios Premium */}
                    <div className="bg-gradient-to-br from-uf-gold/10 to-yellow-900/10 border-2 border-uf-gold rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-uf-gold" />
                            Beneficios Premium
                        </h2>

                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-white">
                                <Check className="w-6 h-6 text-uf-gold flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold">Entrenador Personal Asignado</p>
                                    <p className="text-sm text-gray-400">Un profesional dedicado para guiarte</p>
                                </div>
                            </li>

                            <li className="flex items-start gap-3 text-white">
                                <Check className="w-6 h-6 text-uf-gold flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold">Planes Personalizados</p>
                                    <p className="text-sm text-gray-400">Dietas y entrenamientos adaptados a ti</p>
                                </div>
                            </li>

                            <li className="flex items-start gap-3 text-white">
                                <Check className="w-6 h-6 text-uf-gold flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold">Acceso Completo al Blog</p>
                                    <p className="text-sm text-gray-400">Contenido exclusivo premium</p>
                                </div>
                            </li>

                            <li className="flex items-start gap-3 text-white">
                                <Check className="w-6 h-6 text-uf-gold flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold">Seguimiento de Progreso</p>
                                    <p className="text-sm text-gray-400">Analíticas avanzadas y métricas detalladas</p>
                                </div>
                            </li>

                            <li className="flex items-start gap-3 text-white">
                                <Check className="w-6 h-6 text-uf-gold flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold">Soporte Prioritario</p>
                                    <p className="text-sm text-gray-400">Respuestas rápidas a tus consultas</p>
                                </div>
                            </li>
                        </ul>

                        <div className="mt-8 pt-8 border-t border-uf-gold/30">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold text-uf-gold">19.99€</span>
                                <span className="text-gray-400">/mes</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-2">
                                Cancela cuando quieras
                            </p>
                        </div>
                    </div>

                    {/* Formulario de Pago */}
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <CreditCard className="w-6 h-6 text-uf-gold" />
                            Información de Pago
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Número de Tarjeta */}
                            <div>
                                <label className="block text-sm font-bold text-white mb-2">
                                    Número de Tarjeta
                                </label>
                                <input
                                    type="text"
                                    name="numero_tarjeta"
                                    value={formData.numero_tarjeta}
                                    onChange={handleChange}
                                    placeholder="4242 4242 4242 4242"
                                    maxLength="19"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-uf-gold focus:outline-none"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Pago simulado - Usa 4242 4242 4242 4242</p>
                            </div>

                            {/* Nombre del Titular */}
                            <div>
                                <label className="block text-sm font-bold text-white mb-2">
                                    Nombre del Titular
                                </label>
                                <input
                                    type="text"
                                    name="nombre_titular"
                                    value={formData.nombre_titular}
                                    onChange={handleChange}
                                    placeholder="NOMBRE APELLIDO"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white uppercase focus:border-uf-gold focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Fecha y CVV */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-white mb-2">
                                        Fecha Exp.
                                    </label>
                                    <input
                                        type="text"
                                        name="fecha_expiracion"
                                        value={formData.fecha_expiracion}
                                        onChange={handleChange}
                                        placeholder="MM/AA"
                                        maxLength="5"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-uf-gold focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-white mb-2">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        name="cvv"
                                        value={formData.cvv}
                                        onChange={handleChange}
                                        placeholder="123"
                                        maxLength="3"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-uf-gold focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Seguridad */}
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Shield className="w-5 h-5 text-green-400" />
                                    <span>Pago 100% seguro y encriptado</span>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Botón de Pago */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-uf-gold text-black font-bold py-4 rounded-lg hover:bg-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Procesando Pago...
                                    </>
                                ) : (
                                    <>
                                        <Crown className="w-5 h-5" />
                                        Activar Premium - 19.99€/mes
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-center text-gray-500">
                                Al confirmar, aceptas nuestros términos y condiciones. El cargo será mensual hasta que canceles.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpgradePremium;
