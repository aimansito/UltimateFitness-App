<?php

namespace App\Service;

use App\Entity\Entrenador;
use App\Entity\Usuario;
use Doctrine\DBAL\Connection;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Única fuente de verdad para "¿puede X ver esto de Y?".
 *
 * Un actor es ['tipo' => 'usuario'|'entrenador', 'id' => int, 'admin' => bool] o null (sin sesión).
 * Una cuenta es la fila pública de usuarios/entrenadores normalizada por cuenta().
 */
class VisibilidadService
{
    public const TIPOS = ['usuario', 'entrenador'];
    public const BLOQUES = ['entrenamientos', 'dietas', 'favoritos'];
    public const ITEMS = ['entrenamiento', 'dieta', 'plato', 'ejercicio'];

    public function __construct(private Connection $conn)
    {
    }

    public function actor(?UserInterface $user): ?array
    {
        if ($user instanceof Usuario) {
            return ['tipo' => 'usuario', 'id' => (int) $user->getId(), 'admin' => $user->getRol() === 'admin'];
        }
        if ($user instanceof Entrenador) {
            return ['tipo' => 'entrenador', 'id' => (int) $user->getId(), 'admin' => false];
        }
        return null;
    }

    /** Datos públicos y ajustes de una cuenta, o null si no existe / no está activa. */
    public function cuenta(string $tipo, int $id): ?array
    {
        if ($tipo === 'usuario') {
            $fila = $this->conn->fetchAssociative(
                "SELECT id, nombre, apellidos, foto_url, bio_corta AS bio, NULL AS especialidad,
                        perfil_publico, privacidad_entrenamientos, privacidad_dietas, privacidad_favoritos
                 FROM usuarios WHERE id = ?",
                [$id]
            );
        } elseif ($tipo === 'entrenador') {
            $fila = $this->conn->fetchAssociative(
                "SELECT id, nombre, apellidos, foto_url, biografia AS bio, especialidad,
                        perfil_publico, privacidad_entrenamientos, privacidad_dietas, privacidad_favoritos
                 FROM entrenadores WHERE id = ? AND activo = 1 AND estado_aplicacion = 'aprobado'",
                [$id]
            );
        } else {
            return null;
        }

        if (!$fila) {
            return null;
        }

        $fila['tipo'] = $tipo;
        $fila['id'] = (int) $fila['id'];
        $fila['perfil_publico'] = (bool) $fila['perfil_publico'];
        return $fila;
    }

    public function esDueno(?array $actor, string $tipo, int $id): bool
    {
        return $actor !== null && $actor['tipo'] === $tipo && $actor['id'] === $id;
    }

    public function sigue(?array $actor, string $tipo, int $id): bool
    {
        if ($actor === null) {
            return false;
        }
        return (bool) $this->conn->fetchOne(
            'SELECT 1 FROM seguimientos WHERE seguidor_tipo = ? AND seguidor_id = ? AND seguido_tipo = ? AND seguido_id = ?',
            [$actor['tipo'], $actor['id'], $tipo, $id]
        );
    }

    /**
     * Motivo por el que el actor NO puede ver un bloque de la cuenta, o null si puede.
     * Motivos: 'perfil_privado' | 'seguidores' | 'privado'.
     */
    public function motivoBloqueo(?array $actor, array $cuenta, string $bloque): ?string
    {
        if ($this->esDueno($actor, $cuenta['tipo'], $cuenta['id']) || ($actor['admin'] ?? false)) {
            return null;
        }
        if (!$cuenta['perfil_publico']) {
            return 'perfil_privado';
        }

        return match ($cuenta['privacidad_' . $bloque]) {
            'publico' => null,
            'seguidores' => $this->sigue($actor, $cuenta['tipo'], $cuenta['id']) ? null : 'seguidores',
            default => 'privado',
        };
    }

    public function puedeVer(?array $actor, array $cuenta, string $bloque): bool
    {
        return $this->motivoBloqueo($actor, $cuenta, $bloque) === null;
    }

    public function contadores(string $tipo, int $id): array
    {
        return [
            'seguidores' => (int) $this->conn->fetchOne(
                'SELECT COUNT(*) FROM seguimientos WHERE seguido_tipo = ? AND seguido_id = ?', [$tipo, $id]
            ),
            'seguidos' => (int) $this->conn->fetchOne(
                'SELECT COUNT(*) FROM seguimientos WHERE seguidor_tipo = ? AND seguidor_id = ?', [$tipo, $id]
            ),
        ];
    }

    // ============================================
    // CONTENIDO PROPIO DE UNA CUENTA
    // ============================================

