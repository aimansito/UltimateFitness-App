<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Service\AvatarStorage;
use App\Service\CorreosCuenta;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Gestión de la propia cuenta (derechos RGPD): cambiar contraseña, descargar los datos
 * (portabilidad, art. 20), retirar el consentimiento de salud (art. 7.3) y suprimir la cuenta (art. 17).
 * Todas las rutas actúan solo sobre la cuenta autenticada; ninguna recibe un id.
 */
#[Route('/api/cuenta')]
class CuentaController extends AbstractController
{
    private const CAMPOS_SALUD = [
        'peso_actual', 'altura', 'peso_objetivo', 'porcentaje_grasa', 'imc', 'calorias_diarias', 'notas_salud',
    ];

    public function __construct(
        private EntityManagerInterface $em,
        private Connection $conn,
        private UserPasswordHasherInterface $hasher,
        private CorreosCuenta $correos,
        private AvatarStorage $avatares,
        private LoggerInterface $logger,
    ) {
    }

    #[Route('/password', name: 'cuenta_password', methods: ['POST'])]
    public function cambiarPassword(Request $request): JsonResponse
    {
        $usuario = $this->usuario();
        if (!$usuario) {
            return $this->noAutenticado();
        }
        $datos = $this->json_($request);
        $actual = $datos['actual'] ?? null;
        $nueva = $datos['nueva'] ?? null;

        if (!is_string($actual) || !$this->hasher->isPasswordValid($usuario, $actual)) {
            return $this->error('La contraseña actual no es correcta', Response::HTTP_BAD_REQUEST);
        }
        if (!is_string($nueva) || strlen($nueva) < 8) {
            return $this->error('La nueva contraseña debe tener al menos 8 caracteres', Response::HTTP_BAD_REQUEST);
        }
        if ($nueva === $actual) {
            return $this->error('La nueva contraseña debe ser distinta de la actual', Response::HTTP_BAD_REQUEST);
        }

        $usuario->setPasswordHash($this->hasher->hashPassword($usuario, $nueva));
        // Un cambio de contraseña invalida cualquier enlace de recuperación pendiente
        $usuario->setResetToken(null);
        $usuario->setResetTokenExpires(null);
        $this->em->flush();

        $this->correos->passwordCambiada($usuario);

        return $this->json(['success' => true, 'message' => 'Contraseña actualizada']);
    }

