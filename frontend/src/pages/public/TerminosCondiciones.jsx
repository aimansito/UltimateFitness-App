// ============================================
// TÉRMINOS Y CONDICIONES DE USO
// ============================================
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { PaginaLegal, Lista, Correo } from '../../components/legal/PaginaLegal';
import { TITULAR, EDAD_MINIMA } from '../../config/legal';

function TerminosCondiciones() {
  const secciones = [
    {
      id: 'aceptacion',
      titulo: 'Qué regulan',
      contenido: (
        <p>
          Estas condiciones regulan el uso de {TITULAR.marca} con una cuenta registrada. Al crear la cuenta las aceptas. El titular del servicio se identifica en el{' '}
          <Link to="/aviso-legal" className="text-uf-gold hover:underline">Aviso legal</Link> y el tratamiento de tus datos se explica en la{' '}
          <Link to="/politica-privacidad" className="text-uf-gold hover:underline">Política de privacidad</Link>.
        </p>
      ),
    },
    {
      id: 'servicio',
      titulo: 'El servicio',
      contenido: (
        <>
          <p>{TITULAR.marca} te permite:</p>
          <Lista>
            <li>Crear, organizar y planificar rutinas de entrenamiento y planes de alimentación.</li>
            <li>Consultar la biblioteca de ejercicios, dietas y el blog.</li>
            <li>Tener un perfil, seguir a otras personas y compartir, guardar o copiar rutinas, dietas y platos.</li>
            <li>Registrar los entrenamientos que completas, con los ejercicios hechos y una foto opcional, compartirlos en el feed y descargar la imagen para tus redes.</li>
          </Lista>
          <p>El servicio es gratuito. Si en el futuro se ofrece algún plan de pago, se informará antes de forma clara y nunca se cobrará sin tu aceptación expresa.</p>
        </>
      ),
    },
    {
      id: 'cuenta',
      titulo: 'Tu cuenta',
      contenido: (
        <Lista>
          <li>Debes tener al menos {EDAD_MINIMA} años.</li>
          <li>Los datos que facilites deben ser veraces. No puedes suplantar a otra persona.</li>
          <li>Eres responsable de mantener tu contraseña en secreto. Si sospechas que alguien la conoce, cámbiala.</li>
          <li>Puedes eliminar tu cuenta cuando quieras desde <Link to="/cuenta" className="text-uf-gold hover:underline">Gestionar cuenta</Link>, o escribiendo a <Correo email={TITULAR.email} />.</li>
        </Lista>
      ),
    },
    {
      id: 'contenido',
      titulo: 'Contenido que publicas',
      contenido: (
        <>
          <p>
            Lo que creas (rutinas, dietas, platos, foto y biografía) sigue siendo tuyo. Cuando lo haces visible, nos permites mostrarlo en el servicio y permites a otras personas usuarias
            verlo y guardarlo o copiarlo en su propia cuenta para uso personal. Este permiso es gratuito y termina cuando lo vuelves privado o lo borras, salvo las copias que otras personas ya hayan hecho.
          </p>
          <p>No puedes publicar contenido:</p>
          <Lista>
            <li>Que no sea tuyo o no tengas derecho a compartir (por ejemplo, fotos en las que salgan otras personas sin su permiso).</li>
            <li>Fotos con desnudos, de contenido sexual o de menores de edad.</li>
            <li>Ilegal, ofensivo, discriminatorio o que acose a otras personas.</li>
            <li>Que recomiende prácticas peligrosas para la salud, sustancias prohibidas o dietas extremas.</li>
            <li>Publicitario o de spam.</li>
          </Lista>
          <p>Podemos retirar el contenido que incumpla estas normas y, si el incumplimiento es grave o repetido, suspender la cuenta, informándote del motivo.</p>
        </>
      ),
    },
    {
      id: 'salud',
      titulo: 'Salud y responsabilidad',
      contenido: (
        <>
          <p>
            Las rutinas y dietas, incluidas las creadas por otras personas usuarias, son orientativas y no constituyen consejo médico, nutricional ni de un profesional del deporte.
            Antes de empezar un programa de ejercicio o de cambiar tu alimentación, consulta con un profesional, sobre todo si tienes una lesión, una enfermedad, estás embarazada o tomas medicación.
          </p>
          <p>
            Para el ejercicio, escucha a tu cuerpo y detente si notas dolor, mareo o malestar. El titular no responde de los daños derivados de seguir contenido publicado por otras personas usuarias,
            sin perjuicio de los derechos que te reconoce la normativa de consumidores.
          </p>
        </>
      ),
    },
    {
      id: 'disponibilidad',
      titulo: 'Disponibilidad y cambios del servicio',
      contenido: (
        <p>
          Procuramos que el servicio funcione siempre, pero puede haber interrupciones por mantenimiento o causas ajenas. Podemos cambiar o retirar funciones;
          si un cambio te afecta de forma importante, te avisaremos con antelación razonable.
        </p>
      ),
    },
    {
      id: 'cambios',
      titulo: 'Cambios en estas condiciones',
      contenido: (
        <p>
          Si cambiamos estas condiciones te avisaremos por email o en la plataforma al menos 15 días antes de que se apliquen. Si no estás de acuerdo, puedes dejar de usar el servicio y eliminar tu cuenta.
        </p>
      ),
    },
    {
      id: 'ley',
      titulo: 'Ley aplicable y reclamaciones',
      contenido: (
        <p>
          Se aplica la ley española. Para cualquier duda o reclamación escribe a <Correo email={TITULAR.email} />. Si eres consumidor, puedes acudir a los juzgados de tu domicilio.
        </p>
      ),
    },
  ];

  return (
    <PaginaLegal
      titulo="Términos y condiciones"
      subtitulo="Las reglas para usar el servicio con tu cuenta."
      descripcionSeo="Términos y condiciones de uso de Ultimate Fitness."
      icono={FileText}
      secciones={secciones}
    />
  );
}

export default TerminosCondiciones;
