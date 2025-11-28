import { Pill, Heart, Zap, Shield } from 'lucide-react';

function Suplementos() {
    const suplementos = [
        {
            nombre: 'Proteína Whey',
            descripcion: 'Proteína de suero de leche de rápida absorción',
            beneficios: ['Recuperación muscular', 'Crecimiento muscular', 'Alto valor biológico'],
            icon: Zap
        },
        {
            nombre: 'Creatina',
            descripcion: 'Mejora la fuerza y el rendimiento',
            beneficios: ['Aumenta fuerza', 'Mejora rendimiento', 'Ganancia muscular'],
            icon: Shield
        },
        {
            nombre: 'BCAA',
            descripcion: 'Aminoácidos de cadena ramificada',
            beneficios: ['Reduce fatiga', 'Protege músculo', 'Recuperación'],
            icon: Heart
        },
        {
            nombre: 'Vitaminas',
            descripcion: 'Complejo multivitamínico completo',
            beneficios: ['Salud general', 'Sistema inmune', 'Energía'],
            icon: Pill
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-uf-darker to-black py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-anton font-bold text-white mb-4 uppercase tracking-wider">
                        <span className="text-uf-gold">Suplementos</span> Deportivos
                    </h1>
                    <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                        Guía básica de suplementación para mejorar tu rendimiento
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {suplementos.map((suplemento, index) => {
                        const Icon = suplemento.icon;
                        return (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-xl p-6 hover:border-uf-gold transition-all duration-300 hover:scale-105"
                            >
                                <div className="flex items-center justify-center mb-4">
                                    <div className="p-4 bg-uf-gold/20 rounded-full">
                                        <Icon className="w-12 h-12 text-uf-gold" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white text-center mb-3">
                                    {suplemento.nombre}
                                </h3>
                                <p className="text-gray-400 text-center mb-4">
                                    {suplemento.descripcion}
                                </p>
                                <ul className="space-y-2">
                                    {suplemento.beneficios.map((beneficio, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-gray-300">
                                            <span className="w-2 h-2 bg-uf-gold rounded-full"></span>
                                            {beneficio}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 max-w-4xl mx-auto">
                    <div className="bg-gradient-to-r from-uf-gold/10 to-yellow-600/10 border-2 border-uf-gold rounded-xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            ⚠️ Importante
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                            Los suplementos son complementos a una dieta equilibrada, no sustitutos.
                            Consulta con un profesional de la salud antes de comenzar cualquier suplementación.
                            Los resultados pueden variar según la persona, el entrenamiento y la alimentación.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Suplementos;