    #[Route('/exportar', name: 'cuenta_exportar', methods: ['GET'])]
    public function exportar(): JsonResponse
    {
        $usuario = $this->usuario();
        if (!$usuario) {
            return $this->noAutenticado();
        }
        $id = $usuario->getId();
        $q = fn (string $sql, array $p = [], array $tipos = []) => $this->conn->fetchAllAssociative($sql, $p, $tipos);

        $cuenta = $this->conn->fetchAssociative('SELECT * FROM usuarios WHERE id = ?', [$id]) ?: [];
        // Nunca se exportan secretos
        unset($cuenta['password_hash'], $cuenta['reset_token'], $cuenta['reset_token_expires']);

        $entrenamientos = $q(
            'SELECT * FROM entrenamientos WHERE creador_usuario_id = ? OR asignado_ausuario_id = ?',
            [$id, $id]
        );
        $idsEntrenamientos = array_column($entrenamientos, 'id') ?: [0];
        $dietas = $q('SELECT * FROM dietas WHERE asignado_a_usuario_id = ?', [$id]);
        $idsDietas = array_column($dietas, 'id') ?: [0];

        $datos = [
            'generado' => (new \DateTimeImmutable())->format(DATE_ATOM),
            'cuenta' => $cuenta,
            'entrenamientos' => $entrenamientos,
            'dias_entrenamiento' => $q(
                'SELECT de.*, ej.nombre AS ejercicio, dx.series, dx.repeticiones, dx.descanso_segundos, dx.notas AS notas_ejercicio
                 FROM dias_entrenamiento de
                 LEFT JOIN dias_ejercicios dx ON dx.dia_entrenamiento_id = de.id
                 LEFT JOIN ejercicios ej ON ej.id = dx.ejercicio_id
                 WHERE de.entrenamiento_id IN (?)',
                [$idsEntrenamientos],
                [Connection::PARAM_INT_ARRAY]
            ),
            'dietas' => $dietas,
            'dieta_platos' => $q(
                'SELECT dp.*, p.nombre AS plato FROM dieta_platos dp JOIN platos p ON p.id = dp.plato_id WHERE dp.dieta_id IN (?)',
                [$idsDietas],
                [Connection::PARAM_INT_ARRAY]
            ),
            'calendario' => $q('SELECT * FROM calendario_usuario WHERE usuario_id = ?', [$id]),
            'sigues_a' => $q("SELECT seguido_tipo, seguido_id, fecha_creacion FROM seguimientos WHERE seguidor_tipo = 'usuario' AND seguidor_id = ?", [$id]),
            'te_siguen' => $q("SELECT seguidor_tipo, seguidor_id, fecha_creacion FROM seguimientos WHERE seguido_tipo = 'usuario' AND seguido_id = ?", [$id]),
            'favoritos' => $q("SELECT item_tipo, item_id, fecha_creacion FROM guardados WHERE propietario_tipo = 'usuario' AND propietario_id = ?", [$id]),
        ];

        $respuesta = new JsonResponse($datos);
        $respuesta->setEncodingOptions(JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $respuesta->headers->set('Content-Disposition', 'attachment; filename="mis-datos-ultimate-fitness.json"');
        $respuesta->headers->set('Cache-Control', 'no-store');

        return $respuesta;
    }

    #[Route('/datos-salud', name: 'cuenta_borrar_salud', methods: ['DELETE'])]
    public function retirarConsentimientoSalud(): JsonResponse
    {
        $usuario = $this->usuario();
        if (!$usuario) {
            return $this->noAutenticado();
        }
        $sets = implode(', ', array_map(fn ($c) => "$c = NULL", self::CAMPOS_SALUD));
        $this->conn->executeStatement("UPDATE usuarios SET $sets WHERE id = ?", [$usuario->getId()]);
        $this->em->refresh($usuario);

        return $this->json(['success' => true, 'message' => 'Datos de salud eliminados']);
    }

    #[Route('/eliminar', name: 'cuenta_eliminar', methods: ['POST'])]
    public function eliminar(Request $request): JsonResponse
    {
        $usuario = $this->usuario();
        if (!$usuario) {
            return $this->noAutenticado();
        }
        $password = $this->json_($request)['password'] ?? null;
        if (!is_string($password) || !$this->hasher->isPasswordValid($usuario, $password)) {
            return $this->error('La contraseña no es correcta', Response::HTTP_BAD_REQUEST);
        }
        if ($usuario->getRol() === 'admin') {
            // Evita quedarse sin administración por error; otro admin puede borrarla
            return $this->error('Una cuenta de administración no puede borrarse desde aquí', Response::HTTP_FORBIDDEN);
        }

        $id = $usuario->getId();
        $nombre = (string) $usuario->getNombre();
        $email = (string) $usuario->getEmail();
        $foto = $usuario->getFotoUrl();
        $fotosEntrenos = $this->conn->fetchFirstColumn(
            'SELECT foto_url FROM calendario_usuario WHERE usuario_id = ? AND foto_url IS NOT NULL',
            [$id]
        );

        try {
            $this->conn->transactional(function (Connection $c) use ($id) {
                $idsEntrenamientos = $c->fetchFirstColumn('SELECT id FROM entrenamientos WHERE creador_usuario_id = ? OR asignado_ausuario_id = ?', [$id, $id]);
                $idsDietas = $c->fetchFirstColumn('SELECT id FROM dietas WHERE asignado_a_usuario_id = ?', [$id]);

                // Relaciones sociales (sin clave foránea, porque son polimórficas)
                $c->executeStatement("DELETE FROM seguimientos WHERE (seguidor_tipo = 'usuario' AND seguidor_id = ?) OR (seguido_tipo = 'usuario' AND seguido_id = ?)", [$id, $id]);
                $c->executeStatement("DELETE FROM guardados WHERE propietario_tipo = 'usuario' AND propietario_id = ?", [$id]);
                // Favoritos de otras personas que apuntaban a contenido de esta cuenta
                if ($idsEntrenamientos) {
                    $c->executeStatement("DELETE FROM guardados WHERE item_tipo = 'entrenamiento' AND item_id IN (?)", [$idsEntrenamientos], [Connection::PARAM_INT_ARRAY]);
                }
                if ($idsDietas) {
                    $c->executeStatement("DELETE FROM guardados WHERE item_tipo = 'dieta' AND item_id IN (?)", [$idsDietas], [Connection::PARAM_INT_ARRAY]);
                }

                // El resto (calendario, entrenamientos, dietas, solicitudes, suscripciones...) cae por ON DELETE CASCADE
                $c->executeStatement('DELETE FROM usuarios WHERE id = ?', [$id]);
            });
        } catch (\Throwable $e) {
            $this->logger->error('Error al eliminar cuenta', ['usuario' => $id, 'error' => $e->getMessage()]);
            return $this->error('No se pudo eliminar la cuenta. Inténtalo de nuevo o escríbenos.', Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $this->avatares->borrar($foto);
        foreach ($fotosEntrenos as $fotoEntreno) {
            $this->avatares->borrarFotoEntreno($fotoEntreno);
        }
        $this->em->clear();
        $this->correos->cuentaEliminada($nombre, $email);
        $this->logger->info('Cuenta eliminada a petición de su titular', ['usuario' => $id]);

        return $this->json(['success' => true, 'message' => 'Tu cuenta y tus datos se han eliminado']);
    }

    private function usuario(): ?Usuario
    {
        $u = $this->getUser();
        return $u instanceof Usuario ? $u : null;
    }

    private function json_(Request $request): array
    {
        $datos = json_decode($request->getContent(), true);
        return is_array($datos) ? $datos : [];
    }

    private function error(string $mensaje, int $codigo): JsonResponse
    {
        return $this->json(['success' => false, 'error' => $mensaje], $codigo);
    }

    private function noAutenticado(): JsonResponse
    {
        return $this->error('No autenticado', Response::HTTP_UNAUTHORIZED);
    }
}
