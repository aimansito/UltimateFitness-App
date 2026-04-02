// ============================================
// COOKIE BANNER - Banner de consentimiento de cookies (RGPD)
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';

function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Verificar si ya se ha aceptado/rechazado
        const cookieConsent = localStorage.getItem('cookie_consent');
        if (!cookieConsent) {
            // Mostrar después de un breve delay para no bloquear el render inicial
            const timer = setTimeout(() => setVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        localStorage.setItem('cookie_consent_date', new Date().toISOString());
        setVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem('cookie_consent', 'rejected');
        localStorage.setItem('cookie_consent_date', new Date().toISOString());
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-slideUp">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-900 to-gray-800 border-2 border-uf-gold/40 rounded-2xl p-6 shadow-2xl shadow-black/50 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">

                    {/* Icono y texto */}
                    <div className="flex items-start gap-3 flex-1">
                        <Cookie className="w-8 h-8 text-uf-gold flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-white font-bold text-lg mb-1">🍪 Usamos Cookies</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Utilizamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y
                                personalizar contenido. Puedes aceptar todas, rechazarlas o{' '}
                                <Link to="/politica-cookies" className="text-uf-gold hover:underline font-semibold">
                                    consultar nuestra política de cookies
                                </Link>.
                            </p>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 flex-shrink-0 w-full md:w-auto">
                        <button
                            onClick={handleReject}
                            className="flex-1 md:flex-none px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg text-sm uppercase tracking-wider transition-all duration-300"
                        >
                            Rechazar
                        </button>
                        <button
                            onClick={handleAccept}
                            className="flex-1 md:flex-none px-6 py-2.5 bg-uf-gold hover:bg-yellow-500 text-black font-bold rounded-lg text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
                        >
                            Aceptar Todo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CookieBanner;
