// Escenas 3D con Three.js (vía @remotion/three): todo se anima con el fotograma actual, nunca con
// el reloj, para que cada fotograma salga igual al renderizar.
import { useEffect, useMemo, useState } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useCurrentFrame, useVideoConfig, delayRender, continueRender, staticFile } from 'remotion';
import { C, F, entrada } from './estilo.js';

/** Reflejos de estudio generados en local (sin descargar mapas HDR) */
function Entorno() {
  const { gl, scene } = useThree();
  const tex = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const t = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return t;
  }, [gl]);
  scene.environment = tex;
  useEffect(() => () => tex.dispose(), [tex]);
  return null;
}

function Luces() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <pointLight position={[-4, -1.5, -1.5]} intensity={7} color={C.azul} />
      <pointLight position={[3.5, 1.5, 1]} intensity={9} color="#ffd27a" />
    </>
  );
}

const MAT = {
  oro: () => new THREE.MeshStandardMaterial({ color: '#d9a033', metalness: 1, roughness: 0.3 }),
  azul: () => new THREE.MeshStandardMaterial({ color: C.azul, metalness: 0.55, roughness: 0.3 }),
  negro: () => new THREE.MeshStandardMaterial({ color: '#161616', metalness: 0.6, roughness: 0.35 }),
  cromo: () => new THREE.MeshStandardMaterial({ color: '#dcdcdc', metalness: 1, roughness: 0.14 }),
  blanco: () => new THREE.MeshStandardMaterial({ color: '#ececec', metalness: 0.05, roughness: 0.35 }),
};
const useMat = () => useMemo(() => Object.fromEntries(Object.entries(MAT).map(([k, f]) => [k, f()])), []);

/** Aleatorio reproducible (mismo resultado en cada fotograma) */
const azar = (semilla) => () => ((semilla = (semilla * 16807) % 2147483647) - 1) / 2147483646;

// ------------------------------------------------------------------ objetos
function Mancuerna() {
  const m = useMat();
  const discos = [[0.8, 0.17, 0.95], [0.66, 0.15, 1.11], [0.52, 0.13, 1.25]];
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh material={m.cromo}><cylinderGeometry args={[0.09, 0.09, 2.9, 32]} /></mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh material={m.cromo} position={[0, s * 0.78, 0]}><cylinderGeometry args={[0.17, 0.17, 0.12, 32]} /></mesh>
          {discos.map(([r, h, y]) => (
            <mesh key={y} material={m.oro} position={[0, s * y, 0]}><cylinderGeometry args={[r, r, h, 64]} /></mesh>
          ))}
          <mesh material={m.negro} position={[0, s * 1.38, 0]}><cylinderGeometry args={[0.13, 0.13, 0.1, 32]} /></mesh>
        </group>
      ))}
    </group>
  );
}

function Batido() {
  const m = useMat();
  return (
    <group position={[0, -0.25, 0]}>
      <mesh material={m.negro}><cylinderGeometry args={[0.66, 0.56, 2.0, 64]} /></mesh>
      <mesh material={m.oro} position={[0, 0.35, 0]}><cylinderGeometry args={[0.675, 0.655, 0.2, 64]} /></mesh>
      <mesh material={m.oro} position={[0, 1.2, 0]}><cylinderGeometry args={[0.7, 0.7, 0.42, 64]} /></mesh>
      <mesh material={m.negro} position={[0, 1.52, 0]}><cylinderGeometry args={[0.17, 0.2, 0.24, 32]} /></mesh>
      <mesh material={m.azul} position={[0, 1.67, 0]}><cylinderGeometry args={[0.13, 0.13, 0.08, 32]} /></mesh>
      <mesh material={m.oro} position={[0.78, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.18, 0.05, 16, 48]} /></mesh>
      {[-0.35, -0.6].map((y) => (
        <mesh key={y} material={m.cromo} position={[0, y, 0]}><torusGeometry args={[0.6 + (y + 1) * 0.04, 0.008, 8, 64]} /></mesh>
      ))}
    </group>
  );
}

