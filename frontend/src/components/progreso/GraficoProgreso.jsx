// ============================================
// Gráfico de línea sencillo (SVG) para la evolución de un ejercicio
// puntos: [{ etiqueta, valor }] en orden cronológico
// ============================================
function GraficoProgreso({ puntos, unidad = 'kg', alto = 140, compacto = false }) {
  const validos = puntos.filter((p) => p.valor != null && p.valor > 0);
  if (validos.length === 0) {
    return compacto ? null : <p className="py-6 text-center text-sm text-uf-muted">Registra peso para ver tu evolución.</p>;
  }

  const ancho = 320;
  const margen = compacto ? 4 : 18;
  const valores = validos.map((p) => p.valor);
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const rango = max - min || 1;
  const x = (i) => (validos.length === 1 ? ancho / 2 : margen + (i * (ancho - margen * 2)) / (validos.length - 1));
  const y = (v) => alto - margen - ((v - min) / rango) * (alto - margen * 2);
  const linea = validos.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.valor).toFixed(1)}`).join(' ');
  const area = `${linea} L${x(validos.length - 1).toFixed(1)},${alto} L${x(0).toFixed(1)},${alto} Z`;

  return (
    <svg
      viewBox={`0 0 ${ancho} ${alto}`}
      className="w-full"
      style={{ height: alto }}
      preserveAspectRatio="none"
      role="img"
      aria-label={`Evolución: de ${valores[0]} a ${valores[valores.length - 1]} ${unidad}`}
    >
      <defs>
        <linearGradient id="uf-progreso-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#CC941A" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#CC941A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#uf-progreso-area)" />
      <path d={linea} fill="none" stroke="#CC941A" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {!compacto &&
        validos.map((p, i) => (
          <g key={`${p.etiqueta}-${i}`}>
            <circle cx={x(i)} cy={y(p.valor)} r="3.5" fill="#0b0b0b" stroke="#CC941A" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <title>{`${p.etiqueta}: ${p.valor} ${unidad}`}</title>
          </g>
        ))}
    </svg>
  );
}

export default GraficoProgreso;
