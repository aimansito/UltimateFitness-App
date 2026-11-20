// Un componente por tipo de plano. Cada uno recibe la frase `f` (con ini/fin/habla en segundos) y
// anima con el fotograma relativo al inicio del plano.
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { C, F, entrada, tramo, tamTitular, eyebrow } from './estilo.js';
import { Objeto3D, MonedaLogo } from './tres.jsx';

const sube = (e, d = 70) => ({ opacity: Math.min(1, e * 1.4), transform: `translateY(${(1 - e) * d}px)` });

/** Fotogramas (relativos al plano) en que empieza y acaba la voz de la frase */
function useHabla(f) {
  const { fps } = useVideoConfig();
  return [(f.habla[0] - f.ini) * fps, (f.habla[1] - f.ini) * fps];
}

/** Línea que sube desde detrás de una máscara */
function Mascara({ children, retraso, style }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = entrada(frame, fps, retraso, { damping: 18, mass: 0.8 });
  return (
    <span style={{ display: 'block', overflow: 'hidden', padding: '0.12em 0 0.04em', margin: '-0.12em 0 0' }}>
      <span style={{ display: 'block', transform: `translateY(${(1 - e) * 110}%)`, ...style }}>{children}</span>
    </span>
  );
}

function Eyebrow({ children, retraso = 0, color = '#fff' }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = entrada(frame, fps, retraso);
  return (
    <p style={{ ...eyebrow, color, ...sube(e, 30), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
      <span style={{ width: 60 * e, height: 3, background: C.oro }} />
      {children}
      <span style={{ width: 60 * e, height: 3, background: C.oro }} />
    </p>
  );
}

// ------------------------------------------------------------------ portada
export function Portada({ f }) {
  const tam = tamTitular(f.titulo, 960, 150);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, top: 200, width: 1080, height: 820 }}>
        <Objeto3D tipo={f.objeto} width={1080} height={820} />
      </div>
      <div style={{ position: 'absolute', top: 1000, left: 60, right: 60, textAlign: 'center' }}>
        <Eyebrow retraso={4}>{f.eyebrow}</Eyebrow>
        <h1 style={{ marginTop: 26, fontFamily: F.anton, fontWeight: 400, fontSize: tam, lineHeight: 1, textTransform: 'uppercase', color: '#fff' }}>
          {f.titulo.map((l, i) => (
            <Mascara key={i} retraso={8 + i * 5} style={{ color: i === f.titulo.length - 1 ? C.oro : '#fff' }}>{l}</Mascara>
          ))}
        </h1>
      </div>
    </AbsoluteFill>
  );
}

// ------------------------------------------------------------------ dato grande dentro de un anillo
function Cifra({ valor, p }) {
  // Los números (y los rangos «20-40») cuentan hacia arriba; el resto aparece tal cual
  const m = valor.match(/^(-?\d+)(?:-(\d+))?$/);
  if (!m) return valor;
  const a = Math.round(+m[1] * p);
  return m[2] ? `${a}-${Math.round(+m[2] * p)}` : `${a}`;
}

export function Dato({ f }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = entrada(frame, fps, 2);
  const cuenta = tramo(frame, 4, 26, Easing.out(Easing.cubic));
  const anillo = tramo(frame, 2, 30, Easing.out(Easing.cubic));
  const len = f.valor.length;
  const tam = len <= 2 ? 300 : len <= 4 ? 230 : len <= 6 ? 170 : 130;
  const R = 300;
  return (
    <AbsoluteFill style={{ alignItems: 'center', paddingTop: 330 }}>
      <Eyebrow>{f.etiqueta}</Eyebrow>
      <div style={{ position: 'relative', width: 2 * R + 40, height: 2 * R + 40, marginTop: 34, transform: `scale(${0.85 + 0.15 * e})`, opacity: Math.min(1, e * 1.5) }}>
        <svg width={2 * R + 40} height={2 * R + 40} style={{ position: 'absolute', inset: 0 }}>
          <circle cx={R + 20} cy={R + 20} r={R} fill="rgba(10,10,10,0.55)" stroke="#262626" strokeWidth={10} />
          <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke={C.oro} strokeWidth={10} strokeLinecap="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - anillo} transform={`rotate(-90 ${R + 20} ${R + 20})`} />
          <circle cx={R + 20 + R * Math.cos(anillo * 2 * Math.PI - Math.PI / 2)} cy={R + 20 + R * Math.sin(anillo * 2 * Math.PI - Math.PI / 2)} r={16} fill={C.oroClaro} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: F.anton, fontSize: tam, lineHeight: 1, color: C.oro, textShadow: '0 0 70px rgba(204,148,26,0.4)', whiteSpace: 'nowrap' }}>
            <Cifra valor={f.valor} p={cuenta} />
          </span>
        </div>
      </div>
      {f.unidad && <p style={{ marginTop: 26, fontFamily: F.anton, fontSize: 74, color: '#fff', textTransform: 'uppercase', ...sube(entrada(frame, fps, 10), 40) }}>{f.unidad}</p>}
      {f.nota && <p style={{ marginTop: 12, fontFamily: F.inter, fontWeight: 700, fontSize: 40, color: C.gris, ...sube(entrada(frame, fps, 15), 40) }}>{f.nota}</p>}
    </AbsoluteFill>
  );
}

