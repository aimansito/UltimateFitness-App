// ============================================
// SERVICIOS - Página de servicios y planes
// ============================================
import { PAGOS } from "../../config/funciones";
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import PageHeader from '../../components/common/PageHeader';

function Servicios() {

    // ============================================
    // DATOS - Servicios detallados
    // ============================================
    const servicios = [
        {
            id: 1,
            icono: (
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
            ),
            titulo: 'SEGUIMIENTO DE PROGRESO',
            descripcion: 'Seguimiento personalizado de tu progreso con ajustes constantes a tu plan',
            caracteristicas: [
                'Seguimiento de progreso 24/7',
                'Ajustes semanales garantizados',
                'Análisis de progreso detallado'
            ],
            color: 'from-uf-gold to-yellow-700'
        },
        {
            id: 2,
            icono: (
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ),
            titulo: 'DIETAS PERSONALIZADAS',
            descripcion: 'Plan nutricional científico adaptado a tu metabolismo y objetivos',
            caracteristicas: [
                'Análisis nutricional completo',
                'Recetas exclusivas semanales',
                'Lista de compras optimizada',
                'Sustituciones ilimitadas',
                'App de seguimiento incluida'
            ],
            color: 'from-green-600 to-emerald-700'
        },
        {
            id: 3,
            icono: (
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
            ),
            titulo: 'ENTRENAMIENTOS ELITE',
            descripcion: 'Rutinas periodizadas diseñadas para resultados óptimos y sostenibles',
            caracteristicas: [
                'Programas periodizados científicos',
                'Videos 4K explicativos',
                'Calendario interactivo avanzado',
                'Tracking de PR\'s automático',
                'Ajustes según recuperación'
            ],
            color: 'from-blue-600 to-cyan-700'
        },
        {
            id: 4,
            icono: (
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
            ),
            titulo: 'CALENDARIO INTELIGENTE',
            descripcion: 'Organiza tus entrenamientos y comidas con un calendario personal y seguimiento diario',
            caracteristicas: [
                'Calendario personal de entrenamientos',
                'Registro de comidas y dietas',
                'Notas y seguimiento diario',
                'Historial de progreso',
                'Sincronización automática con tu plan'
            ],
            color: 'from-purple-600 to-pink-700'
        }
    ];

    // ============================================
    // DATOS - Planes (Gratis vs Premium)
    // ============================================
    const planes = [
        {
            id: 'free',
            nombre: 'PLAN GRATUITO',
            precio: 0,
            badge: PAGOS ? null : 'DISPONIBLE AHORA',
            descripcion: PAGOS ? 'Perfecto para comenzar tu transformación' : 'Durante el lanzamiento, todo incluido sin pagar nada',
            destacado: !PAGOS,
            caracteristicas: [
                { texto: 'Biblioteca completa de ejercicios', incluido: true },
                { texto: 'Crea tus rutinas y tus dietas', incluido: true },
                { texto: 'Rutinas y dietas listas del equipo', incluido: true },
                { texto: 'Calculadora de calorías y macros', incluido: true },
                { texto: 'Calendario y registro de entrenos', incluido: true },
                { texto: 'Blog y comunidad', incluido: true },
                { texto: 'Entrenador personal asignado', incluido: false },
                { texto: 'Rutinas y dietas a tu medida', incluido: false },
                { texto: 'Seguimiento semanal profesional', incluido: false }
            ],
            buttonText: 'COMENZAR GRATIS',
            buttonColor: PAGOS ? 'bg-gray-700 hover:bg-gray-800 border-gray-600 text-white' : 'bg-uf-gold hover:bg-yellow-400 text-black border-uf-gold',
            useLogo: false
        },
        {
            id: 'premium',
            nombre: 'ULTIMATE PREMIUM',
            precio: 0,
            precioOriginal: 19,
            badge: PAGOS ? 'MÁS POPULAR' : 'PRÓXIMAMENTE',
            descripcion: PAGOS ? 'Acceso total a todo nuestro ecosistema fitness' : 'Seguimiento profesional. Te avisaremos cuando esté disponible',
            destacado: PAGOS,
            proximamente: !PAGOS,
            caracteristicas: [
                { texto: 'Todo lo del plan gratuito', incluido: true },
                { texto: 'Entrenador personal asignado', incluido: true },
                { texto: 'Rutinas y dietas a tu medida', incluido: true },
                { texto: 'Videos de técnica en HD', incluido: true },
                { texto: 'Seguimiento semanal profesional', incluido: true },
                { texto: 'Ajustes ilimitados de rutinas', incluido: true },
                { texto: 'Análisis de progreso detallado', incluido: true },
                { texto: 'Acceso anticipado a contenido nuevo', incluido: true }
            ],
            buttonText: 'HACERSE PREMIUM',
            buttonColor: 'bg-uf-gold hover:bg-uf-blue text-black hover:text-white border-uf-gold',
            useLogo: true
        }
    ];

    return (
        <div className="min-h-screen bg-uf-darker">
            <SEO 
                title={PAGOS ? "Planes y Servicios Premium" : "Servicios"} 
                description="Entrenamientos, dietas, calendario y seguimiento de tu progreso. Crea tu cuenta gratis."
                keywords="planes gimnasio, seguimiento fitness online, dietas personalizadas, precios fitness, premium"
            />

            <PageHeader
                eyebrow="Planes y servicios"
                title="Nuestros"
                highlight="Servicios"
                subtitle="Una experiencia completa de entrenamiento y nutrición, respaldada por contenido de calidad y tecnología de vanguardia."
            />

            {/* ============================================ */}
            {/* SERVICIOS DETALLADOS - GRID */}
            {/* ============================================ */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">

                    {servicios.map((servicio) => (
                        <div
                            key={servicio.id}
                            className="uf-card uf-card-hover group p-8"
                        >
                            {/* Icono con fondo dorado */}
                            <div className="inline-flex items-center justify-center bg-uf-gold text-black rounded-2xl p-5 mb-6 group-hover:scale-110 transition-transform duration-300">
                                {servicio.icono}
                            </div>

                            {/* Título */}
                            <h3 className="text-2xl md:text-3xl font-anton font-bold text-white mb-4 uppercase tracking-wider">
                                {servicio.titulo}
                            </h3>

                            {/* Descripción */}
                            <p className="text-gray-400 text-base mb-6 leading-relaxed">
                                {servicio.descripcion}
                            </p>

                            {/* Lista de características */}
                            <ul className="space-y-3">
                                {servicio.caracteristicas.map((caracteristica, index) => (
                                    <li key={index} className="flex items-start text-gray-300">
                                        <svg className="w-5 h-5 text-uf-gold mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">{caracteristica}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Efecto de brillo en hover */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${servicio.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500 pointer-events-none`}></div>
                        </div>
                    ))}

                </div>
            </div>

            {/* ============================================ */}
            {/* SECCIÓN DE PLANES */}
            {/* ============================================ */}
            <div className="relative bg-gradient-to-b from-black to-uf-darker py-20 border-t-2 border-uf-gold/20">

                {/* Header de planes con LOGO PREMIUM */}
                <div className="container mx-auto px-4 text-center mb-16">
                    <div className="flex justify-center mb-8">
                        <img
                            src="/logos/logo-premium.png"
                            alt="Ultimate Premium Fitness"
                            className="h-32 hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>

                    <h3 className="text-3xl md:text-4xl font-anton font-bold text-white mb-4 uppercase">
                        ELIGE TU <span className="text-uf-gold">PLAN</span>
                    </h3>
                    <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                        {PAGOS
                            ? 'Invierte en ti mismo. Cada plan está diseñado para maximizar tus resultados.'
                            : 'Empieza gratis con todo lo que necesitas. El plan Premium, con seguimiento profesional, llegará más adelante.'}
                    </p>
                </div>

                {/* Grid de planes */}
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                        {planes.map((plan) => (
                            <div
                                key={plan.id}
                                className={`
                  relative bg-gradient-to-br from-uf-dark to-black rounded-2xl overflow-hidden border-2
                  ${plan.destacado
                                        ? 'border-uf-gold shadow-2xl shadow-uf-gold/30 transform md:scale-105'
                                        : 'border-gray-700'
                                    }
                  transition-all duration-500 hover:scale-105
                `}
                            >
                                {/* Badge "Más popular" */}
                                {plan.badge && (
                                    <div className="absolute top-0 right-0 bg-uf-gold text-black px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-bl-2xl flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        {plan.badge}
                                    </div>
                                )}

                                {/* Contenido del plan */}
                                <div className="p-8">

                                    {/* Nombre del plan (Premium con su logo) */}
                                    {plan.useLogo ? (
                                        <img
                                            src="/logos/logo-premium.png"
                                            alt="Ultimate Fitness Premium"
                                            className="h-20 w-auto mb-3"
                                        />
                                    ) : (
                                        <h4 className="text-2xl font-anton text-white mb-2 uppercase tracking-wider">
                                            {plan.nombre}
                                        </h4>
                                    )}

                                    {/* Precio */}
                                    <div className="mb-6">
                                        {plan.proximamente ? (
                                            <>
                                                <span className="font-anton text-4xl text-gray-400 uppercase">
                                                    Próximamente
                                                </span>
                                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-2">
                                                    Precio por anunciar
                                                </p>
                                            </>
                                        ) : plan.precioOriginal ? (
                                            <>
                                                <span className="text-2xl font-bold text-gray-500 line-through mr-3">
                                                    {plan.precioOriginal}€
                                                </span>
                                                <span className="font-anton text-5xl text-uf-gold">
                                                    GRATIS
                                                </span>
                                                <p className="text-uf-gold text-xs font-bold uppercase tracking-wider mt-2">
                                                    Oferta de lanzamiento
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <span className="font-anton text-5xl text-uf-gold">
                                                    {plan.precio}€
                                                </span>
                                                <span className="text-gray-400 text-lg ml-2">
                                                    {plan.precio === 0 ? 'siempre gratis' : '/mes'}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Descripción */}
                                    <p className="text-gray-400 text-sm mb-8">
                                        {plan.descripcion}
                                    </p>

                                    {/* Características */}
                                    <div className="space-y-3 mb-8 max-h-96 overflow-y-auto scrollbar-hide">
                                        {plan.caracteristicas.map((car, index) => (
                                            <div key={index} className="flex items-start">
                                                {car.incluido ? (
                                                    <svg className="w-5 h-5 text-uf-gold mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5 text-gray-700 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                <span className={`text-sm ${car.incluido ? 'text-white' : 'text-gray-600'}`}>
                                                    {car.texto}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Botón CTA con icono */}
                                    {plan.proximamente ? (
                                    <span
                                        aria-disabled="true"
                                        className="flex items-center justify-center gap-2 w-full text-center font-bold py-4 rounded-xl uppercase tracking-wider border-2 border-gray-700 text-gray-400 cursor-default"
                                    >
                                        DISPONIBLE PRONTO
                                    </span>
                                    ) : (
                                    <Link
                                        to={plan.id === 'free' ? '/register' : '/upgrade-premium'}
                                        className={`
                      flex items-center justify-center gap-2 w-full text-center font-bold py-4 rounded-xl uppercase tracking-wider
                      transition-all duration-300 transform hover:scale-105 border-2
                      ${plan.buttonColor}
                      shadow-lg hover:shadow-2xl
                    `}
                                    >
                                        {plan.useLogo && (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        )}
                                        {plan.buttonText}
                                    </Link>
                                    )}
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>

            {/* ============================================ */}
            {/* CTA FINAL */}
            {/* ============================================ */}
            <div className="container mx-auto px-4 py-20">
                <div className="uf-card border-uf-gold/50 p-12 text-center">
                    <h3 className="text-3xl md:text-4xl font-anton font-bold text-white mb-4 uppercase">
                        ¿Necesitas más <span className="text-uf-gold">información</span>?
                    </h3>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        Nuestro equipo está disponible para resolver todas tus dudas y ayudarte a elegir el plan perfecto
                    </p>
                    <Link
                        to="/contacto"
                        className="uf-btn uf-btn-primary"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contactar ahora
                    </Link>
                </div>
            </div>

        </div>
    );
}

export default Servicios;