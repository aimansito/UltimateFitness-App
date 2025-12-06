import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Utensils,
  Calendar,
  Clock,
  Flame,
  Apple,
  Beef,
  Cookie,
  Award,
  ChevronRight,
  Info,
} from "lucide-react";

function MiDieta() {
  const { user, isPremium } = useAuth();
  const [dieta, setDieta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [diaSeleccionado, setDiaSeleccionado] = useState("lunes");

  const diasSemana = [
    { id: "lunes", nombre: "Lunes" },
    { id: "martes", nombre: "Martes" },
    { id: "miercoles", nombre: "Miércoles" },
    { id: "jueves", nombre: "Jueves" },
    { id: "viernes", nombre: "Viernes" },
    { id: "sabado", nombre: "Sábado" },
    { id: "domingo", nombre: "Domingo" },
  ];

  // Cargar dieta del usuario
  useEffect(() => {
    const fetchDieta = async () => {
      try {
        // TODO: Llamar al endpoint del backend
        // const response = await axios.get(`/api/usuarios/${user.id}/dieta`);

        // Simulación de datos
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const dietaMock = {
          id: 1,
          nombre: "Dieta Equilibrada - 2000 kcal",
          objetivo: "Mantener peso",
          calorias_diarias: 2000,
          proteinas: 150,
          carbohidratos: 200,
          grasas: 67,
          fecha_inicio: "2025-11-01",
          comidas_por_dia: {
            lunes: [
              {
                tipo: "Desayuno",
                hora: "08:00",
                platos: [
                  {
                    nombre: "Avena con frutas",
                    calorias: 350,
                    proteinas: 12,
                    carbohidratos: 55,
                    grasas: 8,
                  },
                ],
              },
              {
                tipo: "Media Mañana",
                hora: "11:00",
                platos: [
                  {
                    nombre: "Yogur griego con nueces",
                    calorias: 200,
                    proteinas: 15,
                    carbohidratos: 12,
                    grasas: 10,
                  },
                ],
              },
              {
                tipo: "Comida",
                hora: "14:00",
                platos: [
                  {
                    nombre: "Pechuga de pollo a la plancha",
                    calorias: 300,
                    proteinas: 50,
                    carbohidratos: 0,
                    grasas: 8,
                  },
                  {
                    nombre: "Arroz integral",
                    calorias: 200,
                    proteinas: 5,
                    carbohidratos: 45,
                    grasas: 2,
                  },
                  {
                    nombre: "Ensalada mixta",
                    calorias: 80,
                    proteinas: 3,
                    carbohidratos: 12,
                    grasas: 3,
                  },
                ],
              },
              {
                tipo: "Merienda",
                hora: "17:00",
                platos: [
                  {
                    nombre: "Batido de proteínas",
                    calorias: 180,
                    proteinas: 30,
                    carbohidratos: 10,
                    grasas: 3,
                  },
                ],
              },
              {
                tipo: "Cena",
                hora: "21:00",
                platos: [
                  {
                    nombre: "Salmón al horno",
                    calorias: 350,
                    proteinas: 40,
                    carbohidratos: 0,
                    grasas: 20,
                  },
                  {
                    nombre: "Verduras al vapor",
                    calorias: 100,
                    proteinas: 4,
                    carbohidratos: 18,
                    grasas: 2,
                  },
                ],
              },
            ],
            martes: [
              {
                tipo: "Desayuno",
                hora: "08:00",
                platos: [
                  {
                    nombre: "Tostadas integrales con aguacate",
                    calorias: 380,
                    proteinas: 10,
                    carbohidratos: 45,
                    grasas: 18,
                  },
                ],
              },
              {
                tipo: "Media Mañana",
                hora: "11:00",
                platos: [
                  {
                    nombre: "Fruta y almendras",
                    calorias: 220,
                    proteinas: 8,
                    carbohidratos: 25,
                    grasas: 12,
                  },
                ],
              },
              {
                tipo: "Comida",
                hora: "14:00",
                platos: [
                  {
                    nombre: "Pasta con atún",
                    calorias: 450,
                    proteinas: 35,
                    carbohidratos: 60,
                    grasas: 10,
                  },
                  {
                    nombre: "Ensalada verde",
                    calorias: 60,
                    proteinas: 2,
                    carbohidratos: 8,
                    grasas: 2,
                  },
                ],
              },
              {
                tipo: "Merienda",
                hora: "17:00",
                platos: [
                  {
                    nombre: "Tortitas de arroz con crema de cacahuete",
                    calorias: 200,
                    proteinas: 8,
                    carbohidratos: 20,
                    grasas: 10,
                  },
                ],
              },
              {
                tipo: "Cena",
                hora: "21:00",
                platos: [
                  {
                    nombre: "Pechuga de pavo con quinoa",
                    calorias: 400,
                    proteinas: 45,
                    carbohidratos: 40,
                    grasas: 8,
                  },
                ],
              },
            ],
          },
        };

        setDieta(dietaMock);
      } catch (error) {
        console.error("Error al cargar dieta:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDieta();
    }
  }, [user]);

  const calcularTotalesDia = (comidas) => {
    let totales = { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };

    comidas.forEach((comida) => {
      comida.platos.forEach((plato) => {
        totales.calorias += plato.calorias;
        totales.proteinas += plato.proteinas;
        totales.carbohidratos += plato.carbohidratos;
        totales.grasas += plato.grasas;
      });
    });

    return totales;
  };

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-12 rounded-lg shadow-2xl border border-gray-700">
            <Award className="w-20 h-20 text-uf-gold mx-auto mb-6" />

            <h1 className="text-3xl font-bold text-white mb-4">
              Función Premium
            </h1>

            <p className="text-gray-300 mb-8 text-lg">
              Las dietas personalizadas están disponibles solo para usuarios
              Premium.
            </p>

            <a
              href="/upgrade-premium"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold px-8 py-4 rounded-lg uppercase tracking-wider hover:from-yellow-600 hover:to-uf-gold transition-all duration-300 transform hover:scale-105"
            >
              <Award className="w-5 h-5" />
              Ver Planes Premium
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando tu dieta...</p>
        </div>
      </div>
    );
  }

  if (!dieta) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-12 rounded-lg shadow-2xl border border-gray-700">
            <Utensils className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">
              No tienes una dieta asignada
            </h1>
            <p className="text-gray-400 text-lg">
              Tu nutricionista te asignará una dieta personalizada pronto.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const comidasDia = dieta.comidas_por_dia[diaSeleccionado] || [];
  const totalesDia = calcularTotalesDia(comidasDia);

  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-uf-gold to-yellow-600 py-6 text-center rounded-t-lg shadow-lg">
          <h1 className="text-3xl font-bold text-black uppercase tracking-wider flex items-center justify-center gap-3">
            <Utensils className="w-8 h-8" />
            Mi Dieta
          </h1>
        </div>

        {/* Contenido */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-b-lg shadow-2xl border border-gray-700">
          {/* Información general de la dieta */}
          <div className="bg-gradient-to-br from-uf-gold/10 to-yellow-600/10 border-2 border-uf-gold rounded-lg p-6 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {dieta.nombre}
                </h2>
                <p className="text-gray-300 mb-4">Objetivo: {dieta.objetivo}</p>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Desde:{" "}
                  {new Date(dieta.fecha_inicio).toLocaleDateString("es-ES")}
                </p>
              </div>
              <div className="bg-uf-gold/20 px-6 py-4 rounded-lg text-center border-2 border-uf-gold">
                <p className="text-uf-gold text-sm font-semibold uppercase tracking-wide">
                  Calorías diarias
                </p>
                <p className="text-4xl font-bold text-white mt-1">
                  {dieta.calorias_diarias}
                </p>
                <p className="text-gray-300 text-xs">kcal</p>
              </div>
            </div>

            {/* Macronutrientes */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-center">
                <Beef className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-blue-400 text-xs font-semibold uppercase">
                  Proteínas
                </p>
                <p className="text-2xl font-bold text-white">
                  {dieta.proteinas}g
                </p>
              </div>
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
                <Apple className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-green-400 text-xs font-semibold uppercase">
                  Carbohidratos
                </p>
                <p className="text-2xl font-bold text-white">
                  {dieta.carbohidratos}g
                </p>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-center">
                <Cookie className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-yellow-400 text-xs font-semibold uppercase">
                  Grasas
                </p>
                <p className="text-2xl font-bold text-white">{dieta.grasas}g</p>
              </div>
            </div>
          </div>

          {/* Selector de días */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-uf-gold" />
              <h3 className="text-xl font-bold text-white">
                Selecciona un día
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {diasSemana.map((dia) => (
                <button
                  key={dia.id}
                  onClick={() => setDiaSeleccionado(dia.id)}
                  className={`px-4 py-3 rounded-lg font-bold uppercase text-sm transition-all duration-300 ${diaSeleccionado === dia.id
                      ? "bg-gradient-to-r from-uf-gold to-yellow-600 text-black scale-105 shadow-lg"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                >
                  {dia.nombre}
                </button>
              ))}
            </div>
          </div>

          {/* Resumen del día */}
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-2 border-purple-700 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Resumen del día</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <p className="text-gray-400 text-xs">Calorías</p>
                <p className="text-2xl font-bold text-white">
                  {totalesDia.calorias}
                </p>
              </div>
              <div className="text-center">
                <Beef className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-gray-400 text-xs">Proteínas</p>
                <p className="text-2xl font-bold text-white">
                  {totalesDia.proteinas}g
                </p>
              </div>
              <div className="text-center">
                <Apple className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-gray-400 text-xs">Carbohidratos</p>
                <p className="text-2xl font-bold text-white">
                  {totalesDia.carbohidratos}g
                </p>
              </div>
              <div className="text-center">
                <Cookie className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-gray-400 text-xs">Grasas</p>
                <p className="text-2xl font-bold text-white">
                  {totalesDia.grasas}g
                </p>
              </div>
            </div>
          </div>

          {/* Comidas del día */}
          <div className="space-y-4">
            {comidasDia.map((comida, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-gray-900 to-gray-800 border-2 border-gray-700 rounded-lg p-6 hover:border-uf-gold transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-uf-gold/20 rounded-lg">
                      <Utensils className="w-5 h-5 text-uf-gold" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">
                        {comida.tipo}
                      </h4>
                      <p className="text-gray-400 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {comida.hora}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {comida.platos.map((plato, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="text-white font-semibold mb-2">
                            {plato.nombre}
                          </h5>
                          <div className="flex flex-wrap gap-3 text-xs">
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded border border-orange-500">
                              <Flame className="w-3 h-3 inline mr-1" />
                              {plato.calorias} kcal
                            </span>
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded border border-blue-500">
                              P: {plato.proteinas}g
                            </span>
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded border border-green-500">
                              C: {plato.carbohidratos}g
                            </span>
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500">
                              G: {plato.grasas}g
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiDieta;