// ------------------------------------------------------------------ lista que aparece al ritmo de la voz
export function Lista({ f }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [h0, h1] = useHabla(f);
  const n = f.items.length;
  const aparece = f.items.map((_, i) => Math.max(4 + i * 6, h0 + ((h1 - h0) * 0.85 * i) / n));
  const actual = aparece.filter((a) => frame >= a).length - 1;
  return (
    <AbsoluteFill style={{ paddingTop: 380 }}>
      <Eyebrow>{f.etiqueta}</Eyebrow>
      <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', gap: 36, padding: '0 64px' }}>
        {f.items.map((it, i) => {
          const e = entrada(frame, fps, aparece[i], { damping: 16, mass: 0.7 });
          const activo = i === actual;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 36, padding: '38px 40px', borderRadius: 34,
              background: C.tarjeta, border: `3px solid ${activo ? C.oro : C.borde}`,
              boxShadow: activo ? '0 0 60px rgba(204,148,26,0.28)' : 'none',
              opacity: Math.min(1, e * 1.5), transform: `translateX(${(1 - e) * 260}px)`,
            }}>
              <span style={{
                flexShrink: 0, width: 116, height: 116, borderRadius: 999, border: `4px solid ${C.oro}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: F.anton, fontSize: 52, color: activo ? '#0a0a0a' : C.oro, background: activo ? C.oro : 'transparent',
              }}>{String(i + 1).padStart(2, '0')}</span>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: F.anton, fontSize: 84, lineHeight: 1.02, color: '#fff', textTransform: 'uppercase' }}>{it.titulo}</p>
                {it.nota && <p style={{ marginTop: 10, fontFamily: F.inter, fontWeight: 700, fontSize: 38, color: '#b9b9b9' }}>{it.nota}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// ------------------------------------------------------------------ punto clave
export function Punto({ f }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const color = f.negativo ? C.rojo : C.oro;
  const e0 = entrada(frame, fps, 0, { damping: 10, mass: 0.6 });
  const tam = tamTitular([f.titulo], 960, 150);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 560, textAlign: 'center' }}>
      <span style={{
        position: 'absolute', top: 260, left: 0, right: 0, fontFamily: F.anton, fontSize: 560, lineHeight: 1,
        color: 'transparent', WebkitTextStroke: `3px ${f.negativo ? 'rgba(255,77,77,0.16)' : 'rgba(204,148,26,0.16)'}`,
        transform: `translateX(${interpolate(frame, [0, 200], [40, -40])}px)`, whiteSpace: 'nowrap', textTransform: 'uppercase',
      }}>{f.numero}</span>
      <span style={{
        padding: '14px 40px', borderRadius: 24, border: `4px solid ${color}`, background: f.negativo ? 'rgba(255,77,77,0.12)' : 'rgba(204,148,26,0.14)',
        fontFamily: F.anton, fontSize: 76, lineHeight: 1.05, color, textTransform: 'uppercase', transform: `scale(${e0})`,
      }}>{f.numero}</span>
      <h2 style={{ marginTop: 40, padding: '0 60px', fontFamily: F.anton, fontWeight: 400, fontSize: tam, lineHeight: 1, color: '#fff', textTransform: 'uppercase' }}>
        <Mascara retraso={5}>{f.titulo}</Mascara>
      </h2>
      <p style={{ marginTop: 28, padding: '0 80px', fontFamily: F.inter, fontWeight: 700, fontSize: 44, color: C.gris, ...sube(entrada(frame, fps, 11), 40) }}>{f.nota}</p>
    </AbsoluteFill>
  );
}

// ------------------------------------------------------------------ mito frente a realidad
const IconoX = ({ color }) => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
);
const IconoCheck = ({ color }) => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);

export function Mito({ f }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [h0, h1] = useHabla(f);
  const tachar = h0 + (h1 - h0) * 0.28;
  const verdad = h0 + (h1 - h0) * 0.42;
  const e1 = entrada(frame, fps, 0);
  const raya = tramo(frame, tachar, tachar + 8);
  const e2 = entrada(frame, fps, verdad, { damping: 13, mass: 0.7 });
  const etiqueta = (texto, color, Icono) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 26px 10px 18px', borderRadius: 999, background: color, fontFamily: F.audiowide, fontSize: 30, letterSpacing: '0.2em', color: '#0a0a0a' }}>
      <Icono color="#0a0a0a" />{texto}
    </span>
  );
  return (
    <AbsoluteFill style={{ padding: '360px 70px 0' }}>
      <div style={{ ...sube(e1), opacity: Math.min(1, e1 * 1.4) * (1 - raya * 0.5), padding: '40px 44px 48px', borderRadius: 34, background: C.tarjeta, border: `3px solid ${raya > 0 ? 'rgba(255,77,77,0.6)' : C.borde}` }}>
        {etiqueta('MITO', C.rojo, IconoX)}
        <p style={{ position: 'relative', marginTop: 28, fontFamily: F.inter, fontWeight: 800, fontSize: 58, lineHeight: 1.18, color: '#fff' }}>
          «{f.mito}»
          <span style={{ position: 'absolute', left: -10, top: '50%', height: 9, width: `${raya * 104}%`, background: C.rojo, borderRadius: 9, transform: 'rotate(-4deg)' }} />
        </p>
      </div>
      <div style={{
        marginTop: 44, padding: '40px 44px 52px', borderRadius: 34, background: 'rgba(204,148,26,0.12)', border: `3px solid ${C.oro}`,
        boxShadow: '0 0 80px rgba(204,148,26,0.25)', opacity: Math.min(1, e2 * 1.4), transform: `scale(${0.9 + 0.1 * e2}) translateY(${(1 - e2) * 60}px)`,
      }}>
        {etiqueta('REALIDAD', C.oro, IconoCheck)}
        <p style={{ marginTop: 26, fontFamily: F.anton, fontSize: tamTitular([f.verdad], 1500, 112), lineHeight: 1.04, color: C.oro, textTransform: 'uppercase' }}>{f.verdad}</p>
      </div>
    </AbsoluteFill>
  );
}

// ------------------------------------------------------------------ gráfica: peso diario frente a media semanal
const PESOS = Array.from({ length: 28 }, (_, d) => 80.6 - d * 0.045 + Math.sin(d * 2.1) * 0.45 + Math.sin(d * 0.9 + 1) * 0.3);

export function Grafica({ f }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [h0, h1] = useHabla(f);
  const W = 940, H = 620, pad = { l: 90, r: 30, t: 30, b: 70 };
  const min = 78.6, max = 81.6;
  const x = (d) => pad.l + (d / 27) * (W - pad.l - pad.r);
  const y = (v) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b);
  const diario = PESOS.map((v, d) => `${d ? 'L' : 'M'}${x(d).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const medias = [0, 1, 2, 3].map((s) => ({ d: s * 7 + 3, v: PESOS.slice(s * 7, s * 7 + 7).reduce((a, b) => a + b, 0) / 7 }));
  const media = medias.map((m, i) => `${i ? 'L' : 'M'}${x(m.d).toFixed(1)},${y(m.v).toFixed(1)}`).join(' ');
  const p1 = tramo(frame, 6, Math.max(20, h0 + (h1 - h0) * 0.45));
  const p2 = tramo(frame, h0 + (h1 - h0) * 0.5, h0 + (h1 - h0) * 0.85);
  const e = entrada(frame, fps, 0);
  return (
    <AbsoluteFill style={{ alignItems: 'center', paddingTop: 340 }}>
      <Eyebrow>{f.etiqueta}</Eyebrow>
      <div style={{ marginTop: 40, padding: 24, borderRadius: 34, background: C.tarjeta, border: `3px solid ${C.borde}`, ...sube(e) }}>
        <svg width={W} height={H}>
          {[79, 80, 81].map((v) => (
            <g key={v}>
              <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="#262626" strokeWidth={2} />
              <text x={pad.l - 18} y={y(v) + 10} textAnchor="end" fill="#7a7a7a" fontFamily={F.inter} fontWeight={700} fontSize={28}>{v}</text>
            </g>
          ))}
          {[0, 1, 2, 3].map((s) => (
            <text key={s} x={x(s * 7 + 3)} y={H - 22} textAnchor="middle" fill="#7a7a7a" fontFamily={F.inter} fontWeight={700} fontSize={26}>SEM {s + 1}</text>
          ))}
          <path d={diario} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={4} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p1} />
          {PESOS.map((v, d) => (d / 27 <= p1 ? <circle key={d} cx={x(d)} cy={y(v)} r={7} fill="#fff" /> : null))}
          <path d={media} fill="none" stroke={C.oro} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p2}
            style={{ filter: 'drop-shadow(0 0 14px rgba(204,148,26,0.6))' }} />
          {medias.map((m, i) => (i / 3 <= p2 && p2 > 0 ? <circle key={i} cx={x(m.d)} cy={y(m.v)} r={14} fill={C.oro} stroke="#0a0a0a" strokeWidth={4} /> : null))}
        </svg>
      </div>
      <div style={{ marginTop: 34, display: 'flex', gap: 54, fontFamily: F.inter, fontWeight: 800, fontSize: 36, color: '#fff', ...sube(entrada(frame, fps, 8), 30) }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}><i style={{ width: 18, height: 18, borderRadius: 9, background: '#fff' }} />Día a día</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 14, color: C.oro, opacity: 0.35 + 0.65 * Math.min(1, p2 * 3) }}><i style={{ width: 44, height: 12, borderRadius: 6, background: C.oro }} />Media semanal</span>
      </div>
    </AbsoluteFill>
  );
}

// ------------------------------------------------------------------ plato: mitad verdura
function sector(cx, cy, r, a0, a1) {
  const p = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1},${y1} Z`;
}

export function PlatoEscena({ f }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [h0] = useHabla(f);
  const R = 300, c = R + 30;
  const partes = [
    { a0: Math.PI / 2, a1: Math.PI * 1.5, color: '#3a9d4f', nombre: 'Verdura', pct: '1/2', retraso: Math.max(6, h0 + 12) },
    { a0: -Math.PI / 2, a1: 0, color: C.oro, nombre: 'Proteína', pct: '1/4', retraso: Math.max(18, h0 + 30) },
    { a0: 0, a1: Math.PI / 2, color: '#d8d8d8', nombre: 'Carbohidratos', pct: '1/4', retraso: Math.max(26, h0 + 38) },
  ];
  return (
    <AbsoluteFill style={{ alignItems: 'center', paddingTop: 340 }}>
      <Eyebrow>{f.etiqueta}</Eyebrow>
      <svg width={2 * c} height={2 * c} style={{ marginTop: 30, ...sube(entrada(frame, fps, 0)) }}>
        <circle cx={c} cy={c} r={R + 26} fill="#151515" stroke={C.oro} strokeWidth={6} />
        <circle cx={c} cy={c} r={R + 4} fill="#0d0d0d" />
        {partes.map((p, i) => {
          const e = entrada(frame, fps, p.retraso, { damping: 12, mass: 0.6 });
          const medio = (p.a0 + p.a1) / 2;
          const sep = 10 * e;
          return (
            <g key={i} transform={`translate(${Math.cos(medio) * sep} ${Math.sin(medio) * sep}) translate(${c} ${c}) scale(${e}) translate(${-c} ${-c})`}>
              <path d={sector(c, c, R - 6, p.a0, p.a1)} fill={p.color} />
              <text x={c + Math.cos(medio) * R * 0.55} y={c + Math.sin(medio) * R * 0.55 + 22} textAnchor="middle" fontFamily={F.anton} fontSize={i === 0 ? 92 : 64} fill="#0a0a0a">{p.pct}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ marginTop: 30, display: 'flex', gap: 40, fontFamily: F.inter, fontWeight: 800, fontSize: 36, color: '#fff' }}>
        {partes.map((p) => (
          <span key={p.nombre} style={{ display: 'flex', alignItems: 'center', gap: 12, ...sube(entrada(frame, fps, p.retraso + 4), 24) }}>
            <i style={{ width: 22, height: 22, borderRadius: 6, background: p.color }} />{p.nombre}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
}

// ------------------------------------------------------------------ captura de la app en un móvil en 3D
export function App({ f }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const e = entrada(frame, fps, 0, { damping: 16, mass: 0.9 });
  const giro = interpolate(e, [0, 1], [38, -7]) + interpolate(frame, [20, 200], [0, 7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scroll = tramo(frame, 18, Math.max(30, durationInFrames - 6)) * (f.desplazar ?? 0);
  const chip = entrada(frame, fps, 6);
  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <p style={{
        position: 'absolute', top: 292, left: '50%', transform: `translateX(-50%) translateY(${(1 - chip) * 30}px)`, opacity: chip,
        padding: '14px 36px', borderRadius: 999, border: `2px solid rgba(204,148,26,0.85)`, background: 'rgba(10,10,10,0.8)',
        fontFamily: F.audiowide, fontSize: 28, letterSpacing: '0.28em', color: '#fff', whiteSpace: 'nowrap', textTransform: 'uppercase',
      }}>{f.etiqueta}</p>
      <div style={{
        position: 'absolute', left: 290, top: 392, width: 500, height: 930, borderRadius: 60, border: '12px solid #1b1b1b', outline: '2px solid #3a3a3a',
        background: '#0a0a0a', overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.75), 0 0 100px rgba(204,148,26,0.25)',
        transform: `translateY(${(1 - e) * 200}px) rotateY(${giro}deg) rotateX(6deg)`, opacity: Math.min(1, e * 1.5),
      }}>
        <Img src={staticFile(`app/${f.captura}.png`)} style={{ position: 'absolute', left: 0, top: 0, width: '100%', transform: `translateY(${-scroll}px)` }} />
      </div>
    </AbsoluteFill>
  );
}

// ------------------------------------------------------------------ cierre con la moneda 3D del logo
export function Cta({ f, d }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: 'rgba(10,10,10,0.7)' }}>
      <div style={{ position: 'absolute', top: 170, left: 0, width: 1080, height: 760 }}>
        <MonedaLogo width={1080} height={760} />
      </div>
      <div style={{ position: 'absolute', top: 930, left: 0, right: 0, textAlign: 'center' }}>
        <h2 style={{ fontFamily: F.anton, fontWeight: 400, fontSize: 150, lineHeight: 0.98, textTransform: 'uppercase', color: '#fff' }}>
          <Mascara retraso={6}>Pruébala</Mascara>
          <Mascara retraso={11} style={{ color: C.oro }}>gratis</Mascara>
        </h2>
        <p style={{ marginTop: 40, fontFamily: F.audiowide, fontSize: 44, letterSpacing: '0.06em', color: C.oro, ...sube(entrada(frame, fps, 16), 30) }}>{d.web}</p>
        <p style={{
          display: 'inline-block', marginTop: 30, padding: '18px 44px', borderRadius: 999, border: '3px solid rgba(255,255,255,0.25)',
          fontFamily: F.inter, fontWeight: 800, fontSize: 40, color: '#fff', ...sube(entrada(frame, fps, 20), 30),
        }}>{d.usuario}</p>
      </div>
    </AbsoluteFill>
  );
}

export const ESCENAS = { portada: Portada, dato: Dato, lista: Lista, punto: Punto, mito: Mito, grafica: Grafica, plato: PlatoEscena, app: App, cta: Cta };