    /** Entrenamientos creados por la cuenta. $todos = incluir también los no públicos (solo dueño/admin). */
    public function entrenamientosDe(array $cuenta, bool $todos): array
    {
        $donde = $cuenta['tipo'] === 'usuario'
            ? 'e.creador_usuario_id = :id'
            : 'e.creador_id = :id AND e.creador_usuario_id IS NULL AND e.asignado_ausuario_id IS NULL';

        $filas = $this->conn->fetchAllAssociative(
            "SELECT e.id, e.nombre, e.descripcion, e.tipo, e.nivel_dificultad, e.duracion_minutos,
                    e.es_publico, e.valoracion_promedio, e.clonado_de_id
             FROM entrenamientos e
             WHERE $donde" . ($todos ? '' : ' AND e.es_publico = 1') . '
             ORDER BY e.fecha_creacion DESC LIMIT 60',
            ['id' => $cuenta['id']]
        );

        return array_map(fn (array $f) => [
            'itemTipo' => 'entrenamiento',
            'id' => (int) $f['id'],
            'nombre' => $f['nombre'],
            'descripcion' => $f['descripcion'],
            'tipo' => $f['tipo'],
            'nivel' => $f['nivel_dificultad'],
            'duracionMinutos' => $f['duracion_minutos'] !== null ? (int) $f['duracion_minutos'] : null,
            'publico' => (bool) $f['es_publico'],
            'valoracion' => (float) $f['valoracion_promedio'],
            'esCopia' => $f['clonado_de_id'] !== null,
        ], $filas);
    }

    /** Dietas creadas por la cuenta. */
    public function dietasDe(array $cuenta, bool $todos): array
    {
        $donde = $cuenta['tipo'] === 'usuario'
            ? 'd.creador_id IS NULL AND d.asignado_a_usuario_id = :id'
            : 'd.creador_id = :id AND d.asignado_a_usuario_id IS NULL';

        $filas = $this->conn->fetchAllAssociative(
            "SELECT d.id, d.nombre, d.descripcion, d.calorias_totales, d.es_publica,
                    d.valoracion_promedio, d.clonado_de_id
             FROM dietas d
             WHERE $donde" . ($todos ? '' : ' AND d.es_publica = 1') . '
             ORDER BY d.fecha_creacion DESC LIMIT 60',
            ['id' => $cuenta['id']]
        );

        return array_map(fn (array $f) => [
            'itemTipo' => 'dieta',
            'id' => (int) $f['id'],
            'nombre' => $f['nombre'],
            'descripcion' => $f['descripcion'],
            'calorias' => $f['calorias_totales'] !== null ? (int) $f['calorias_totales'] : null,
            'publico' => (bool) $f['es_publica'],
            'valoracion' => (float) $f['valoracion_promedio'],
            'esCopia' => $f['clonado_de_id'] !== null,
        ], $filas);
    }

    /**
     * Favoritos de una cuenta. Solo se devuelven los ítems que el actor puede ver por sí mismos,
     * de modo que guardar algo no lo hace visible a terceros.
     */
    public function favoritosDe(array $cuenta, ?array $actor): array
    {
        $guardados = $this->conn->fetchAllAssociative(
            'SELECT item_tipo, item_id FROM guardados
             WHERE propietario_tipo = ? AND propietario_id = ?
             ORDER BY fecha_creacion DESC LIMIT 90',
            [$cuenta['tipo'], $cuenta['id']]
        );

        $items = [];
        foreach ($guardados as $g) {
            $item = $this->itemVisible($actor, $g['item_tipo'], (int) $g['item_id']);
            if ($item !== null) {
                $items[] = $item;
            }
        }
        return $items;
    }

    // ============================================
    // ÍTEMS SUELTOS (guardar / clonar)
    // ============================================

