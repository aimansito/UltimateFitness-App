import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function RecuperarPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await axios.post("http://localhost:8000/api/forgot-password", { email });
            setMessage(response.data.message || "Si el email existe, recibirás instrucciones.");

            // SIMULACIÓN: En un caso real, el usuario va a su email.
            // Aquí, redirigimos directamente tras unos segundos si hay un token de debug (solo desarrollo)
            if (response.data.debug_token) {
                setTimeout(() => {
                    navigate(`/restablecer-password?token=${response.data.debug_token}`);
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.error || "Error al solicitar recuperación.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-uf-darker to-black px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-uf-gold py-6 text-center rounded-t-lg">
                    <h1 className="text-3xl font-bold text-black uppercase tracking-wider">
                        Recuperar Contraseña
                    </h1>
                </div>

                <div className="bg-white p-8 rounded-b-lg shadow-2xl">
                    {message && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-sm">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
                                className="w-full px-4 py-3 border-b-2 border-uf-gold focus:outline-none focus:border-uf-blue transition bg-white text-gray-800"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-uf-gold text-black font-bold py-3 rounded uppercase tracking-wider 
             hover:bg-uf-blue hover:text-white transition-all duration-300 transform hover:scale-105 
             shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                        >
                            {loading ? "Enviando..." : "Enviar Email de Recuperación"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="text-uf-blue hover:text-uf-gold transition text-sm font-semibold"
                        >
                            Volver al Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecuperarPassword;
