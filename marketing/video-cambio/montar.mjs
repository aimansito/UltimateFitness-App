// ============================================
// MONTAJE DEL VÍDEO «MI CAMBIO»
//   node montar.mjs                 monta todo (reutiliza lo que no haya cambiado)
//   node montar.mjs --capturas      vuelve a capturar la app (necesita la app arrancada en local)
//   node montar.mjs --limpio        ignora la caché y lo rehace todo
//   node montar.mjs --solo=logo,cta rehace solo esos planos y recompone
// Todo lo editable está en guion.mjs.
// ============================================
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { APP, MARCA, TARJETAS, FORMATO, FUENTES } from './guion.mjs';
import { DIR, carpetaBuild, RAIZ } from './lib/rutas.mjs';
import { lineaDeTiempo, segundos, SEG_POR_TIEMPO, bloquesLocucion } from './lib/tiempo.mjs';
import { renderClip, extraerFoto, prepararFoto } from './lib/planos.mjs';
import { renderEscena, urlArchivo } from './lib/escenas.mjs';
import { figuraSvg } from './lib/figura.mjs';
import { capturarApp, faltanCapturas, rutaCaptura, CAPTURAS } from './lib/capturas.mjs';
import { renderRotulos } from './lib/subtitulos.mjs';
import { montarVoz } from './lib/audio.mjs';
import { encadenarPlanos, exportarFinal } from './lib/composicion.mjs';
import { cerrarNavegador } from './lib/navegador.mjs';
import { numFotogramas } from './lib/ffmpeg.mjs';

const args = process.argv.slice(2);
const opcion = (nombre) => args.includes(`--${nombre}`);
const solo = (args.find((a) => a.startsWith('--solo=')) || '').replace('--solo=', '').split(',').filter(Boolean);

const cronometro = Date.now();
const paso = (texto) => console.log(`[${((Date.now() - cronometro) / 1000).toFixed(0).padStart(4)} s] ${texto}`);

const linea = lineaDeTiempo();
const dirPlanos = carpetaBuild('planos');
const dirFotos = carpetaBuild('fotos');
const archivoPlano = (p) => path.join(dirPlanos, `${String(p.indice).padStart(2, '0')}_${p.id}.mp4`);

// ---------- Caché: un plano solo se rehace si cambia algo de lo que depende ----------
const leer = (ruta) => (fs.existsSync(ruta) ? fs.readFileSync(ruta) : '');
const comunes = ['comun.css', 'comun.js'].map((f) => leer(path.join(DIR.escenas, f))).join('');
function huella(plano, datos) {
  const plantilla = plano.escena || plano.capa;
  const dependencias = (plantilla ? leer(path.join(DIR.escenas, `${plantilla}.html`)) + comunes : '') + leer(path.join(RAIZ, 'lib', 'planos.mjs'));
  return crypto.createHash('sha1').update(JSON.stringify([plano, datos]) + dependencias).digest('hex');
}
function alDia(plano, datos) {
  if (opcion('limpio') || solo.includes(plano.id)) return false;
  const archivo = archivoPlano(plano);
  return fs.existsSync(archivo) && leer(`${archivo}.huella`).toString() === huella(plano, datos);
}
const marcar = (plano, datos) => fs.writeFileSync(`${archivoPlano(plano)}.huella`, huella(plano, datos));

// ---------- Datos de cada escena ----------
const foto = (clip) => path.join(dirFotos, `${clip}.png`);

function datosDeEscena(plano) {
  const dur = plano.dur;
  switch (plano.escena || plano.capa) {
    case 'logo':
      return { dur };
    case 'app': {
      const base = { antetitulo: plano.datos.antetitulo, titulo: plano.datos.titulo, dur };
      if (plano.datos.pantallas === 'rutinas') {
        // Las pantallas se reparten a lo largo del plano, con el toque del dedo justo antes de cada una
        const cada = dur / CAPTURAS.rutinas.length;
        const toques = [null, [0.585, 0.328], [0.82, 0.636], null];
        return {
          ...base,
          pantallas: CAPTURAS.rutinas.map((n, i) => ({ src: urlArchivo(rutaCaptura(n)), en: Number((i * cada).toFixed(3)), toque: toques[i] })),
        };
      }
      return { ...base, desplazar: { src: urlArchivo(rutaCaptura(CAPTURAS.dieta)), px: 860, desde: 0.7, hasta: dur + 0.2 } };
    }
    case 'tarjeta': {
      const t = TARJETAS[plano.tarjeta];
      return {
        dur,
        grupos: t.grupos,
        minutos: t.minutos,
        svgs: [figuraSvg(t.musculos, 'anterior'), figuraSvg(t.musculos, 'posterior')],
      };
    }
    case 'comparativa':
      return { dur, antes: urlArchivo(foto('antes')), ahora: urlArchivo(foto('despues')), posAntes: '50% 50%', posAhora: '50% 78%' };
    case 'cta':
      return { dur, ...MARCA };
    default:
      throw new Error(`Escena desconocida: ${plano.escena}`);
  }
}

