<?php

namespace App\Controller;

use App\Entity\Entrenador;
use App\Entity\Usuario;
use App\Enum\Privacidad;
use App\Service\AvatarStorage;
use App\Service\VisibilidadService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Perfil público, ajustes de privacidad y foto de perfil.
 * La identidad sale siempre de getUser(); nunca de la URL ni del body.
 */
#[Route('/api/perfil')]
class PerfilController extends AbstractController
{
    public function __construct(
        private VisibilidadService $visibilidad,
        private EntityManagerInterface $entityManager
    ) {
    }

    // ============================================
    // PERFIL PÚBLICO (accesible sin sesión)
    // ============================================
    /** Perfil de la cuenta oficial (rutinas y dietas de Ultimate Fitness). Su id cambia entre entornos. */
    #[Route('/publico/oficial', name: 'perfil_publico_oficial', methods: ['GET'])]
    public function oficial(EntityManagerInterface $em): JsonResponse
    {
        $cuenta = $em->getRepository(Usuario::class)->findOneBy(['email' => \App\Command\CargarContenidoCommand::EMAIL_OFICIAL]);
        if (!$cuenta) {
            return $this->json(['success' => false, 'error' => 'Perfil no encontrado'], Response::HTTP_NOT_FOUND);
        }

        return $this->publico('usuario', $cuenta->getId());
    }

