// ============================================
// CREAR MI DIETA - Página principal
// ============================================
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CalculadoraNutricional from '../../components/dieta/CalculadoraNutricional';
import SeccionComida from '../../components/dieta/SeccionComida';
import PanelTotales from '../../components/dieta/PanelTotales';

function CrearDieta() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Estado: Objetivos nutricionales del usuario
  const [objetivosNutricionales, setObjetivosNutricionales] = useState(null);
  
  // Estado: Comidas del día organizadas por momento
  const [comidas, setComidas] = useState({
    desayuno: [],
    media_mañana: [],
    comida: [],
    merienda: [],
    cena: []
  });

  // Estado: Totales actuales calculados
  const [totalesActuales, setTotalesActuales] = useState({
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0
  });

  // Estado: Nombre y descripción de la dieta
  const [nombreDieta, setNombreDieta] = useState('');
  const [descripcionDieta, setDescripcionDieta] = useState('');
  
  // Estado: Guardando
  const [guardando, setGuardando] = useState(false);

  // Definición de momentos del día
  const momentosDelDia = [
    { key: 'desayuno', nombre: 'DESAYUNO', icon: '🌅' },
    { key: 'media_mañana', nombre: 'MEDIA MAÑANA', icon: '☕' },
    { key: 'comida', nombre: 'COMIDA', icon: '🍽️' },
    { key: 'merienda', nombre: 'MERIENDA', icon: '🍎' },
    { key: 'cena', nombre: 'CENA', icon: '🌙' }
  ];

  // ============================================
  // EFECTO: Recalcular totales cuando cambian las comidas
  // ============================================
  useEffect(() => {
    calcularTotales();
  }, [comidas]);

  // ============================================
  // FUNCIÓN: Calcular totales nutricionales
  // ============================================
  const calcularTotales = () => {
    let totales = {
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0
    };

    // Iterar por cada momento del día
    Object.values(comidas).forEach(momentoComidas => {
      momentoComidas.forEach(item => {
        // Si es un plato, usar sus totales
        if (item.tipo === 'plato') {
          totales.calorias += item.totales?.calorias || 0;
          totales.proteinas += item.totales?.proteinas || 0;
          totales.carbohidratos += item.totales?.carbohidratos || 0;
          totales.grasas += item.totales?.grasas || 0;
        } 
        // Si es un alimento individual, calcular
        else if (item.tipo === 'alimento') {
          const cantidad = item.cantidad || 0;
          totales.calorias += (item.calorias * cantidad) / 100;
          totales.proteinas += (item.proteinas * cantidad) / 100;
          totales.carbohidratos += (item.carbohidratos * cantidad) / 100;
          totales.grasas += (item.grasas * cantidad) / 100;
        }
      });
    });

    setTotalesActuales(totales);
  };

  // ============================================
  // FUNCIÓN: Añadir alimento a una comida
  // ============================================
  const agregarAlimento = (momento, alimento, cantidad = 100) => {
    const nuevoItem = {
      id: Date.now(), // ID único temporal
      tipo: 'alimento',
      alimentoId: alimento.id,
      nombre: alimento.nombre,
      cantidad: cantidad,
      calorias: alimento.calorias,
      proteinas: alimento.proteinas,
      carbohidratos: alimento.carbohidratos,
      grasas: alimento.grasas
    };

    setComidas(prev => ({
      ...prev,
      [momento]: [...prev[momento], nuevoItem]
    }));
  };

  // ============================================
  // FUNCIÓN: Añadir plato predefinido a una comida
  // ============================================
  const agregarPlato = (momento, plato) => {
    const nuevoItem = {
      id: Date.now(),
      tipo: 'plato',
      platoId: plato.id,
      nombre: plato.nombre,
      descripcion: plato.descripcion,
      totales: plato.totales || {
        calorias: plato.calorias_totales,
        proteinas: plato.proteinas_totales,
        carbohidratos: plato.carbohidratos_totales,
        grasas: plato.grasas_totales
      },
      ingredientes: plato.ingredientes
    };

    setComidas(prev => ({
      ...prev,
      [momento]: [...prev[momento], nuevoItem]
    }));
  };

  // ============================================
  // FUNCIÓN: Eliminar item de una comida
  // ============================================
  const eliminarItem = (momento, itemId) => {
    setComidas(prev => ({
      ...prev,
      [momento]: prev[momento].filter(item => item.id !== itemId)
    }));
  };

  // ============================================
  // FUNCIÓN: Actualizar cantidad de alimento
  // ============================================
  const actualizarCantidad = (momento, itemId, nuevaCantidad) => {
    setComidas(prev => ({
      ...prev,
      [momento]: prev[momento].map(item =>
        item.id === itemId
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    }));
  };

  // ============================================
  // FUNCIÓN: Guardar dieta en el backend
  // ============================================
  const guardarDieta = async () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para guardar tu dieta');
      navigate('/login');
      return;
    }

    if (!nombreDieta.trim()) {
      alert('Por favor, añade un nombre a tu dieta');
      return;
    }

    // Verificar que hay al menos una comida
    const hayComidas = Object.values(comidas).some(momento => momento.length > 0);
    if (!hayComidas) {
      alert('Añade al menos un alimento o plato a tu dieta');
      return;
    }

    setGuardando(true);

    try {
      // Preparar datos para enviar al backend
      const dietaData = {
        nombre: nombreDieta,
        descripcion: descripcionDieta || 'Mi dieta personalizada',
        calorias_totales: Math.round(totalesActuales.calorias),
        es_publica: false, // Dieta privada por defecto
        comidas: comidas
      };

      const response = await fetch('http://localhost:8000/api/custom/dietas/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Añadir token de autenticación
        },
        body: JSON.stringify(dietaData)
      });

      const data = await response.json();

      if (data.success) {
        alert('¡Dieta guardada exitosamente!');
        navigate(`/dieta/${data.dieta.id}`);
      } else {
        alert('Error al guardar la dieta: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la dieta');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-uf-darker to-black py-12">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="mb-8">
          <Link
            to="/alimentacion"
            className="inline-flex items-center text-uf-gold hover:text-uf-blue transition mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a Alimentación
          </Link>

          <h1 className="text-4xl md:text-5xl font-anton font-bold text-white mb-3 uppercase">
            Crear Mi Dieta Personalizada
          </h1>
          <p className="text-gray-400 text-lg">
            Diseña tu plan nutricional perfecto adaptado a tus objetivos
          </p>
        </div>

        {/* CALCULADORA NUTRICIONAL */}
        <CalculadoraNutricional
          onCalcular={setObjetivosNutricionales}
        />

        {/* PANEL DE TOTALES (sticky) */}
        {objetivosNutricionales && (
          <PanelTotales
            objetivos={objetivosNutricionales}
            actuales={totalesActuales}
          />
        )}

        {/* INFORMACIÓN DE DIETA */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-anton font-bold text-white mb-4 uppercase">
            Detalles de tu Dieta
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Nombre de la Dieta *</label>
              <input
                type="text"
                value={nombreDieta}
                onChange={(e) => setNombreDieta(e.target.value)}
                placeholder="Ej: Mi Plan de Definición"
                className="w-full bg-uf-darker text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-uf-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Descripción (opcional)</label>
              <input
                type="text"
                value={descripcionDieta}
                onChange={(e) => setDescripcionDieta(e.target.value)}
                placeholder="Ej: Dieta para perder grasa manteniendo músculo"
                className="w-full bg-uf-darker text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-uf-gold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECCIONES DE COMIDAS */}
        <div className="space-y-6">
          {momentosDelDia.map(momento => (
            <SeccionComida
              key={momento.key}
              momento={momento}
              items={comidas[momento.key]}
              onAgregarAlimento={(alimento, cantidad) => agregarAlimento(momento.key, alimento, cantidad)}
              onAgregarPlato={(plato) => agregarPlato(momento.key, plato)}
              onEliminarItem={(itemId) => eliminarItem(momento.key, itemId)}
              onActualizarCantidad={(itemId, cantidad) => actualizarCantidad(momento.key, itemId, cantidad)}
            />
          ))}
        </div>

        {/* BOTÓN GUARDAR */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={guardarDieta}
            disabled={guardando}
            className="bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold px-12 py-4 rounded-lg hover:from-yellow-600 hover:to-uf-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 text-lg"
          >
            {guardando ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black"></div>
                Guardando...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Guardar Mi Dieta
              </>
            )}
          </button>
        </div>

        {/* MENSAJE SI NO ESTÁ AUTENTICADO */}
        {!isAuthenticated && (
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              <Link to="/login" className="text-uf-gold hover:underline">
                Inicia sesión
              </Link>
              {' '}para guardar tu dieta personalizada
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default CrearDieta;