// ---------- Montaje ----------
async function main() {
  paso(`Línea de tiempo: ${linea.planos.length} planos, ${segundos(linea.total).toFixed(2)} s (${linea.total} fotogramas)`);

  if (opcion('capturas') || faltanCapturas()) {
    paso('Capturando la app en local...');
    await capturarApp(APP);
  }

  paso('Extrayendo las fotos fijas...');
  await prepararFoto(FUENTES.fotoAntes, foto('antes'), FUENTES.recorteAntes);
  await prepararFoto(FUENTES.fotoDespues, foto('despues'));

  for (const plano of linea.planos) {
    const datos = plano.escena || plano.capa ? datosDeEscena(plano) : null;
    if (alDia(plano, datos)) continue;
    paso(`Plano ${plano.indice + 1}/${linea.planos.length}: ${plano.id} (${plano.fotogramas} fotogramas)`);
    if (plano.escena) {
      await renderEscena({
        plantilla: plano.escena, datos, fotogramas: plano.fotogramas, asaIni: plano.asaIni,
        carpeta: carpetaBuild('escenas', plano.id), salida: archivoPlano(plano),
      });
    } else if (plano.capa) {
      // Clip de fondo + capa transparente (tarjeta de entreno)
      const fondo = path.join(dirPlanos, `${plano.id}_fondo.mp4`);
      await renderClip(plano, fondo);
      await renderEscena({
        plantilla: plano.capa, datos, fotogramas: plano.fotogramas, asaIni: plano.asaIni,
        carpeta: carpetaBuild('escenas', plano.id), salida: archivoPlano(plano), fondo,
      });
    } else {
      const factor = await renderClip(plano, archivoPlano(plano));
      console.log(`         velocidad ${(100 / factor).toFixed(0)} %`);
    }
    const hechos = await numFotogramas(archivoPlano(plano));
    if (hechos !== plano.fotogramas) throw new Error(`${plano.id}: se esperaban ${plano.fotogramas} fotogramas y hay ${hechos}`);
    marcar(plano, datos);
  }

  paso('Rótulos y subtítulos...');
  const dirRotulos = path.join(DIR.build, 'rotulos');
  const estados = await renderRotulos(linea, dirRotulos);
  paso(`  ${estados} estados distintos`);
  await cerrarNavegador();

  paso('Voz...');
  const voz = path.join(DIR.build, 'voz.wav');
  await montarVoz(voz, segundos(linea.total));

  paso('Encadenando planos con sus transiciones...');
  const base = path.join(DIR.build, 'base.mp4');
  await encadenarPlanos(linea, archivoPlano, base);

  paso('Exportando el vídeo final...');
  fs.mkdirSync(DIR.salida, { recursive: true });
  const salida = path.join(DIR.salida, 'mi-cambio.mp4');
  await exportarFinal({ base, carpetaRotulos: dirRotulos, voz, salida, total: linea.total });

  // Resumen útil para ajustar el guion
  const bloques = bloquesLocucion();
  console.log('\nPlanos (segundo en el que entra cada uno):');
  for (const p of linea.planos) console.log(`  ${segundos(p.corte).toFixed(2).padStart(6)} s  ${p.id}`);
  console.log(`\nLa voz empieza en ${bloques[0].inicioVideo.toFixed(2)} s. Formato ${FORMATO.ancho}x${FORMATO.alto} a ${FORMATO.fps} fps.`);
  paso(`Listo: ${salida}`);
}

main().catch(async (e) => {
  console.error(`\nERROR: ${e.message}`);
  await cerrarNavegador();
  process.exit(1);
});
