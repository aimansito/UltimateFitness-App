import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import CalculadoraNutricional from '../../components/dieta/CalculadoraNutricional';
import SeccionComida from '../../components/dieta/SeccionComida';

function CrearDieta() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [guardando, setGuardando] = useState(false);
  const [nombreDieta, setNombreDieta] = useState('');
  const [descripcionDieta, setDescripcionDieta] = useState('');

  const [necesidades, setNecesidades] = useState(null);

  const [planComidas, setPlanComidas] = useState({
    desayuno: [],
    media_mañana: [],
    comida: [],
    merienda: [],
    cena: []
  });

  const momentos = [
    { key: 'desayuno', nombre: 'Desayuno', icon: '🌅' },
    { key: 'media_mañana', nombre: 'Media Mañana', icon: '☕' },
    { key: 'comida', nombre: 'Comida', icon: '🍽️' },
    { key: 'merienda', nombre: 'Merienda', icon: '🍎' },
    { key: 'cena', nombre: 'Cena', icon: '🌙' }
  ];

  // ===============================
  // RESTRICCIÓN PREMIUM
  // ===============================
  useEffect(() => {
    if (!user) {
      alert("Debes iniciar sesión para crear dietas.");
      navigate("/login");
      return;
    }

    if (!user.es_premium) {
      alert("Esta función es exclusiva para usuarios Premium.");
      navigate("/planes");
    }
  }, [user, navigate]);

  if (!user || !user.es_premium) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-uf-gold mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // ===============================
  // CALCULOS
  // ===============================
  const calcularTotalesDieta = () => {
    let totales = { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };

    Object.values(planComidas).flat().forEach(item => {
      if (item.tipo === 'plato' || item.tipo === 'plato_personalizado') {
        totales.calorias += item.totales?.calorias || 0;
        totales.proteinas += item.totales?.proteinas || 0;
        totales.carbohidratos += item.totales?.carbohidratos || 0;
        totales.grasas += item.totales?.grasas || 0;
      } else if (item.tipo === 'alimento') {
        const c = item.cantidad || 0;
        totales.calorias += (item.calorias * c) / 100;
        totales.proteinas += (item.proteinas * c) / 100;
        totales.carbohidratos += (item.carbohidratos * c) / 100;
        totales.grasas += (item.grasas * c) / 100;
      }
    });

    return totales;
  };

  const totalesActuales = calcularTotalesDieta();

  // ===============================
  // MANEJO DE ITEMS
  // ===============================
  const agregarAlimento = (momento, alimento, cantidad) => {
    const item = {
      ...alimento,
      id: Date.now(),
      tipo: "alimento",
      cantidad: parseFloat(cantidad)
    };
    setPlanComidas(prev => ({
      ...prev,
      [momento]: [...prev[momento], item]
    }));
  };

  const agregarPlato = (momento, plato) => {
    const item = {
      ...plato,
      id: Date.now(),
      tipo: plato.esPersonalizado ? "plato_personalizado" : "plato"
    };
    setPlanComidas(prev => ({
      ...prev,
      [momento]: [...prev[momento], item]
    }));
  };

  const eliminarItem = (momento, id) => {
    setPlanComidas(prev => ({
      ...prev,
      [momento]: prev[momento].filter(i => i.id !== id)
    }));
  };

  const actualizarCantidad = (momento, id, cantidad) => {
    setPlanComidas(prev => ({
      ...prev,
      [momento]: prev[momento].map(i =>
        i.id === id ? { ...i, cantidad } : i
      )
    }));
  };

  // ===============================
  // GUARDAR DIETA
  // ===============================
  const handleGuardarDieta = async () => {
    if (!nombreDieta.trim()) {
      alert("Pon un nombre a la dieta");
      return;
    }

    if (Object.values(planComidas).flat().length === 0) {
      alert("La dieta está vacía.");
      return;
    }

    try {
      setGuardando(true);

      const data = {
        nombre: nombreDieta,
        descripcion: descripcionDieta,
        plan: planComidas,
        totales: totalesActuales,
        objetivo: necesidades?.objetivo || "personalizado",
      };

      console.log("Dieta guardada:", data);

      await new Promise(r => setTimeout(r, 1000));

      alert("¡Dieta guardada!");
      navigate("/alimentacion");

    } catch (e) {
      console.error(e);
      alert("Error al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-uf-darker to-black py-12">
      <div className="container mx-auto px-4">

        {/* BADGE PREMIUM */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-uf-gold text-black px-6 py-2 rounded-full font-bold text-sm">
            ⭐ FUNCIÓN PREMIUM
          </div>
        </div>

        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-anton font-bold text-white mb-4 uppercase">
            <span className="text-uf-gold">Planificador</span> de Dietas
          </h1>
          <p className="text-gray-400 text-lg">
            Calcula tus macros y diseña tu plan de alimentación perfecto
          </p>
        </div>

        {/* CALCULADORA */}
        <CalculadoraNutricional onCalcular={setNecesidades} />

        {/* COMPARADOR OBJETIVOS */}
        {necesidades && (
          <div className="bg-gray-900 rounded-xl p-6 border-2 border-gray-700 mb-8 sticky top-4 z-30 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 uppercase">
              Tu Progreso Diario
            </h3>

            <div className="text-sm text-gray-400 mb-2">
              {Math.round(totalesActuales.calorias)} / {necesidades.caloriasObjetivo} kcal
            </div>

            {/* Barra calorías */}
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-uf-gold transition-all"
                style={{
                  width: `${Math.min((totalesActuales.calorias / necesidades.caloriasObjetivo) * 100, 100)}%`
                }}
              ></div>
            </div>

          </div>
        )}

        {/* DATOS DE LA DIETA */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-300 text-sm mb-2 font-bold block">Nombre</label>
              <input
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600"
                value={nombreDieta}
                onChange={e => setNombreDieta(e.target.value)}
                placeholder="Ej: Definición 2024"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 font-bold block">Descripción</label>
              <input
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600"
                value={descripcionDieta}
                onChange={e => setDescripcionDieta(e.target.value)}
                placeholder="Opcional"
              />
            </div>
          </div>
        </div>

        {/* SECCIONES DE COMIDA */}
        <div className="space-y-8">
          {momentos.map(m => (
            <SeccionComida
              key={m.key}
              momento={m}
              items={planComidas[m.key]}
              onAgregarAlimento={(alimento, cantidad) => agregarAlimento(m.key, alimento, cantidad)}
              onAgregarPlato={plato => agregarPlato(m.key, plato)}
              onEliminarItem={id => eliminarItem(m.key, id)}
              onActualizarCantidad={(id, cantidad) => actualizarCantidad(m.key, id, cantidad)}
            />
          ))}
        </div>

        {/* GUARDAR */}
        <div className="mt-12 flex justify-end">
          <button
            onClick={handleGuardarDieta}
            disabled={guardando}
            className="bg-uf-gold text-black font-bold py-4 px-12 rounded-lg hover:scale-105 transition shadow-lg disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "GUARDAR DIETA COMPLETA"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default CrearDieta;
