// ============================================
// POLÍTICA DE PRIVACIDAD Y COOKIES
// ============================================
import { Link } from 'react-router-dom';
import { Shield, Cookie, Mail, FileText, Lock, Eye } from 'lucide-react';

function PoliticaPrivacidad() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-uf-darker to-black py-12 px-4">
            <div className="container mx-auto max-w-5xl">

                {/* Header */}
                <div className="bg-uf-gold rounded-t-lg py-8 px-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Shield className="w-10 h-10 text-black" />
                        <h1 className="text-4xl font-bold text-black uppercase tracking-wider">
                            Política de Privacidad y Cookies
                        </h1>
                    </div>
                    <p className="text-black/70 mt-2">Ultimate Fitness - Página Web Comercial</p>
                </div>

                {/* Contenido */}
                <div className="bg-gray-800 rounded-b-lg shadow-2xl p-8 text-white space-y-8">

                    {/* 1. Responsable del Tratamiento */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-6 h-6 text-uf-gold" />
                            <h2 className="text-2xl font-bold text-uf-gold">1. Responsable del Tratamiento</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            <strong>Ultimate Fitness</strong> (en adelante, "la Empresa" o "la Web") es responsable del tratamiento de los datos personales recopilados a través de este sitio web.
                        </p>
                        <div className="bg-gray-900 border border-uf-gold/30 rounded-lg p-4">
                            <p className="text-gray-300">
                                <strong className="text-uf-gold">Contacto del responsable:</strong><br />
                                Correo electrónico: <a href="mailto:info@ultimatefitness.com" className="text-uf-blue hover:underline">info@ultimatefitness.com</a>
                            </p>
                        </div>
                    </section>

                    {/* 2. Datos Personales que se Recopilan */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Eye className="w-6 h-6 text-uf-gold" />
                            <h2 className="text-2xl font-bold text-uf-gold">2. Datos Personales que se Recopilan</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            La Web recopila las siguientes categorías de datos con fines comerciales y operativos:
                        </p>

                        <div className="space-y-4">
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                <h3 className="text-lg font-bold text-white mb-2">a) Datos facilitados por el usuario</h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                                    <li>Nombre y apellidos</li>
                                    <li>Dirección de correo electrónico</li>
                                    <li>Teléfono</li>
                                    <li>Dirección de envío (si aplica venta de productos físicos)</li>
                                    <li>Datos de facturación</li>
                                    <li>Información de pago (procesada de forma segura por terceros, no almacenada en la Web)</li>
                                    <li>Datos necesarios para gestionar pedidos, suscripciones o consultas</li>
                                </ul>
                            </div>

                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                <h3 className="text-lg font-bold text-white mb-2">b) Datos automáticos</h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                                    <li>Dirección IP</li>
                                    <li>Navegador y dispositivo utilizado</li>
                                    <li>Patrones de navegación</li>
                                    <li>Cookies técnicas, analíticas y publicitarias</li>
                                </ul>
                            </div>

                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                <h3 className="text-lg font-bold text-white mb-2">c) Datos derivados de compras o servicios</h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                                    <li>Historial de pedidos</li>
                                    <li>Suscripciones o renovaciones</li>
                                    <li>Preferencias comerciales</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 3. Finalidad Comercial del Tratamiento */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Lock className="w-6 h-6 text-uf-gold" />
                            <h2 className="text-2xl font-bold text-uf-gold">3. Finalidad Comercial del Tratamiento</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Los datos se utilizarán para:
                        </p>

                        <div className="space-y-3">
                            <div className="bg-gray-900 border-l-4 border-uf-gold p-4">
                                <h3 className="font-bold text-white mb-2">Gestionar procesos de compra:</h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                                    <li>Tramitación de pedidos</li>
                                    <li>Envíos y devoluciones</li>
                                    <li>Facturación y pagos</li>
                                </ul>
                            </div>

                            <div className="bg-gray-900 border-l-4 border-uf-gold p-4">
                                <h3 className="font-bold text-white mb-2">Prestación de servicios online:</h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                                    <li>Acceso a planes fitness</li>
                                    <li>Gestión de cuentas de usuario</li>
                                    <li>Comunicación informativa necesaria</li>
                                </ul>
                            </div>

                            <div className="bg-gray-900 border-l-4 border-uf-gold p-4">
                                <h3 className="font-bold text-white mb-2">Marketing y comunicaciones comerciales:</h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                                    <li>Envío de promociones, newsletters y ofertas</li>
                                    <li>Segmentación básica para ofrecer contenido relevante (email marketing)</li>
                                </ul>
                                <p className="text-sm text-gray-400 mt-2 italic">El usuario puede darse de baja en cualquier momento.</p>
                            </div>

                            <div className="bg-gray-900 border-l-4 border-uf-gold p-4">
                                <h3 className="font-bold text-white mb-2">Mejora del sitio web y análisis de uso:</h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                                    <li>Estadísticas</li>
                                    <li>Optimización de experiencia de compra</li>
                                    <li>Seguridad y prevención de fraudes</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 4. Base Jurídica */}
                    <section>
                        <h2 className="text-2xl font-bold text-uf-gold mb-4">4. Base Jurídica</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            El tratamiento se basa en:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li><strong>Ejecución de un contrato</strong> (compras, suscripciones, soporte técnico).</li>
                            <li><strong>Consentimiento del usuario</strong> (formularios, boletines, cookies no esenciales).</li>
                            <li><strong>Intereses legítimos</strong> de la Empresa (seguridad, mejora del servicio, estadísticas).</li>
                            <li><strong>Cumplimiento de obligaciones legales</strong> (facturación, contabilidad, garantías).</li>
                        </ul>
                    </section>

                    {/* 5. Conservación de los Datos */}
                    <section>
                        <h2 className="text-2xl font-bold text-uf-gold mb-4">5. Conservación de los Datos</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Los datos se conservarán:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li><strong>Datos comerciales y facturación:</strong> durante 6 años (obligación legal).</li>
                            <li><strong>Datos de cuenta de usuario:</strong> mientras la cuenta esté activa.</li>
                            <li><strong>Datos de marketing:</strong> hasta la revocación del consentimiento.</li>
                            <li><strong>Cookies:</strong> según los plazos indicados en el navegador o en el apartado de cookies.</li>
                        </ul>
                        <p className="text-gray-400 mt-4 italic">
                            Una vez cumplido el plazo, se eliminarán de forma segura.
                        </p>
                    </section>

                    {/* 6. Destinatarios y Cesiones */}
                    <section>
                        <h2 className="text-2xl font-bold text-uf-gold mb-4">6. Destinatarios y Cesiones</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Los datos podrán compartirse únicamente con:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li>Proveedores de pago seguro (Stripe, PayPal u otros).</li>
                            <li>Servicios de alojamiento web y bases de datos.</li>
                            <li>Empresas de transporte (si hay envíos físicos).</li>
                            <li>Plataformas de email marketing.</li>
                            <li>Servicios de analítica web.</li>
                        </ul>
                        <p className="text-gray-400 mt-4">
                            Todos los proveedores actúan como <strong>Encargados del Tratamiento</strong> bajo contrato conforme al RGPD.
                        </p>
                        <p className="text-gray-400 mt-2">
                            <strong>No se realizan transferencias internacionales sin garantías adecuadas.</strong>
                        </p>
                    </section>

                    {/* 7. Derechos del Usuario */}
                    <section>
                        <h2 className="text-2xl font-bold text-uf-gold mb-4">7. Derechos del Usuario</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            El usuario puede ejercer:
                        </p>
                        <div className="grid md:grid-cols-2 gap-3 mb-4">
                            <div className="bg-gray-900 border border-uf-gold/30 rounded-lg p-3 text-center">
                                <p className="text-white font-bold">Acceso</p>
                            </div>
                            <div className="bg-gray-900 border border-uf-gold/30 rounded-lg p-3 text-center">
                                <p className="text-white font-bold">Rectificación</p>
                            </div>
                            <div className="bg-gray-900 border border-uf-gold/30 rounded-lg p-3 text-center">
                                <p className="text-white font-bold">Supresión</p>
                            </div>
                            <div className="bg-gray-900 border border-uf-gold/30 rounded-lg p-3 text-center">
                                <p className="text-white font-bold">Limitación</p>
                            </div>
                            <div className="bg-gray-900 border border-uf-gold/30 rounded-lg p-3 text-center">
                                <p className="text-white font-bold">Portabilidad</p>
                            </div>
                            <div className="bg-gray-900 border border-uf-gold/30 rounded-lg p-3 text-center">
                                <p className="text-white font-bold">Oposición</p>
                            </div>
                        </div>
                        <div className="bg-uf-gold/10 border border-uf-gold rounded-lg p-4">
                            <p className="text-white">
                                Para ejercerlos, enviar un email con el asunto <strong>"Ejercicio de derechos RGPD"</strong> a:{' '}
                                <a href="mailto:info@ultimatefitness.com" className="text-uf-blue hover:underline font-bold">
                                    info@ultimatefitness.com
                                </a>
                            </p>
                        </div>
                    </section>

                    {/* POLÍTICA DE COOKIES */}
                    <section className="border-t-4 border-uf-gold pt-8 mt-8">
                        <div className="flex items-center gap-2 mb-6">
                            <Cookie className="w-8 h-8 text-uf-gold" />
                            <h2 className="text-3xl font-bold text-uf-gold">Política de Cookies</h2>
                        </div>

                        {/* 1. Qué son las Cookies */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-3">1. ¿Qué son las Cookies?</h3>
                            <p className="text-gray-300 leading-relaxed">
                                La Web utiliza cookies propias y de terceros que almacenan información para mejorar la experiencia de navegación, analizar tráfico y mostrar contenido comercial relevante.
                            </p>
                        </div>

                        {/* 2. Tipos de Cookies Utilizadas */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-3">2. Tipos de Cookies Utilizadas</h3>
                            <div className="space-y-3">
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <h4 className="font-bold text-uf-gold mb-2">a) Cookies técnicas (obligatorias)</h4>
                                    <p className="text-gray-300">
                                        Necesarias para el funcionamiento de la Web y el proceso de compra.
                                    </p>
                                </div>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <h4 className="font-bold text-uf-gold mb-2">b) Cookies de preferencias</h4>
                                    <p className="text-gray-300">
                                        Recuerdan idioma, región o configuraciones del usuario.
                                    </p>
                                </div>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <h4 className="font-bold text-uf-gold mb-2">c) Cookies analíticas</h4>
                                    <p className="text-gray-300">
                                        Permiten medir visitas y comportamiento de los usuarios.<br />
                                        <span className="text-sm text-gray-400">Ejemplos: Google Analytics, Meta Pixel.</span>
                                    </p>
                                </div>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <h4 className="font-bold text-uf-gold mb-2">d) Cookies publicitarias</h4>
                                    <p className="text-gray-300">
                                        Utilizadas para mostrar anuncios y promociones adaptadas a los intereses del usuario.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 3. Gestión de las Cookies */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-3">3. Gestión de las Cookies</h3>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                El usuario puede:
                            </p>
                            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4 mb-4">
                                <li>Aceptarlas.</li>
                                <li>Rechazarlas.</li>
                                <li>Configurarlas desde el panel de cookies.</li>
                                <li>Eliminarlas desde el navegador.</li>
                            </ul>
                            <p className="text-gray-300 mb-3">
                                Más información según navegador:
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="bg-gray-900 hover:bg-uf-gold hover:text-black text-white px-4 py-2 rounded-lg font-bold transition">
                                    Chrome
                                </a>
                                <a href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-" target="_blank" rel="noopener noreferrer" className="bg-gray-900 hover:bg-uf-gold hover:text-black text-white px-4 py-2 rounded-lg font-bold transition">
                                    Firefox
                                </a>
                                <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="bg-gray-900 hover:bg-uf-gold hover:text-black text-white px-4 py-2 rounded-lg font-bold transition">
                                    Edge
                                </a>
                                <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="bg-gray-900 hover:bg-uf-gold hover:text-black text-white px-4 py-2 rounded-lg font-bold transition">
                                    Safari
                                </a>
                            </div>
                            <p className="text-gray-400 mt-4 italic">
                                Deshabilitar algunas cookies puede reducir la funcionalidad de la Web.
                            </p>
                        </div>

                        {/* 4. Consentimiento */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-3">4. Consentimiento</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Al continuar navegando o aceptar el banner de cookies, el usuario consiente su uso según esta política. Puede modificar o retirar el consentimiento en cualquier momento desde la configuración del navegador o borrando las cookies existentes.
                            </p>
                        </div>
                    </section>

                    {/* Actualizaciones de la Política */}
                    <section className="bg-uf-gold/10 border border-uf-gold rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-uf-gold mb-3">Actualizaciones de la Política</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Ultimate Fitness puede actualizar este documento para cumplir requisitos legales o técnicos. La versión vigente será siempre la publicada en la Web.
                        </p>
                    </section>

                    {/* Volver a Home */}
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

export default PoliticaPrivacidad;
