// ============================================
// AVISO LEGAL - Página de aviso legal (LSSI)
// ============================================
import { Link } from 'react-router-dom';
import { Scale, FileText } from 'lucide-react';
import SEO from '../../components/common/SEO';

function AvisoLegal() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-uf-darker to-black py-12 px-4">
            <SEO
                title="Aviso Legal"
                description="Aviso legal de Ultimate Fitness conforme a la LSSI. Información sobre el titular, condiciones de uso y propiedad intelectual."
                keywords="aviso legal, LSSI, condiciones uso, propiedad intelectual"
            />
            <div className="container mx-auto max-w-5xl">

                {/* Header */}
                <div className="bg-uf-gold rounded-t-lg py-8 px-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Scale className="w-10 h-10 text-black" />
                        <h1 className="text-4xl font-bold text-black uppercase tracking-wider">
                            Aviso Legal
                        </h1>
                    </div>
                    <p className="text-black/70 mt-2">Ultimate Fitness - Conforme a la LSSI-CE</p>
                </div>

                {/* Contenido */}
                <div className="bg-gray-800 rounded-b-lg shadow-2xl p-8 text-white space-y-8">

                    {/* 1. Identificación del titular */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-6 h-6 text-uf-gold" />
                            <h2 className="text-2xl font-bold text-uf-gold">1. Identificación del Titular</h2>
                        </div>
                        <div className="bg-gray-900 border border-uf-gold/30 rounded-lg p-4 space-y-2">
                            <p className="text-gray-300"><strong className="text-uf-gold">Titular:</strong> Ultimate Fitness</p>
                            <p className="text-gray-300"><strong className="text-uf-gold">Email:</strong> <a href="mailto:utfitness2025@gmail.com" className="text-uf-blue hover:underline">utfitness2025@gmail.com</a></p>
                            <p className="text-gray-300"><strong className="text-uf-gold">Teléfono:</strong> +34 633 71 43 72</p>
                            <p className="text-gray-300"><strong className="text-uf-gold">Domicilio:</strong> Granada, España</p>
                            <p className="text-gray-300"><strong className="text-uf-gold">Sitio Web:</strong> ultimatefitness.es</p>
                        </div>
                    </section>

                    {/* 2. Objeto */}
                    <section>
                        <h2 className="text-2xl font-bold text-uf-gold mb-4">2. Objeto</h2>
                        <p className="text-gray-300 leading-relaxed">
                            El presente Aviso Legal regula el uso del sitio web <strong>ultimatefitness.es</strong> (en adelante, "la Web"),
                            propiedad de Ultimate Fitness. El acceso y uso de la Web atribuye la condición de usuario e implica
                            la aceptación plena y sin reservas de todas y cada una de las disposiciones incluidas en este Aviso Legal.
                        </p>
                    </section>

                    {/* 3. Propiedad Intelectual */}
                    <section>
                        <h2 className="text-2xl font-bold text-uf-gold mb-4">3. Propiedad Intelectual e Industrial</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Todos los contenidos de la Web, incluyendo sin limitación textos, imágenes, gráficos, logotipos,
                            iconos, marca, nombre comercial, software y demás contenidos, son propiedad de Ultimate Fitness
                            o de terceros que han autorizado su uso, y están protegidos por las leyes de propiedad intelectual e industrial.
                        </p>
                        <div className="bg-gray-900 border-l-4 border-uf-gold p-4">
                            <p className="text-gray-300">
                                Queda prohibida la reproducción, distribución, transformación, comunicación pública o cualquier
                                otra forma de explotación sin la autorización expresa y por escrito de Ultimate Fitness.
                            </p>
                        </div>
                    </section>

                    {/* 4. Condiciones de uso */}
                    <section>
                        <h2 className="text-2xl font-bold text-uf-gold mb-4">4. Condiciones de Uso</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">El usuario se compromete a:</p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li>Utilizar la Web conforme a la ley, la moral y las buenas costumbres.</li>
                            <li>No realizar actividades ilícitas, lesivas de derechos de terceros o que dañen la imagen de Ultimate Fitness.</li>
                            <li>No manipular los contenidos ni los sistemas informáticos de la Web.</li>
                            <li>No introducir virus ni programas maliciosos.</li>
                        </ul>
                    </section>

                    {/* 5. Exclusión de responsabilidad */}
                    <section>
                        <h2 className="text-2xl font-bold text-uf-gold mb-4">5. Exclusión de Responsabilidad</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Ultimate Fitness no garantiza la disponibilidad permanente de la Web ni se hace responsable
                            de los daños derivados de interrupciones, virus u otros elementos perjudiciales.
                            Los contenidos informativos de la Web tienen carácter general y no constituyen asesoramiento profesional.
                        </p>
                    </section>

                    {/* 6. Legislación aplicable */}
                    <section className="bg-uf-gold/10 border border-uf-gold rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-uf-gold mb-3">6. Legislación Aplicable y Jurisdicción</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Las relaciones entre Ultimate Fitness y el usuario se regirán por la legislación española.
                            Cualquier controversia será resuelta ante los Juzgados y Tribunales de Granada, España.
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

export default AvisoLegal;
