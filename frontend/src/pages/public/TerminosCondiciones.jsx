// ============================================
// TÉRMINOS Y CONDICIONES
// ============================================
import { Link } from 'react-router-dom';
import { FileCheck, Shield } from 'lucide-react';
import SEO from '../../components/common/SEO';

function TerminosCondiciones() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-uf-darker to-black py-12 px-4">
            <SEO
                title="Términos y Condiciones"
                description="Términos y condiciones de uso de Ultimate Fitness. Reglas de suscripción, política de reembolsos y obligaciones del usuario."
                keywords="términos condiciones, condiciones uso, suscripción fitness, reembolsos"
            />
            <div className="container mx-auto max-w-5xl">

                {/* Header */}
                <div className="bg-uf-gold rounded-t-lg py-8 px-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <FileCheck className="w-10 h-10 text-black" />
                        <h1 className="text-4xl font-bold text-black uppercase tracking-wider">
                            Términos y Condiciones
                        </h1>
                    </div>
                    <p className="text-black/70 mt-2">Ultimate Fitness - Condiciones de Uso del Servicio</p>
                </div>

                {/* Contenido */}
                <div className="bg-gray-800 rounded-b-lg shadow-2xl p-8 text-white space-y-8">

                    {/* 1. Aceptación */}
                    <section>
                        <h2 className="text-2xl font-bold text-uf-gold mb-4">1. Aceptación de los Términos</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Al registrarte y utilizar los servicios de Ultimate Fitness, aceptas estos Términos y Condiciones en su totalidad.
                            Si no estás de acuerdo con alguna de estas condiciones, no debes utilizar nuestros servicios.
                        </p>
                    </section>

                    {/* 2. Descripción del servicio */}
                    <section>
                        <h2 className="text-2xl font-bold text-uf-gold mb-4">2. Descripción del Servicio</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">Ultimate Fitness ofrece:</p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li>Planes de entrenamiento y rutinas de ejercicio.</li>
                            <li>Planificador de dietas y calculadora nutricional.</li>
                            <li>Contenido informativo a través del blog.</li>
                            <li>Servicios premium con entrenador personal asignado (suscripción de pago).</li>
                        </ul>
                    </section>

                    {/* 3. Registro */}
                    <section>
                        <h2 className="text-2xl font-bold text-uf-gold mb-4">3. Registro de Usuario</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Para acceder a ciertos servicios, es necesario crear una cuenta. El usuario se compromete a:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li>Proporcionar información veraz y actualizada.</li>
                            <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
                            <li>Ser mayor de 16 años o contar con el consentimiento de un tutor legal.</li>
                            <li>No crear cuentas falsas ni suplantando la identidad de otras personas.</li>
                        </ul>
                    </section>

                    {/* 4. Suscripciones y pagos */}
                    <section>
                        <h2 className="text-2xl font-bold text-uf-gold mb-4">4. Suscripciones y Pagos</h2>
                        <div className="space-y-4">
                            <div className="bg-gray-900 border-l-4 border-uf-gold p-4">
                                <h3 className="font-bold text-white mb-2">Plan Gratuito</h3>
                                <p className="text-gray-300">Acceso a contenido básico, rutinas generales y blog público.</p>
                            </div>
                            <div className="bg-gray-900 border-l-4 border-uf-gold p-4">
                                <h3 className="font-bold text-white mb-2">Plan Premium</h3>
                                <p className="text-gray-300">
                                    Incluye entrenador personal, dietas personalizadas, contenido exclusivo y soporte prioritario.
                                    El cobro se realiza de forma mensual a través de Stripe.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 5. Política de reembolsos */}
                    <section>
                        <h2 className="text-2xl font-bold text-uf-gold mb-4">5. Política de Cancelación y Reembolsos</h2>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li>El usuario puede cancelar su suscripción en cualquier momento.</li>
                            <li>La cancelación toma efecto al final del período facturado.</li>
                            <li>No se realizan reembolsos por períodos parciales ya facturados.</li>
                            <li>En caso de error en el cobro, contactar a soporte para su resolución.</li>
                        </ul>
                    </section>

                    {/* 6. Contenido del usuario */}
                    <section>
                        <h2 className="text-2xl font-bold text-uf-gold mb-4">6. Contenido Generado por el Usuario</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Los usuarios que creen contenido (dietas personalizadas, platos, valoraciones) mantienen la propiedad de dicho contenido.
                            Al publicarlo en la plataforma, otorgan a Ultimate Fitness una licencia no exclusiva para mostrarlo en el servicio.
                            Ultimate Fitness se reserva el derecho de eliminar contenido inapropiado o que vulnere derechos de terceros.
                        </p>
                    </section>

                    {/* 7. Limitación de responsabilidad */}
                    <section>
                        <h2 className="text-2xl font-bold text-uf-gold mb-4">7. Limitación de Responsabilidad</h2>
                        <div className="bg-gray-900 border border-red-500/30 rounded-lg p-4">
                            <p className="text-gray-300 leading-relaxed">
                                <strong className="text-red-400">Importante:</strong> Los planes de ejercicio y nutrición ofrecidos por Ultimate Fitness
                                son informativos y no sustituyen el consejo de profesionales médicos. Consulta a un profesional de la salud
                                antes de iniciar cualquier programa de ejercicio o dieta.
                            </p>
                        </div>
                    </section>

                    {/* 8. Modificaciones */}
                    <section className="bg-uf-gold/10 border border-uf-gold rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-uf-gold mb-3">8. Modificación de los Términos</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Ultimate Fitness se reserva el derecho de modificar estos términos. Los cambios significativos se
                            notificarán mediante email o aviso en la plataforma. El uso continuado del servicio tras la notificación
                            implica la aceptación de los términos modificados.
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

export default TerminosCondiciones;