    /**
     * Devuelve el ítem normalizado si el actor puede verlo, o null.
     * Visible = es del actor, o es público y el bloque de su autor es visible para el actor.
     */
    public function itemVisible(?array $actor, string $itemTipo, int $id): ?array
    {
        if ($itemTipo === 'entrenamiento') {
            $f = $this->conn->fetchAssociative(
                'SELECT id, nombre, descripcion, tipo, nivel_dificultad, duracion_minutos, es_publico,
                        creador_id, creador_usuario_id, asignado_ausuario_id
                 FROM entrenamientos WHERE id = ?',
                [$id]
            );
            if (!$f) {
                return null;
            }
            $autor = $f['creador_usuario_id'] !== null
                ? ['usuario', (int) $f['creador_usuario_id']]
                : ($f['creador_id'] !== null ? ['entrenador', (int) $f['creador_id']] : null);
            $esMio = ($autor && $this->esDueno($actor, $autor[0], $autor[1]))
                || ($f['asignado_ausuario_id'] !== null && $this->esDueno($actor, 'usuario', (int) $f['asignado_ausuario_id']));
            // Un plan que un entrenador hizo para un cliente concreto no es contenido público
            $personal = $f['creador_usuario_id'] === null && $f['asignado_ausuario_id'] !== null;
            $publico = (bool) $f['es_publico'] && !$personal;
            $extra = [
                'tipo' => $f['tipo'],
                'nivel' => $f['nivel_dificultad'],
                'duracionMinutos' => $f['duracion_minutos'] !== null ? (int) $f['duracion_minutos'] : null,
            ];
            $bloque = 'entrenamientos';
        } elseif ($itemTipo === 'dieta') {
            $f = $this->conn->fetchAssociative(
                'SELECT id, nombre, descripcion, calorias_totales, es_publica AS es_publico,
                        creador_id, asignado_a_usuario_id
                 FROM dietas WHERE id = ?',
                [$id]
            );
            if (!$f) {
                return null;
            }
            $autor = $f['creador_id'] !== null
                ? ['entrenador', (int) $f['creador_id']]
                : ($f['asignado_a_usuario_id'] !== null ? ['usuario', (int) $f['asignado_a_usuario_id']] : null);
            $esMio = ($autor && $this->esDueno($actor, $autor[0], $autor[1]))
                || ($f['asignado_a_usuario_id'] !== null && $this->esDueno($actor, 'usuario', (int) $f['asignado_a_usuario_id']));
            $personal = $f['creador_id'] !== null && $f['asignado_a_usuario_id'] !== null;
            $publico = (bool) $f['es_publico'] && !$personal;
            $extra = ['calorias' => $f['calorias_totales'] !== null ? (int) $f['calorias_totales'] : null];
            $bloque = 'dietas';
        } elseif ($itemTipo === 'plato') {
            $f = $this->conn->fetchAssociative(
                'SELECT id, nombre, descripcion, tipo_comida, calorias_totales, es_publico FROM platos WHERE id = ?',
                [$id]
            );
            if (!$f) {
                return null;
            }
            // Los platos no tienen un autor fiable (creador_id mezcla tablas): solo cuenta su flag público
            $autor = null;
            $esMio = false;
            $publico = (bool) $f['es_publico'];
            $extra = [
                'tipoComida' => $f['tipo_comida'],
                'calorias' => $f['calorias_totales'] !== null ? (int) round((float) $f['calorias_totales']) : null,
            ];
            $bloque = null;
        } elseif ($itemTipo === 'ejercicio') {
            $f = $this->conn->fetchAssociative(
                'SELECT id, nombre, descripcion, grupo_muscular, nivel_dificultad, creador_usuario_id FROM ejercicios WHERE id = ?',
                [$id]
            );
            if (!$f) {
                return null;
            }
            // Del catálogo (sin creador) = público; creado por un usuario = solo suyo
            $autor = null;
            $esMio = $f['creador_usuario_id'] !== null && $this->esDueno($actor, 'usuario', (int) $f['creador_usuario_id']);
            $publico = $f['creador_usuario_id'] === null;
            $extra = ['grupoMuscular' => $f['grupo_muscular'], 'nivel' => $f['nivel_dificultad']];
            $bloque = null;
        } else {
            return null;
        }

        if (!$esMio && !($actor['admin'] ?? false)) {
            if (!$publico) {
                return null;
            }
            if ($autor !== null && $bloque !== null) {
                $cuenta = $this->cuenta($autor[0], $autor[1]);
                if ($cuenta === null || !$this->puedeVer($actor, $cuenta, $bloque)) {
                    return null;
                }
            }
        }

        return [
            'itemTipo' => $itemTipo,
            'id' => (int) $f['id'],
            'nombre' => $f['nombre'],
            'descripcion' => $f['descripcion'],
            'publico' => $publico,
            'esMio' => $esMio,
        ] + $extra;
    }

    /** Marca en cada ítem si el actor lo tiene guardado. */
    public function marcarGuardados(array $items, ?array $actor): array
    {
        if ($actor === null || $items === []) {
            return array_map(fn (array $i) => $i + ['guardado' => false], $items);
        }

        $mios = $this->conn->fetchAllAssociative(
            'SELECT item_tipo, item_id FROM guardados WHERE propietario_tipo = ? AND propietario_id = ?',
            [$actor['tipo'], $actor['id']]
        );
        $claves = [];
        foreach ($mios as $m) {
            $claves[$m['item_tipo'] . ':' . $m['item_id']] = true;
        }

        return array_map(
            fn (array $i) => $i + ['guardado' => isset($claves[$i['itemTipo'] . ':' . $i['id']])],
            $items
        );
    }
}
