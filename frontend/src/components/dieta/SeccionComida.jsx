// ============================================
// SECCIÓN COMIDA - Cada momento del día
// Incluye restricción PREMIUM
// ============================================

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import BuscadorAlimentos from "./BuscadorAlimentos";
import SelectorPlatos from "./SelectorPlatos.jsx";
import ConstructorPlatos from "./ConstructorPlatos";

function SeccionComida({
  momento,
  items,
  onAgregarAlimento,
  onAgregarPlato,
  onEliminarItem,
  onActualizarCantidad,
}) {
  const { user } = useAuth();

  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [mostrarSelectorPlatos, setMostrarSelectorPlatos] = useState(false);
  const [mostrarConstructor, setMostrarConstructor] = useState(false);

  // Tailwind no permite strings dinámicas en colores así que usamos clases predefinidas
  const bgColor = {
    desayuno: "from-orange-500/20 to-orange-600/20 border-orange-500/30",
    media_mañana: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30",
    comida: "from-green-500/20 to-green-600/20 border-green-500/30",
    merienda: "from-red-500/20 to-red-600/20 border-red-500/30",
    cena: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
  }[momento.key] || "from-gray-500/20 to-gray-600/20 border-gray-500/30";

  // Totales de la comida
  const totalesComida = items.reduce(
    (acc, item) => {
      if (item.tipo === "plato" || item.tipo === "plato_personalizado") {
        acc.calorias += item.totales?.calorias || 0;
        acc.proteinas += item.totales?.proteinas || 0;
        acc.carbohidratos += item.totales?.carbohidratos || 0;
        acc.grasas += item.totales?.grasas || 0;
      } else if (item.tipo === "alimento") {
        const c = item.cantidad || 0;
        acc.calorias += (item.calorias * c) / 100;
        acc.proteinas += (item.proteinas * c) / 100;
        acc.carbohidratos += (item.carbohidratos * c) / 100;
        acc.grasas += (item.grasas * c) / 100;
      }
      return acc;
    },
    { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
  );

  // ==========================
  // CHECK PREMIUM
  // ==========================
  const requirePremium = (callback) => {
    if (!user?.es_premium) {
      alert("Esta función es exclusiva para usuarios Premium.");
      return;
    }
    callback();
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border-2 border-gray-700">

      {/* HEADER */}
      <div className={`bg-gradient-to-r ${bgColor} border-b-2 p-4`}>
        <div className="flex items-center justify-between mb-3">
          {/* Nombre */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">{momento.icon}</span>
            <div>
              <h3 className="text-xl font-anton font-bold text-white uppercase">
                {momento.nombre}
              </h3>
              <p className="text-gray-400 text-sm">
                {Math.round(totalesComida.calorias)} kcal · {items.length}{" "}
                {items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          {/* Totales */}
          <div className="hidden md:flex gap-4 text-sm">
            <div className="text-center">
              <div className="text-red-400 font-bold">
                {Math.round(totalesComida.proteinas)}g
              </div>
              <div className="text-gray-500">Proteína</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold">
                {Math.round(totalesComida.carbohidratos)}g
              </div>
              <div className="text-gray-500">Carbos</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold">
                {Math.round(totalesComida.grasas)}g
              </div>
              <div className="text-gray-500">Grasas</div>
            </div>
          </div>
        </div>

        {/* BOTONES */}
        <div className="grid grid-cols-2 gap-2">
          {/* PLATO PREDEFINIDO */}
          <button
            onClick={() => requirePremium(() => setMostrarSelectorPlatos(true))}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-lg transition flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Plato Predefinido
          </button>

          {/* CREAR PLATO */}
          <button
            onClick={() => requirePremium(() => setMostrarConstructor(true))}
            className="bg-gradient-to-r from-uf-gold to-yellow-600 hover:from-yellow-600 hover:to-uf-gold text-black font-bold py-2 px-3 rounded-lg transition flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Crear Plato
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="p-4">

        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p>No hay alimentos añadidos</p>
            <p className="text-sm">Usa los botones de arriba para añadir</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-uf-darker p-4 rounded-lg border border-gray-700 hover:border-uf-gold transition"
              >
                {/* PLATOS */}
                {(item.tipo === "plato" || item.tipo === "plato_personalizado") && (
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 bg-uf-gold rounded-full"></div>
                          <h4 className="text-white font-bold">{item.nombre}</h4>

                          {item.esPersonalizado && (
                            <span className="bg-uf-gold text-black text-xs font-bold px-2 py-0.5 rounded">
                              PERSONALIZADO
                            </span>
                          )}
                        </div>

                        {item.descripcion && (
                          <p className="text-gray-400 text-sm ml-5">{item.descripcion}</p>
                        )}
                      </div>

                      <button
                        onClick={() => onEliminarItem(item.id)}
                        className="text-red-400 hover:text-red-300 transition ml-4"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* INGREDIENTES */}
                    {item.ingredientes && (
                      <div className="ml-5 space-y-1 mb-3">
                        {item.ingredientes.map((ing, idx) => (
                          <div key={idx} className="text-gray-400 text-sm flex items-center gap-2">
                            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                            {ing.nombre} ({ing.cantidad}g)
                          </div>
                        ))}
                      </div>
                    )}

                    {/* TOTALES */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                      <span className="text-gray-400 text-sm font-bold">TOTALES:</span>
                      <div className="flex gap-4 text-sm">
                        <div className="text-center text-white font-bold">{Math.round(item.totales?.calorias || 0)} kcal</div>
                        <div className="text-center text-red-400 font-bold">{Math.round(item.totales?.proteinas || 0)}g P</div>
                        <div className="text-center text-blue-400 font-bold">{Math.round(item.totales?.carbohidratos || 0)}g C</div>
                        <div className="text-center text-yellow-400 font-bold">{Math.round(item.totales?.grasas || 0)}g G</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ALIMENTOS */}
                {item.tipo === "alimento" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-2 h-2 bg-uf-gold rounded-full"></div>
                      <span className="text-white font-bold">{item.nombre}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={item.cantidad}
                        onChange={(e) =>
                          onActualizarCantidad(item.id, parseFloat(e.target.value) || 0)
                        }
                        className="w-20 bg-gray-700 text-white px-2 py-1 rounded text-center"
                      />
                      <span className="text-gray-400 text-sm">g</span>

                      <div className="text-white font-bold min-w-[70px] text-right">
                        {Math.round((item.calorias * item.cantidad) / 100)} kcal
                      </div>

                      <button
                        onClick={() => onEliminarItem(item.id)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODALES */}
      {mostrarSelectorPlatos && (
        <SelectorPlatos
          tipoComida={momento.key}
          onSeleccionar={(plato) => {
            onAgregarPlato(plato);
            setMostrarSelectorPlatos(false);
          }}
          onCerrar={() => setMostrarSelectorPlatos(false)}
        />
      )}

      {mostrarConstructor && (
        <ConstructorPlatos
          onGuardarPlato={(plato) => {
            onAgregarPlato(plato);
            setMostrarConstructor(false);
          }}
          onCerrar={() => setMostrarConstructor(false)}
        />
      )}
    </div>
  );
}

export default SeccionComida;
