import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Check, Crown, Loader, Sparkles, Shield, X, CreditCard } from 'lucide-react';
import SEO from '../../components/common/SEO';

function UpgradePremium() {
    const navigate = useNavigate();
    const { user, isPremium } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    // Suscripción real vía Stripe Checkout: redirige a la página de pago alojada por Stripe.
    // La confirmación real llega por el webhook (/api/stripe/webhook), no por este redirect.
    const handleSubscribe = async () => {
        if (isPremium) {
            navigate('/dashboard');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await api.post('/stripe/create-checkout-session', { planId: 'premium' });

            if (response.data.success && response.data.checkoutUrl) {
                window.location.href = response.data.checkoutUrl;
            } else {
                setError(response.data.error || 'Error al crear la sesión de pago');
                setLoading(false);
            }
        } catch (err) {
            console.error('Error al iniciar el pago:', err);
            if (err.response?.status === 401) {
                setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(err.response?.data?.error || 'Error de conexión con la pasarela de pago.');
            }
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

                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
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
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-5xl font-bold text-white">19,99€</span>
                            <span className="text-gray-500">/mes</span>
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
                            onClick={() => handleSubscribe()}
                            className="w-full bg-uf-gold hover:bg-yellow-500 text-black font-bold py-4 rounded-xl transition transform hover:scale-105 flex justify-center items-center gap-2 uppercase tracking-wide disabled:opacity-50 disabled:transform-none"
                        >
                            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                            {isPremium ? 'Plan Activo' : 'Suscribirse al Premium'}
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
