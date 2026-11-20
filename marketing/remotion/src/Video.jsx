// Composición completa: metraje de gym de fondo, partículas 3D, planos, cortes de marca,
// subtítulos palabra a palabra, barra de progreso y voz.
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing,
} from 'remotion';
import { C, F, entrada } from './estilo.js';
import { ESCENAS } from './escenas.jsx';
import { Particulas } from './tres.jsx';

const SIN_SELLO = ['portada', 'cta'];

function Fondo({ fondo }) {
  const frame = useCurrentFrame();
  const n = (frame % fondo.n) + 1;
  return (
    <AbsoluteFill>
      <Img src={staticFile(`${fondo.dir}/${String(n).padStart(4, '0')}.jpg`)} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
      <AbsoluteFill style={{
        background: 'linear-gradient(to bottom, rgba(10,10,10,0.7) 0, rgba(10,10,10,0.35) 420px, rgba(10,10,10,0.35) 1150px, rgba(10,10,10,0.9) 1480px, rgba(10,10,10,0.97) 100%)',
      }} />
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 38%, rgba(204,148,26,0.10), transparent 60%)' }} />
    </AbsoluteFill>
  );
}

/** Corte de marca: una franja dorada y otra azul cruzan la pantalla y tapan el cambio de plano */
function Corte() {
  const frame = useCurrentFrame();
  const curva = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) };
  const x1 = interpolate(frame, [0, 9], [-900, 1500], curva);
  const x2 = interpolate(frame, [2, 11], [-900, 1500], curva);
  const franja = (x, ancho, color) => (
    <div style={{ position: 'absolute', top: -400, left: 0, width: ancho, height: 2800, background: color, transform: `translateX(${x}px) rotate(16deg)`, boxShadow: `0 0 60px ${color}` }} />
  );
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {franja(x1, 230, C.oro)}
      {franja(x2, 70, C.azul)}
    </AbsoluteFill>
  );
}

function Sello({ visible }) {
  return (
    <div style={{ position: 'absolute', left: 64, top: 160, display: visible ? 'flex' : 'none', alignItems: 'center', gap: 16 }}>
      <Img src={staticFile('logo-small.png')} style={{ width: 62, height: 62, objectFit: 'contain' }} />
      <span style={{ fontFamily: F.audiowide, fontSize: 22, letterSpacing: '0.28em', color: '#fff' }}>ULTIMATE FITNESS</span>
    </div>
  );
}

function Subtitulos({ fragmentos, oculto }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const frag = oculto ? null : fragmentos.find((c) => t >= c.ini && t < c.fin);
  if (!frag) return null;
  const e = entrada(frame, fps, Math.round(frag.ini * fps), { damping: 12, mass: 0.5 });
  return (
    <div style={{
      position: 'absolute', left: 50, right: 50, top: 1390, textAlign: 'center', transform: `scale(${0.9 + 0.1 * e})`,
      fontFamily: F.inter, fontWeight: 800, fontSize: 66, lineHeight: 1.15, color: '#fff', letterSpacing: '-0.01em',
      textShadow: '0 4px 0 rgba(0,0,0,0.6), 0 0 28px rgba(0,0,0,0.9)',
    }}>
      {frag.palabras.map((p, i) => {
        const sig = frag.palabras[i + 1];
        const activa = t >= p.t && (!sig || t < sig.t);
        return (
          <span key={i} style={{ display: 'inline-block', margin: '0 0.2em', color: activa ? C.oro : '#fff', transform: activa ? 'scale(1.08)' : 'none' }}>{p.w}</span>
        );
      })}
    </div>
  );
}

function Progreso() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return <div style={{ position: 'absolute', left: 0, top: 0, height: 8, width: `${(frame / durationInFrames) * 100}%`, background: `linear-gradient(90deg, ${C.oro}, ${C.oroClaro})` }} />;
}

export function Video({ d }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fr = (s) => Math.round(s * fps);
  const t = frame / fps;
  const actual = d.frases.find((f) => t >= f.ini && t < f.fin) ?? d.frases[d.frases.length - 1];
  return (
    <AbsoluteFill style={{ background: C.fondo }}>
      <style>{'*{margin:0;padding:0;box-sizing:border-box}'}</style>
      <Fondo fondo={d.fondo} />
      <Particulas width={1080} height={1920} />
      {d.frases.map((f, i) => {
        const Escena = ESCENAS[f.tipo];
        const desde = fr(f.ini);
        const hasta = i === d.frases.length - 1 ? durationInFrames : fr(f.fin);
        return (
          <Sequence key={i} from={desde} durationInFrames={hasta - desde} layout="none">
            <AbsoluteFill><Escena f={f} d={d} /></AbsoluteFill>
          </Sequence>
        );
      })}
      {d.frases.slice(1).map((f, i) => (
        <Sequence key={`c${i}`} from={fr(f.ini) - 5} durationInFrames={13} layout="none"><Corte /></Sequence>
      ))}
      <Sello visible={!SIN_SELLO.includes(actual.tipo)} />
      <Subtitulos fragmentos={d.fragmentos} oculto={actual.tipo === 'cta'} />
      <Progreso />
      <Audio src={staticFile(d.audio)} />
    </AbsoluteFill>
  );
}
