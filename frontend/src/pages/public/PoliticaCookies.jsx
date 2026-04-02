// ============================================
// POLÍTICA DE COOKIES - Página independiente
// ============================================
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import SEO from '../../components/common/SEO';

function PoliticaCookies() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-uf-darker to-black py-12 px-4">
            <SEO
                title="Política de Cookies"
                description="Política de cookies de Ultimate Fitness. Información sobre las cookies que utilizamos, su finalidad y cómo gestionarlas."
                keywords="cookies, política cookies, gestión cookies, privacidad"
            />
            <div className="container mx-auto max-w-5xl">

                {/* Header */}
                <div className="bg-uf-gold rounded-t-lg py-8 px-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Cookie className="w-10 h-10 text-black" />
                        <h1 className="text-4xl font-bold text-black uppercase tracking-wider">
                            Política de Cookies
                        </h1>
                    </div>
                    <p className="text-black/70 mt-2">Ultimate Fitness - Conforme a la LSSI-CE y RGPD</p>
                </div>

                {/* Contenido */}
                <div className="bg-gray-800 rounded-b-lg shadow-2xl p-8 text-white space-y-8">

                    {/* 1. Qué son las cookies */}
                    <section>
                        <h2 className="text-2xl font-bold text-uf-gold mb-4">1. ¿Qué son las Cookies?</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo
                            (ordenador, tablet o móvil) cuando los visitas. Permiten que el sitio web recuerde tus acciones
                            y preferencias durante un período de tiempo, para que no tengas que volver a introducirlos
                            cada vez que vuelvas al sitio o navegues de una página a otra.
                        </p>
                    </section>

                    {/* 2. Tipos de cookies */}
                    <section>
                        <h2 className="text-2xl font-bold text-uf-gold mb-4">2. Tipos de Cookies que Utilizamos</h2>
                        <div className="space-y-4">
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                <h3 className="font-bold text-uf-gold mb-2">🔧 Cookies Técnicas (Necesarias)</h3>
                                <p className="text-gray-300 mb-2">Esenciales para el funcionamiento de la web.</p>
                                <ul className="list-disc list-inside text-gray-400 space-y-1 ml-4 text-sm">
                                    <li>Sesión de usuario y autenticación</li>
                                    <li>Preferencias de idioma</li>
                                    <li>Seguridad y prevención de fraude</li>
                                </ul>
                            </div>
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                <h3 className="font-bold text-uf-gold mb-2">📊 Cookies Analíticas</h3>
                                <p className="text-gray-300 mb-2">Nos ayudan a entender cómo los usuarios interactúan con la web.</p>
                                <ul className="list-disc list-inside text-gray-400 space-y-1 ml-4 text-sm">
                                    <li><strong>Google Tag Manager</strong> — gestión de etiquetas y scripts</li>
                                    <li><strong>Microsoft Clarity</strong> — mapas de calor y grabaciones de sesión</li>
                                </ul>
                            </div>
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                <h3 className="font-bold text-uf-gold mb-2">📢 Cookies de Marketing</h3>
                                <p className="text-gray-300">
                                    Utilizadas para mostrar anuncios relevantes y medir la eficacia de nuestras campañas publicitarias.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 3. Gestión de cookies */}
                    <section>
                        <h2 className="text-2xl font-bold text-uf-gold mb-4">3. ¿Cómo Gestionar las Cookies?</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Puedes configurar tu navegador para rechazar, aceptar o eliminar cookies:
                        </p>
                        <div className="flex flex-wrap gap-3 mb-4">
                            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer"
                                className="bg-gray-900 hover:bg-uf-gold hover:text-black text-white px-4 py-2 rounded-lg font-bold transition">
                                Chrome
                            </a>
                            <a href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-" target="_blank" rel="noopener noreferrer"
                                className="bg-gray-900 hover:bg-uf-gold hover:text-black text-white px-4 py-2 rounded-lg font-bold transition">
                                Firefox
                            </a>
                            <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer"
                                className="bg-gray-900 hover:bg-uf-gold hover:text-black text-white px-4 py-2 rounded-lg font-bold transition">
                                Edge
                            </a>
                            <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer"
                                className="bg-gray-900 hover:bg-uf-gold hover:text-black text-white px-4 py-2 rounded-lg font-bold transition">
                                Safari
                            </a>
                        </div>
                        <div className="bg-gray-900 border-l-4 border-yellow-500 p-4">
                            <p className="text-gray-300">
                                <strong className="text-yellow-400">⚠️ Nota:</strong> Deshabilitar ciertas cookies puede
                                afectar al funcionamiento de la web y a la experiencia de navegación.
                            </p>
                        </div>
                    </section>

                    {/* 4. Actualizaciones */}
                    <section className="bg-uf-gold/10 border border-uf-gold rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-uf-gold mb-3">4. Actualización de esta Política</h2>
                        <p className="text-gray-300">
                            Esta Política de Cookies se actualiza cuando cambiamos los servicios de cookies que utilizamos.
                            Te recomendamos revisarla periódicamente. Última actualización: Abril 2026.
                        </p>
                    </section>

                    {/* Volver */}
                    <div className="text-center pt-6">
                        <Link
                            to="/"
                            className="inline-block bg-uf-gold hover:bg-uf-blue text-black hover:text-white font-bold px-8 py-3 rounded-lg uppercase tracking-wider transition-all transform hover:scale-105"
                        >
                            Volver al Inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PoliticaCookies;
