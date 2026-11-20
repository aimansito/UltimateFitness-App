import { Composition, registerRoot } from 'remotion';
import { Video } from './Video.jsx';
// Lo genera `node preparar.mjs` (tiempos de cada frase y palabra a partir de la voz)
import datos from './generado/videos.json';

function Raiz() {
  return (
    <>
      {Object.values(datos).map((d) => (
        <Composition key={d.id} id={d.id} component={Video} durationInFrames={Math.ceil(d.total * d.fps)} fps={d.fps} width={1080} height={1920} defaultProps={{ d }} />
      ))}
    </>
  );
}

registerRoot(Raiz);