    #[Route('/publico/{tipo}/{id}', name: 'perfil_publico', requirements: ['tipo' => 'usuario|entrenador', 'id' => '\d+'], methods: ['GET'])]
    public function publico(string $tipo, int $id): JsonResponse
    {
        $cuenta = $this->visibilidad->cuenta($tipo, $id);
        if ($cuenta === null) {
            return $this->json(['success' => false, 'error' => 'Perfil no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $actor = $this->visibilidad->actor($this->getUser());
        $esMio = $this->visibilidad->esDueno($actor, $tipo, $id);
        $verTodo = $esMio || ($actor['admin'] ?? false);
        $oculto = !$cuenta['perfil_publico'] && !$verTodo;

        $perfil = [
            'tipo' => $tipo,
            'id' => $id,
            'nombre' => trim($cuenta['nombre'] . ' ' . $cuenta['apellidos']),
            'fotoUrl' => $cuenta['foto_url'],
            'bio' => $oculto ? null : $cuenta['bio'],
            'especialidad' => $oculto ? null : $cuenta['especialidad'],
            'perfilPublico' => $cuenta['perfil_publico'],
            'esMio' => $esMio,
            'loSigo' => $this->visibilidad->sigue($actor, $tipo, $id),
        ] + ($oculto ? ['seguidores' => null, 'seguidos' => null] : $this->visibilidad->contadores($tipo, $id));

        $respuesta = ['success' => true, 'perfil' => $perfil];

        foreach (VisibilidadService::BLOQUES as $bloque) {
            $motivo = $this->visibilidad->motivoBloqueo($actor, $cuenta, $bloque);
            if ($motivo !== null) {
                $respuesta[$bloque] = ['visible' => false, 'motivo' => $motivo, 'items' => []];
                continue;
            }

            $items = match ($bloque) {
                'entrenamientos' => $this->visibilidad->entrenamientosDe($cuenta, $verTodo),
                'dietas' => $this->visibilidad->dietasDe($cuenta, $verTodo),
                'favoritos' => $this->visibilidad->favoritosDe($cuenta, $actor),
            };
            $respuesta[$bloque] = [
                'visible' => true,
                'motivo' => null,
                'items' => $this->visibilidad->marcarGuardados($items, $actor),
            ];
        }

        // Publicaciones: entrenos completados que la persona ha publicado (foto/tarjeta del día).
        // Siguen la misma privacidad que sus rutinas.
        if ($tipo === 'usuario') {
            $motivo = $this->visibilidad->motivoBloqueo($actor, $cuenta, 'entrenamientos');
            $respuesta['publicaciones'] = [
                'visible' => $motivo === null,
                'motivo' => $motivo,
                'items' => $motivo !== null ? [] : array_map(fn (array $f) => [
                    'id' => (int) $f['id'],
                    'fecha' => $f['fecha_completado'],
                    'fotoUrl' => $f['foto_url'],
                    'fotoEsTarjeta' => (bool) $f['foto_es_tarjeta'],
                    'duracionMinutos' => $f['duracion_minutos'] !== null ? (int) $f['duracion_minutos'] : null,
                    'entrenamiento' => $f['nombre'],
                ], $this->entityManager->getConnection()->fetchAllAssociative(
                    'SELECT cu.id, cu.fecha_completado, cu.foto_url, cu.foto_es_tarjeta, cu.duracion_minutos, e.nombre
                     FROM calendario_usuario cu
                     INNER JOIN entrenamientos e ON e.id = cu.entrenamiento_id
                     WHERE cu.usuario_id = ? AND cu.completado = 1 AND cu.compartido_en_feed = 1
                     ORDER BY cu.fecha_completado DESC, cu.id DESC
                     LIMIT 60',
                    [$id]
                )),
            ];
        }

        if ($esMio) {
            $respuesta['privacidad'] = $this->privacidadDe($cuenta);
        }

        return $this->json($respuesta);
    }

    // ============================================
    // MIS AJUSTES
    // ============================================
    #[Route('/mio', name: 'perfil_mio', methods: ['GET'])]
    public function mio(): JsonResponse
    {
        $actor = $this->visibilidad->actor($this->getUser());
        if ($actor === null) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $cuenta = $this->visibilidad->cuenta($actor['tipo'], $actor['id']);
        if ($cuenta === null) {
            return $this->json(['success' => false, 'error' => 'Perfil no encontrado'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'success' => true,
            'tipo' => $actor['tipo'],
            'id' => $actor['id'],
            'nombre' => trim($cuenta['nombre'] . ' ' . $cuenta['apellidos']),
            'fotoUrl' => $cuenta['foto_url'],
            'privacidad' => $this->privacidadDe($cuenta),
        ] + $this->visibilidad->contadores($actor['tipo'], $actor['id']));
    }

    #[Route('/privacidad', name: 'perfil_privacidad', methods: ['PATCH'])]
    public function privacidad(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof Usuario && !$user instanceof Entrenador) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json(['success' => false, 'error' => 'Datos no válidos'], Response::HTTP_BAD_REQUEST);
        }

        if (array_key_exists('perfilPublico', $data)) {
            if (!is_bool($data['perfilPublico'])) {
                return $this->json(['success' => false, 'error' => 'perfilPublico debe ser verdadero o falso'], Response::HTTP_BAD_REQUEST);
            }
            $user->setPerfilPublico($data['perfilPublico']);
        }

        $setters = [
            'entrenamientos' => 'setPrivacidadEntrenamientos',
            'dietas' => 'setPrivacidadDietas',
            'favoritos' => 'setPrivacidadFavoritos',
        ];
        foreach ($setters as $clave => $setter) {
            if (!array_key_exists($clave, $data)) {
                continue;
            }
            $nivel = is_string($data[$clave]) ? Privacidad::tryFrom($data[$clave]) : null;
            if ($nivel === null) {
                return $this->json([
                    'success' => false,
                    'error' => "Valor no válido para $clave (publico, seguidores o privado)",
                ], Response::HTTP_BAD_REQUEST);
            }
            $user->$setter($nivel);
        }

        $this->entityManager->flush();

        return $this->json([
            'success' => true,
            'privacidad' => [
                'perfilPublico' => $user->isPerfilPublico(),
                'entrenamientos' => $user->getPrivacidadEntrenamientos()->value,
                'dietas' => $user->getPrivacidadDietas()->value,
                'favoritos' => $user->getPrivacidadFavoritos()->value,
            ],
        ]);
    }

    // ============================================
    // FOTO DE PERFIL
    // ============================================
    #[Route('/avatar', name: 'perfil_avatar_subir', methods: ['POST'])]
    public function subirAvatar(Request $request, AvatarStorage $storage): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof Usuario && !$user instanceof Entrenador) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $archivo = $request->files->get('avatar');
        if ($archivo === null) {
            return $this->json([
                'success' => false,
                'error' => 'No se recibió ninguna imagen (máximo 2 MB)',
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            $url = $storage->guardar($archivo);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['success' => false, 'error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (\Throwable) {
            return $this->json(['success' => false, 'error' => 'No se pudo guardar la imagen'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $anterior = $user->getFotoUrl();
        $user->setFotoUrl($url);
        $this->entityManager->flush();
        $storage->borrar($anterior);

        return $this->json(['success' => true, 'fotoUrl' => $url]);
    }

    #[Route('/avatar', name: 'perfil_avatar_borrar', methods: ['DELETE'])]
    public function borrarAvatar(AvatarStorage $storage): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof Usuario && !$user instanceof Entrenador) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $anterior = $user->getFotoUrl();
        $user->setFotoUrl(null);
        $this->entityManager->flush();
        $storage->borrar($anterior);

        return $this->json(['success' => true, 'fotoUrl' => null]);
    }

    private function privacidadDe(array $cuenta): array
    {
        return [
            'perfilPublico' => $cuenta['perfil_publico'],
            'entrenamientos' => $cuenta['privacidad_entrenamientos'],
            'dietas' => $cuenta['privacidad_dietas'],
            'favoritos' => $cuenta['privacidad_favoritos'],
        ];
    }
}
