import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Check, Crown, Loader, Sparkles, Shield, Zap, X, CreditCard } from 'lucide-react';
import SEO from '../../components/common/SEO';

function UpgradePremium() {
    const navigate = useNavigate();
    const { user, isPremium, logout } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Si no está logueado, mostrar mensaje y redirigir al login
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-uf-darker to-black flex items-center justify-center px-4">
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-md w-full text-center">
                    <Shield className="w-16 h-16 text-uf-gold mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">Inicia Sesión</h2>
                    <p className="text-gray-400 mb-6">
                        Necesitas iniciar sesión para ver nuestros planes
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-uf-gold text-black font-bold py-3 rounded hover:bg-yellow-600 transition uppercase tracking-wider"
                    >
                        Ir al Login
                    </button>
                </div>
            </div>
        );
    }

    // Proceso de subscripción (Simulado / Preparado para Stripe Checkout)
    const handleSubscribe = async (planId) => {
        if (isPremium) {
            navigate('/dashboard');
            return;
        }

        setError('');
        setLoading(planId); // Identificar cual plan está cargando

        try {
            // SIMULACIÓN PROMOCIÓN LANZAMIENTO (Premium gratis)
            const response = await api.post('/suscripciones/activar-premium', {
                metodo_pago: 'promo_lanzamiento',
                referencia: `PROMO-${planId}-${Date.now()}`,
                ultimos4_digitos: '0000'
            });

            if (response.data.success) {
                if (response.data.force_logout) {
                    setSuccessMessage('¡Suscripción activada! Vuelve a iniciar sesión para ver tus nuevas funcionalidades.');
                    setShowSuccessModal(true);
                    setTimeout(() => { logout(); navigate('/login'); }, 4000);
                    return;
                }
                setSuccessMessage(`¡Bienvenido al Plan ${planId === 'premium' ? 'Premium' : 'Elite'}!`);
                setShowSuccessModal(true);
                setTimeout(() => { navigate('/dashboard'); }, 3000);
            } else {
                setError(response.data.error || 'Error al procesar la sesión de pago');
            }
        } catch (err) {
            console.error('Error al activar plan:', err);
            if (err.response?.status === 401) {
                setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(err.response?.data?.error || 'Error de conexión con la pasarela de pago.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-uf-darker to-black px-4 py-16">
            <SEO
                title="Planes de Suscripción"
                description="Desbloquea todo el potencial de Ultimate Fitness con nuestros planes Premium y Elite. Entrenador personal, dietas a medida, y seguimiento continuo."
                keywords="premium fitness, plan premium, entrenador personal online, nutrición personalizada, stripe fitness"
            />

            {/* Modal de Éxito */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
                    <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border-2 border-green-500 rounded-2xl p-8 max-w-md w-full text-center animate-fadeIn shadow-2xl">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">¡Pago Completado!</h2>
                        <p className="text-gray-300 text-lg mb-6">{successMessage}</p>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                            <p className="text-sm text-green-400 font-semibold">✨ Ya tienes acceso a los beneficios</p>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-gray-400">
                            <Loader className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Aplicando cambios...</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-4">
                        <Crown className="w-16 h-16 text-uf-gold" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-anton font-bold text-white mb-4 uppercase tracking-wider">
                        Elige tu <span className="text-uf-gold">Plan</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Selecciona el nivel de compromiso que mejor se adapte a tus objetivos.
                        Cancela o cambia de plan en cualquier momento.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg text-center mb-8 max-w-2xl mx-auto flex items-center justify-center gap-2">
                        <X className="w-5 h-5" /> {error}
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-8">
                    {/* PLAN GRATUITO */}
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 flex flex-col relative opacity-80 hover:opacity-100 transition-opacity">
                        <h2 className="text-2xl font-bold text-white mb-2">Básico</h2>
                        <p className="text-gray-400 text-sm mb-6 h-10">Ideal para empezar de forma autónoma.</p>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-4xl font-bold text-white">0€</span>
                            <span className="text-gray-500">/mes</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-start gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                <span>Acceso a rutinas generales</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                <span>Calculadora de Macros básica</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                <span>Lectura del Blog Público</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-600">
                                <X className="w-5 h-5 flex-shrink-0" />
                                <span className="line-through">Entrenador asignado</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-600">
                                <X className="w-5 h-5 flex-shrink-0" />
                                <span className="line-through">Dietas personalizadas</span>
                            </li>
                        </ul>
                        <button
                            disabled={!isPremium}
                            onClick={() => navigate('/dashboard')}
                            className="w-full bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-gray-700 transition"
                        >
                            {isPremium ? 'Estás en un plan superior' : 'Plan Actual'}
                        </button>
                    </div>

                    {/* PLAN PREMIUM (DESTACADO) */}
                    <div className="bg-gradient-to-b from-gray-900 to-black border-2 border-uf-gold rounded-2xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-uf-gold/20">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-uf-gold text-black font-bold px-6 py-1.5 rounded-full text-sm uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(204,148,26,0.6)]">
                            <Sparkles className="w-4 h-4" /> Oferta Limitada
                        </div>
                        <h2 className="text-2xl font-bold text-uf-gold mb-2">Premium</h2>
                        <p className="text-gray-300 text-sm mb-6 h-10">Resultados garantizados con seguimiento profesional.</p>
                        <div className="flex flex-col mb-8">
                            <span className="text-gray-500 line-through text-2xl font-bold decoration-red-500 opacity-60">19.99€/mes</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold text-white">0€</span>
                                <span className="text-uf-gold text-xs font-bold uppercase tracking-widest bg-uf-gold/20 px-2 py-1 rounded border border-uf-gold/30">¡Gratis!</span>
                            </div>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-start gap-3 text-white">
                                <Check className="w-5 h-5 text-uf-gold flex-shrink-0" />
                                <span><strong className="text-uf-gold">Entrenador</strong> personal asignado</span>
                            </li>
                            <li className="flex items-start gap-3 text-white">
                                <Check className="w-5 h-5 text-uf-gold flex-shrink-0" />
                                <span><strong className="text-uf-gold">Dietas y Rutinas</strong> hechas a medida</span>
                            </li>
                            <li className="flex items-start gap-3 text-white">
                                <Check className="w-5 h-5 text-uf-gold flex-shrink-0" />
                                <span>Acceso total a recetas y contenido premium</span>
                            </li>
                            <li className="flex items-start gap-3 text-white">
                                <Check className="w-5 h-5 text-uf-gold flex-shrink-0" />
                                <span>Chat asíncrono con tu entrenador</span>
                            </li>
                            <li className="flex items-start gap-3 text-white">
                                <Check className="w-5 h-5 text-uf-gold flex-shrink-0" />
                                <span>Revisión mensual de progreso</span>
                            </li>
                        </ul>
                        <button
                            disabled={isPremium || loading}
                            onClick={() => handleSubscribe('premium')}
                            className="w-full bg-uf-gold hover:bg-yellow-500 text-black font-bold py-4 rounded-xl transition transform hover:scale-105 flex justify-center items-center gap-2 uppercase tracking-wide disabled:opacity-50 disabled:transform-none"
                        >
                            {loading === 'premium' ? <Loader className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                            {isPremium ? 'Plan Activo' : 'Suscribirse al Premium'}
                        </button>
                    </div>

                    {/* PLAN ELITE */}
                    <div className="bg-gray-900 border border-gray-700 hover:border-uf-blue rounded-2xl p-8 flex flex-col relative transition-colors">
                        <h2 className="text-2xl font-bold text-uf-blue mb-2">Elite 1-a-1</h2>
                        <p className="text-gray-400 text-sm mb-6 h-10">Para atletas exigentes. Compromiso total 24/7.</p>
                        <div className="flex flex-col mb-8">
                            <span className="text-gray-500 line-through text-2xl font-bold decoration-red-500 opacity-60">49.99€/mes</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-white">0€</span>
                                <span className="text-uf-blue text-xs font-bold uppercase tracking-widest bg-uf-blue/20 px-2 py-1 rounded border border-uf-blue/30">Lanzamiento</span>
                            </div>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-start gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-uf-blue flex-shrink-0" />
                                <span>Todo lo del plan Premium, MÁS:</span>
                            </li>
                            <li className="flex items-start gap-3 text-white">
                                <Check className="w-5 h-5 text-uf-blue flex-shrink-0" />
                                <span><strong className="text-uf-blue">Videollamada</strong> semanal 1h</span>
                            </li>
                            <li className="flex items-start gap-3 text-white">
                                <Check className="w-5 h-5 text-uf-blue flex-shrink-0" />
                                <span>Ajustes infinitos según feedback</span>
                            </li>
                            <li className="flex items-start gap-3 text-white">
                                <Check className="w-5 h-5 text-uf-blue flex-shrink-0" />
                                <span>Soporte prioritario WhatsApp 24/7</span>
                            </li>
                        </ul>
                        <button
                            disabled={loading}
                            onClick={() => handleSubscribe('elite')}
                            className="w-full bg-transparent border-2 border-uf-blue text-white hover:bg-uf-blue hover:text-black font-bold py-3 rounded-xl transition flex justify-center items-center gap-2 uppercase tracking-wide disabled:opacity-50"
                        >
                            {loading === 'elite' ? <Loader className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                            Suscribirse Elite
                        </button>
                    </div>
                </div>

                <div className="mt-12 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" /> Pagos procesados de forma segura vía Stripe. Cancela cuando quieras.
                </div>
            </div>
        </div>
    );
}

export default UpgradePremium;
