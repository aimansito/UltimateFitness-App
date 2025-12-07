import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import CalculadoraNutricional from '../../components/dieta/CalculadoraNutricional';
import SeccionComida from '../../components/dieta/SeccionComida';

function CrearDieta() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

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
      toast.warning("⚠️ Debes iniciar sesión para crear dietas");
      navigate("/login");
      return;
    }

    if (!user.es_premium) {
      toast.warning("⚠️ Esta función es exclusiva para usuarios Premium");
      navigate("/upgrade-premium");
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
    // Verificar si el plato ya existe en este momento
    const platoYaExiste = planComidas[momento].some(
      item => item.id === plato.id && (item.tipo === 'plato' || item.tipo === 'plato_personalizado')
    );

    if (platoYaExiste) {
      toast.warning(`⚠️ El plato "${plato.nombre}" ya está añadido`);
      return;
    }

    const item = {
      ...plato,
      id: plato.id || Date.now(), // Usar el ID del plato si existe
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
      toast.warning("⚠️ Pon un nombre a la dieta");
      return;
    }

    if (Object.values(planComidas).flat().length === 0) {
      toast.warning("⚠️ La dieta está vacía");
      return;
    }

    try {
      setGuardando(true);

      // Preparar el plan en el formato que espera el backend
      const planBackend = {};

      // Mapear nombres de momentos del frontend al backend
      const mapeoMomentos = {
        'media_mañana': 'media_manana'
      };

      Object.entries(planComidas).forEach(([momento, items]) => {
        const momentoBackend = mapeoMomentos[momento] || momento;

        // Filtrar solo platos (no alimentos sueltos) y convertir al formato backend
        planBackend[momentoBackend] = items
          .filter(item => item.tipo === 'plato' || item.tipo === 'plato_personalizado')
          .map(item => ({
            tipo: 'plato',
            id: item.id || item.plato_id,
            dia_semana: 'lunes', // Por ahora solo un día
            notas: item.nombre || null
          }));
      });

      const dietaData = {
        nombre: nombreDieta,
        descripcion: descripcionDieta,
        es_publica: false,
        asignado_a_usuario_id: user.id,
        calorias_totales: Math.round(totalesActuales.calorias),
        proteinas_totales: Math.round(totalesActuales.proteinas),
        carbohidratos_totales: Math.round(totalesActuales.carbohidratos),
        grasas_totales: Math.round(totalesActuales.grasas),
        plan: planBackend
      };

      console.log("Enviando dieta al backend:", dietaData);

      // Enviar al backend
      const response = await api.post(
        '/custom/dietas',
        dietaData
      );

      if (response.data.success) {
        alert(`✅ ¡Dieta guardada exitosamente!\n\nID: ${response.data.dieta.id}\nNombre: ${response.data.dieta.nombre}`);
        navigate("/mis-dietas");
      } else {
        toast.error("❌ No se pudo guardar la dieta");
      }

    } catch (e) {
      console.error("Error al guardar dieta:", e);
      toast.error("❌ Error al guardar la dieta");
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