function Capsula() {
  const m = useMat();
  const frame = useCurrentFrame();
  const granos = useMemo(() => {
    const r = azar(7);
    return Array.from({ length: 46 }, () => ({ a: r() * Math.PI * 2, rad: 1.35 + r() * 0.7, y: (r() - 0.5) * 2.2, s: 0.035 + r() * 0.05 }));
  }, []);
  return (
    <group>
      <group rotation={[0, 0, -0.55]}>
        <mesh material={m.oro} position={[0, 0.36, 0]}><cylinderGeometry args={[0.5, 0.5, 0.72, 64]} /></mesh>
        <mesh material={m.oro} position={[0, 0.72, 0]}><sphereGeometry args={[0.5, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
        <mesh material={m.azul} position={[0, -0.36, 0]}><cylinderGeometry args={[0.5, 0.5, 0.72, 64]} /></mesh>
        <mesh material={m.azul} position={[0, -0.72, 0]}><sphereGeometry args={[0.5, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /></mesh>
        <mesh material={m.cromo}><cylinderGeometry args={[0.505, 0.505, 0.04, 64]} /></mesh>
      </group>
      {granos.map((g, i) => {
        const a = g.a + frame * 0.012;
        return (
          <mesh key={i} material={m.blanco} position={[Math.cos(a) * g.rad, g.y, Math.sin(a) * g.rad]} rotation={[a, a * 2, 0]}>
            <boxGeometry args={[g.s, g.s, g.s]} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Báscula cuyo número baila: el peso sube y baja por el agua */
function Bascula() {
  const m = useMat();
  const frame = useCurrentFrame();
  const { lienzo, tex } = useMemo(() => {
    const lienzo = document.createElement('canvas');
    lienzo.width = 512; lienzo.height = 200;
    const tex = new THREE.CanvasTexture(lienzo);
    tex.colorSpace = THREE.SRGBColorSpace;
    return { lienzo, tex };
  }, []);
  const valores = ['80.4', '79.8', '80.9', '80.2', '79.6', '80.6'];
  const valor = valores[Math.floor(frame / 9) % valores.length];
  const ctx = lienzo.getContext('2d');
  ctx.fillStyle = '#071018'; ctx.fillRect(0, 0, 512, 200);
  ctx.fillStyle = C.azul; ctx.font = `150px ${F.anton}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(valor, 230, 106);
  ctx.font = `60px ${F.anton}`; ctx.fillText('KG', 440, 128);
  tex.needsUpdate = true;
  return (
    <group rotation={[0.62, 0, 0]}>
      <mesh material={m.negro}><boxGeometry args={[2.6, 0.24, 2.6]} /></mesh>
      <mesh position={[0, 0.125, 0]}>
        <boxGeometry args={[2.42, 0.02, 2.42]} />
        <meshStandardMaterial color="#202020" metalness={0.2} roughness={0.08} />
      </mesh>
      <mesh material={m.oro} position={[0, 0, 0]}><boxGeometry args={[2.64, 0.06, 2.64]} /></mesh>
      <mesh position={[0, 0.14, 0.78]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.15, 0.45]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {[[-0.6, -0.15], [0.6, -0.15]].map(([x, z]) => (
        <mesh key={x} position={[x, 0.14, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.7, 1.0]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Plato() {
  const m = useMat();
  const brocoli = useMemo(() => {
    const r = azar(11);
    return Array.from({ length: 34 }, () => {
      const a = Math.PI / 2 + r() * Math.PI, d = 0.25 + r() * 0.75;
      return { p: [Math.cos(a) * d, 0.12 + r() * 0.1, Math.sin(a) * d], s: 0.13 + r() * 0.08 };
    });
  }, []);
  const arroz = useMemo(() => {
    const r = azar(23);
    return Array.from({ length: 60 }, () => {
      const a = Math.PI * 1.5 + r() * Math.PI * 0.5, d = 0.2 + r() * 0.8;
      return { p: [Math.cos(a) * d, 0.1 + r() * 0.08, -Math.sin(a) * d], s: 0.06 + r() * 0.03 };
    });
  }, []);
  const verde = useMemo(() => new THREE.MeshStandardMaterial({ color: '#22702f', roughness: 0.8 }), []);
  return (
    <group rotation={[0.75, 0, 0]}>
      <mesh material={m.blanco}><cylinderGeometry args={[1.45, 1.15, 0.14, 96]} /></mesh>
      <mesh material={m.oro} position={[0, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.42, 0.045, 16, 128]} /></mesh>
      {brocoli.map((b, i) => <mesh key={i} material={verde} position={b.p}><sphereGeometry args={[b.s, 20, 16]} /></mesh>)}
      {arroz.map((b, i) => <mesh key={i} material={m.blanco} position={b.p}><sphereGeometry args={[b.s, 12, 10]} /></mesh>)}
      <mesh material={m.oro} position={[0.55, 0.2, -0.5]} rotation={[0, 0.5, 0]}><boxGeometry args={[0.75, 0.22, 0.45]} /></mesh>
      <mesh material={m.oro} position={[0.85, 0.2, -0.05]} rotation={[0, -0.3, 0]}><boxGeometry args={[0.55, 0.2, 0.36]} /></mesh>
    </group>
  );
}

const OBJETOS = { mancuerna: Mancuerna, batido: Batido, capsula: Capsula, bascula: Bascula, plato: Plato };
const GIRO = { mancuerna: [0.35, 1], batido: [0.18, 1], capsula: [0.1, 1], bascula: [0, 0.35], plato: [0, 0.4] };

function Giratorio({ tipo }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = entrada(frame, fps, 0, { damping: 13, mass: 0.9 });
  const t = frame / fps;
  const Objeto = OBJETOS[tipo];
  const [inclina, cuanto] = GIRO[tipo];
  // Aparece girando y después oscila despacio (los planos quietos se ven mejor de frente)
  const y = (1 - e) * Math.PI * 2 + (cuanto === 1 ? t * 0.55 : Math.sin(t * 0.9) * cuanto);
  return (
    <group scale={e} rotation={[inclina, y, 0]} position={[0, Math.sin(t * 1.6) * 0.07, 0]}>
      <Objeto />
    </group>
  );
}

/** Objeto 3D protagonista de la portada */
export function Objeto3D({ tipo, width, height }) {
  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 6], fov: 34 }} gl={{ antialias: true }}>
      <Entorno />
      <Luces />
      <Giratorio tipo={tipo} />
    </ThreeCanvas>
  );
}

// ------------------------------------------------------------------ moneda con el logo
function useTexturaLogo() {
  const [tex, setTex] = useState(null);
  const [espera] = useState(() => delayRender('logo de la moneda'));
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const lienzo = document.createElement('canvas');
      lienzo.width = lienzo.height = 1024;
      const ctx = lienzo.getContext('2d');
      ctx.fillStyle = '#0c0c0c'; ctx.fillRect(0, 0, 1024, 1024);
      const lado = 640, esc = Math.min(lado / img.width, lado / img.height);
      ctx.drawImage(img, 512 - (img.width * esc) / 2, 512 - (img.height * esc) / 2, img.width * esc, img.height * esc);
      const t = new THREE.CanvasTexture(lienzo);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      setTex(t);
    };
    img.onerror = () => continueRender(espera);
    img.src = staticFile('logo-small.png');
  }, [espera]);
  // Se libera el render cuando la moneda ya está pintada, no al cargar la imagen
  useEffect(() => {
    if (!tex) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => continueRender(espera)));
    return () => cancelAnimationFrame(id);
  }, [tex, espera]);
  return tex;
}

function Moneda({ tex }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const materiales = useMemo(() => {
    const cara = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: '#ffffff', emissiveIntensity: 0.45, metalness: 0.25, roughness: 0.45 });
    return [new THREE.MeshStandardMaterial({ color: C.oro, metalness: 1, roughness: 0.25 }), cara, cara];
  }, [tex]);
  const e = entrada(frame, fps, 0, { damping: 14, mass: 1 });
  const t = frame / fps;
  return (
    <group scale={e} rotation={[0, (1 - e) * Math.PI * 4 + Math.sin(t * 1.2) * 0.38, 0]}>
      <mesh material={materiales} rotation={[Math.PI / 2, Math.PI / 2, 0]}>
        <cylinderGeometry args={[1.55, 1.55, 0.2, 128]} />
      </mesh>
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[1.55, 0.06, 16, 128]} />
        <meshStandardMaterial color={C.oroClaro} metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

// El lienzo 3D solo se redibuja al cambiar de fotograma: la textura se carga antes de montarlo
export function MonedaLogo({ width, height }) {
  const tex = useTexturaLogo();
  if (!tex) return null;
  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 6], fov: 36 }} gl={{ antialias: true }}>
      <Entorno />
      <Luces />
      <Moneda tex={tex} />
    </ThreeCanvas>
  );
}

// ------------------------------------------------------------------ partículas de fondo
function Puntos() {
  const frame = useCurrentFrame();
  const { geo, mat } = useMemo(() => {
    const r = azar(3);
    const n = 420;
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
    const oro = new THREE.Color(C.oroClaro), azul = new THREE.Color(C.azul);
    for (let i = 0; i < n; i++) {
      pos.set([(r() - 0.5) * 9, (r() - 0.5) * 16, (r() - 0.5) * 6], i * 3);
      const c = r() < 0.72 ? oro : azul;
      col.set([c.r, c.g, c.b], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const lienzo = document.createElement('canvas');
    lienzo.width = lienzo.height = 64;
    const ctx = lienzo.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,0.5)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
    const mat = new THREE.PointsMaterial({
      size: 0.11, map: new THREE.CanvasTexture(lienzo), vertexColors: true, transparent: true,
      opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    return { geo, mat };
  }, []);
  return <points geometry={geo} material={mat} rotation={[frame * 0.0006, frame * 0.0018, 0]} />;
}

export function Particulas({ width, height }) {
  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 7], fov: 70 }}>
      <Puntos />
    </ThreeCanvas>
  );
}
