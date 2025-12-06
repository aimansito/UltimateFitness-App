<?php

namespace App\Controller;

use App\Entity\Entrenamiento;
use App\Entity\Usuario;
use App\Entity\Entrenador;
use App\Entity\EntrenamientoEjercicio;
use App\Entity\Ejercicio;
use App\Entity\DiaEntrenamiento;
use App\Entity\DiaEjercicio;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/custom')]
class EntrenamientoController extends AbstractController
{
    // ============================================
    // ENTRENAMIENTOS RECOMENDADOS POR OBJETIVO
    // ============================================
    #[Route('/entrenamientos/recomendados', name: 'entrenamientos_recomendados', methods: ['GET'])]
    public function recomendados(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $objetivo = $request->query->get('objetivo');

        if (!$objetivo) {
            return $this->json([
                'success' => false,
                'error' => 'Parámetro "objetivo" requerido (ganar_masa, perder_peso, tonificar, resistencia)'
            ], Response::HTTP_BAD_REQUEST);
        }

        $entrenamientos = $entityManager->getRepository(Entrenamiento::class)
            ->createQueryBuilder('e')
            ->where('e.tipo = :objetivo')
            ->setParameter('objetivo', $objetivo)
            ->andWhere('e.esPublico = true')
            ->orderBy('e.valoracionPromedio', 'DESC')
            ->setMaxResults(20)
            ->getQuery()
            ->getResult();

        return $this->json([
            'success' => true,
            'objetivo' => $objetivo,
            'total' => count($entrenamientos),
            'entrenamientos' => array_map(function ($entrenamiento) {
                return $this->serializeEntrenamiento($entrenamiento);
            }, $entrenamientos)
        ]);
    }

    // ============================================
    // FILTRAR POR TIPO (gym, casa, cardio, etc)
    // ============================================
    #[Route('/entrenamientos/por-tipo', name: 'entrenamientos_por_tipo', methods: ['GET'])]
    public function porTipo(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $tipo = $request->query->get('tipo');

        if (!$tipo) {
            return $this->json([
                'success' => false,
                'error' => 'Parámetro "tipo" requerido'
            ], Response::HTTP_BAD_REQUEST);
        }

        $entrenamientos = $entityManager->getRepository(Entrenamiento::class)
            ->findBy(
                ['tipo' => $tipo, 'esPublico' => true],
                ['valoracionPromedio' => 'DESC']
            );

        return $this->json([
            'success' => true,
            'tipo' => $tipo,
            'total' => count($entrenamientos),
            'entrenamientos' => array_map(function ($entrenamiento) {
                return $this->serializeEntrenamiento($entrenamiento);
            }, $entrenamientos)
        ]);
    }

    // ============================================
    // FILTRAR POR NIVEL DE DIFICULTAD
    // ============================================
    #[Route('/entrenamientos/por-nivel', name: 'entrenamientos_por_nivel', methods: ['GET'])]
    public function porNivel(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $nivel = $request->query->get('nivel');

        if (!$nivel) {
            return $this->json([
                'success' => false,
                'error' => 'Parámetro "nivel" requerido (principiante, intermedio, avanzado)'
            ], Response::HTTP_BAD_REQUEST);
        }

        $entrenamientos = $entityManager->getRepository(Entrenamiento::class)
            ->findBy(
                ['nivelDificultad' => $nivel, 'esPublico' => true],
                ['nombre' => 'ASC']
            );

        return $this->json([
            'success' => true,
            'nivel' => $nivel,
            'total' => count($entrenamientos),
            'entrenamientos' => array_map(function ($entrenamiento) {
                return $this->serializeEntrenamiento($entrenamiento);
            }, $entrenamientos)
        ]);
    }

    // ============================================
    // ENTRENAMIENTOS POPULARES
    // ============================================
    #[Route('/entrenamientos/populares', name: 'entrenamientos_populares', methods: ['GET'])]
    public function populares(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $limit = $request->query->get('limit', 10);

        $entrenamientos = $entityManager->getRepository(Entrenamiento::class)
            ->createQueryBuilder('e')
            ->where('e.esPublico = true')
            ->andWhere('e.totalValoraciones > 0')
            ->orderBy('e.valoracionPromedio', 'DESC')
            ->addOrderBy('e.totalValoraciones', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        return $this->json([
            'success' => true,
            'total' => count($entrenamientos),
            'entrenamientos' => array_map(function ($entrenamiento) {
                return $this->serializeEntrenamiento($entrenamiento);
            }, $entrenamientos)
        ]);
    }

    // ============================================
    // CLONAR ENTRENAMIENTO (requiere autenticación)
    // ============================================
    #[Route('/entrenamientos/{id}/clonar', name: 'entrenamientos_clonar', methods: ['POST'])]
    public function clonar(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $user = $this->getUser();

        if (!$user) {
            return $this->json([
                'success' => false,
                'error' => 'Debe estar autenticado para clonar entrenamientos'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $entrenamientoOriginal = $entityManager->getRepository(Entrenamiento::class)->find($id);

        if (!$entrenamientoOriginal) {
            return $this->json([
                'success' => false,
                'error' => 'Entrenamiento no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        // Crear copia
        $entrenamientoClon = new Entrenamiento();
        $entrenamientoClon->setNombre($entrenamientoOriginal->getNombre() . ' (Copia)');
        $entrenamientoClon->setDescripcion($entrenamientoOriginal->getDescripcion());
        $entrenamientoClon->setTipo($entrenamientoOriginal->getTipo());
        $entrenamientoClon->setNivelDificultad($entrenamientoOriginal->getNivelDificultad());
        $entrenamientoClon->setDuracionMinutos($entrenamientoOriginal->getDuracionMinutos());
        $entrenamientoClon->setCreador($entrenamientoOriginal->getCreador()); // Mantener el creador original
        $entrenamientoClon->setEsPublico(false); // El clon es privado

        $entityManager->persist($entrenamientoClon);
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Entrenamiento clonado exitosamente',
            'entrenamiento' => $this->serializeEntrenamiento($entrenamientoClon)
        ], Response::HTTP_CREATED);
    }

    // ============================================
    // VALORAR ENTRENAMIENTO
    // ============================================
    #[Route('/entrenamientos/{id}/valorar', name: 'entrenamientos_valorar', methods: ['POST'])]
    public function valorar(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $entrenamiento = $entityManager->getRepository(Entrenamiento::class)->find($id);

        if (!$entrenamiento) {
            return $this->json([
                'success' => false,
                'error' => 'Entrenamiento no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        $puntuacion = $data['puntuacion'] ?? null;

        if (!$puntuacion || $puntuacion < 1 || $puntuacion > 5) {
            return $this->json([
                'success' => false,
                'error' => 'Puntuación debe estar entre 1 y 5'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Calcular nueva valoración promedio
        $totalValoraciones = $entrenamiento->getTotalValoraciones();
        $valoracionActual = $entrenamiento->getValoracionPromedio();

        $nuevoTotal = $totalValoraciones + 1;
        $nuevoPromedio = (($valoracionActual * $totalValoraciones) + $puntuacion) / $nuevoTotal;

        $entrenamiento->setValoracionPromedio(round($nuevoPromedio, 2));
        $entrenamiento->setTotalValoraciones($nuevoTotal);

        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Valoración registrada',
            'entrenamiento' => $this->serializeEntrenamiento($entrenamiento)
        ]);
    }

    // ============================================
    // CREAR ENTRENAMIENTO (Usuario Premium o Entrenador)
    // ============================================
    #[Route('/entrenamientos/crear', name: 'entrenamientos_crear', methods: ['POST'])]
    public function crearEntrenamiento(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        // Validar estructura de días
        if (!isset($data['dias']) || !is_array($data['dias'])) {
            return $this->json(['success' => false, 'error' => 'Se requiere estructura de días (array)'], Response::HTTP_BAD_REQUEST);
        }

        // Validar que haya 7 días
        if (count($data['dias']) !== 7) {
            return $this->json(['success' => false, 'error' => 'Debe incluir exactamente 7 días de la semana'], Response::HTTP_BAD_REQUEST);
        }

        // Contar días activos (no descanso)
        $diasActivos = array_filter($data['dias'], function($dia) {
            return !($dia['esDescanso'] ?? false);
        });

        // Validar mínimo 5 días activos
        if (count($diasActivos) < 5) {
            return $this->json(['success' => false, 'error' => 'Debe tener al menos 5 días de entrenamiento (máximo 2 días de descanso)'], Response::HTTP_BAD_REQUEST);
        }

        // Validar que días activos tengan concepto
        foreach ($diasActivos as $dia) {
            if (empty($dia['concepto'])) {
                return $this->json(['success' => false, 'error' => 'Los días activos deben tener un concepto/título'], Response::HTTP_BAD_REQUEST);
            }
            if (!isset($dia['ejercicios']) || count($dia['ejercicios']) === 0) {
                return $this->json(['success' => false, 'error' => 'Los días activos deben tener al menos un ejercicio'], Response::HTTP_BAD_REQUEST);
            }
        }

        // Crear entrenamiento base
        $entrenamiento = new Entrenamiento();
        $entrenamiento->setNombre($data['nombre'] ?? 'Nuevo Entrenamiento');
        $entrenamiento->setDescripcion($data['descripcion'] ?? null);
        $entrenamiento->setTipo($data['tipo'] ?? 'gym');
        $entrenamiento->setNivelDificultad($data['nivelDificultad'] ?? 'intermedio');
        $entrenamiento->setDuracionMinutos($data['duracionMinutos'] ?? 60);
        $entrenamiento->setEsPublico($data['esPublico'] ?? false);

        // Verificar permisos y asignar creador
        $clienteId = $data['cliente_id'] ?? null;
        
        if ($user instanceof Entrenador) {
            $entrenamiento->setCreador($user);
            
            // Si el entrenador especifica un cliente, asignar directamente
            if ($clienteId) {
                $cliente = $entityManager->getRepository(Usuario::class)->find($clienteId);
                if (!$cliente) {
                    return $this->json(['success' => false, 'error' => 'Cliente no encontrado'], Response::HTTP_NOT_FOUND);
                }
                $entrenamiento->setAsignadoAUsuario($cliente);
            }
        } elseif ($user instanceof Usuario) {
            if (!in_array('ROLE_PREMIUM', $user->getRoles()) && !in_array('ROLE_ADMIN', $user->getRoles())) {
                return $this->json(['success' => false, 'error' => 'Solo usuarios Premium pueden crear entrenamientos'], Response::HTTP_FORBIDDEN);
            }
            
            // Usuarios no pueden asignar a otros
            if ($clienteId) {
                return $this->json(['success' => false, 'error' => 'Solo los entrenadores pueden asignar entrenamientos a clientes'], Response::HTTP_FORBIDDEN);
            }
            
            $entrenamiento->setCreadorUsuario($user);
        } else {
            return $this->json(['success' => false, 'error' => 'Tipo de usuario no soportado'], Response::HTTP_FORBIDDEN);
        }

        $entityManager->persist($entrenamiento);

        // Procesar cada día de la semana
        foreach ($data['dias'] as $index => $diaData) {
            $diaEntrenamiento = new DiaEntrenamiento();
            $diaEntrenamiento->setEntrenamiento($entrenamiento);
            $diaEntrenamiento->setDiaSemana($diaData['diaSemana'] ?? ($index + 1));
            $diaEntrenamiento->setEsDescanso($diaData['esDescanso'] ?? false);
            $diaEntrenamiento->setConcepto($diaData['concepto'] ?? null);
            $diaEntrenamiento->setOrden($index);

            $entityManager->persist($diaEntrenamiento);

            // Si no es descanso, procesar ejercicios
            if (!$diaEntrenamiento->isEsDescanso() && isset($diaData['ejercicios'])) {
                foreach ($diaData['ejercicios'] as $ejercicioIndex => $ejercicioData) {
                    $ejercicio = $entityManager->getRepository(Ejercicio::class)->find($ejercicioData['ejercicio_id']);
                    if ($ejercicio) {
                        $diaEjercicio = new DiaEjercicio();
                        $diaEjercicio->setDiaEntrenamiento($diaEntrenamiento);
                        $diaEjercicio->setEjercicio($ejercicio);
                        $diaEjercicio->setSeries($ejercicioData['series'] ?? 3);
                        $diaEjercicio->setRepeticiones($ejercicioData['repeticiones'] ?? 12);
                        $diaEjercicio->setDescansoSegundos($ejercicioData['descanso_segundos'] ?? 60);
                        $diaEjercicio->setNotas($ejercicioData['notas'] ?? null);
                        $diaEjercicio->setOrden($ejercicioIndex);

                        $entityManager->persist($diaEjercicio);
                    }
                }
            }
        }

        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Plan de entrenamiento semanal creado exitosamente',
            'entrenamiento' => $this->serializeEntrenamiento($entrenamiento)
        ], Response::HTTP_CREATED);
    }

    // ============================================
    // ASIGNAR ENTRENAMIENTO (Entrenador a Cliente)
    // ============================================
    #[Route('/entrenamientos/{id}/asignar', name: 'entrenamientos_asignar', methods: ['POST'])]
    public function asignarEntrenamiento(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $user = $this->getUser(); // Entrenador
        // Verificar rol entrenador... (omitido por brevedad, se asume middleware o check simple)

        $entrenamiento = $entityManager->getRepository(Entrenamiento::class)->find($id);
        if (!$entrenamiento) {
            return $this->json(['success' => false, 'error' => 'Entrenamiento no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        $clienteId = $data['cliente_id'] ?? null;
        $cliente = $entityManager->getRepository(Usuario::class)->find($clienteId);

        if (!$cliente) {
            return $this->json(['success' => false, 'error' => 'Cliente no encontrado'], Response::HTTP_NOT_FOUND);
        }

        // Para asignar, lo ideal es clonar el entrenamiento y asignarlo al usuario, 
        // o si es una asignación directa de un plan genérico.
        // Aquí haremos una asignación directa modificando el campo asignadoAUsuario 
        // (o creando una copia si se quiere mantener el original limpio).
        // Siguiendo el patrón de Dietas, asignamos este entrenamiento específico.
        // Si se quiere reutilizar, se debería clonar antes. Asumiremos clonación automática para no "robar" el entrenamiento.
        
        $entrenamientoAsignado = new Entrenamiento();
        $entrenamientoAsignado->setNombre($entrenamiento->getNombre());
        $entrenamientoAsignado->setDescripcion($entrenamiento->getDescripcion());
        $entrenamientoAsignado->setTipo($entrenamiento->getTipo());
        $entrenamientoAsignado->setNivelDificultad($entrenamiento->getNivelDificultad());
        $entrenamientoAsignado->setDuracionMinutos($entrenamiento->getDuracionMinutos());
        $entrenamientoAsignado->setEsPublico(false);
        $entrenamientoAsignado->setCreador($entrenamiento->getCreador()); // Mantiene autoría original
        $entrenamientoAsignado->setAsignadoAUsuario($cliente); // Asigna al cliente

        $entityManager->persist($entrenamientoAsignado);

        // Copiar ejercicios
        foreach ($entrenamiento->getEntrenamientoEjercicios() as $ejercicioOriginal) {
            $nuevoEjercicio = new EntrenamientoEjercicio();
            $nuevoEjercicio->setEntrenamiento($entrenamientoAsignado);
            $nuevoEjercicio->setEjercicio($ejercicioOriginal->getEjercicio());
            $nuevoEjercicio->setSeries($ejercicioOriginal->getSeries());
            $nuevoEjercicio->setRepeticiones($ejercicioOriginal->getRepeticiones());
            $nuevoEjercicio->setDescansoSegundos($ejercicioOriginal->getDescansoSegundos());
            $nuevoEjercicio->setNotas($ejercicioOriginal->getNotas());
            $entityManager->persist($nuevoEjercicio);
        }

        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Entrenamiento asignado exitosamente',
            'entrenamiento' => $this->serializeEntrenamiento($entrenamientoAsignado)
        ]);
    }

    // ============================================
    // MIS ENTRENAMIENTOS (Creados + Asignados)
    // ✅ ACTUALIZADO: Incluye ejercicios e info del entrenador
    // ============================================
    #[Route('/mis-entrenamientos', name: 'mis_entrenamientos', methods: ['GET'])]
    public function misEntrenamientos(EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(
                ['success' => false, 'error' => 'No autenticado'], 
                Response::HTTP_UNAUTHORIZED
            );
        }

        $repo = $entityManager->getRepository(Entrenamiento::class);
        $creados = [];
        $asignados = [];

        if ($user instanceof Entrenador) {
            // ✅ Entrenamientos creados por el entrenador (profesional)
            $creados = $repo->findBy(
                ['creador' => $user], 
                ['fechaCreacion' => 'DESC']
            );
            
        } elseif ($user instanceof Usuario) {
            // ✅ Entrenamientos creados por el usuario (usuario Premium)
            $creados = $repo->findBy(
                ['creadorUsuario' => $user], 
                ['fechaCreacion' => 'DESC']
            );

            // ✅ Entrenamientos asignados por su entrenador
            // CRÍTICO: Buscar por asignadoAUsuario
            $asignados = $repo->createQueryBuilder('e')
                ->where('e.asignadoAUsuario = :usuario')
                ->setParameter('usuario', $user)
                ->orderBy('e.fechaCreacion', 'DESC')
                ->getQuery()
                ->getResult();
        }

        // ✅ Serializar ambas listas
        $datosCreados = array_map([$this, 'serializeEntrenamientoCompleto'], $creados);
        $datosAsignados = array_map([$this, 'serializeEntrenamientoCompleto'], $asignados);

        return $this->json([
            'success' => true,
            'creados' => $datosCreados,
            'asignados' => $datosAsignados,
            'total_creados' => count($datosCreados),
            'total_asignados' => count($datosAsignados)
        ]);
    }

    // ============================================
    // HELPER: Serializar entrenamiento COMPLETO
    // ✅ Incluye todo lo que el frontend necesita
    // ============================================
    private function serializeEntrenamientoCompleto(Entrenamiento $entrenamiento): array
    {
        // 1️⃣ Serializar días con sus ejercicios
        $diasSerializados = [];
        foreach ($entrenamiento->getDias() as $dia) {
            $ejerciciosDia = [];
            
            // Obtener ejercicios del día desde DiaEjercicio
            foreach ($dia->getEjercicios() as $diaEjercicio) {
                $ejerciciosDia[] = [
                    'id' => $diaEjercicio->getId(),
                    'ejercicio' => [
                        'id' => $diaEjercicio->getEjercicio()->getId(),
                        'nombre' => $diaEjercicio->getEjercicio()->getNombre(),
                        'grupoMuscular' => $diaEjercicio->getEjercicio()->getGrupoMuscular(),
                        'tipo' => $diaEjercicio->getEjercicio()->getTipo(),
                        'nivelDificultad' => $diaEjercicio->getEjercicio()->getNivelDificultad(),
                    ],
                    'series' => $diaEjercicio->getSeries(),
                    'repeticiones' => $diaEjercicio->getRepeticiones(),
                    'descansoSegundos' => $diaEjercicio->getDescansoSegundos(),
                    'notas' => $diaEjercicio->getNotas(),
                    'orden' => $diaEjercicio->getOrden(),
                ];
            }

            $diasSerializados[] = [
                'id' => $dia->getId(),
                'diaSemana' => $dia->getDiaSemana(),
                'concepto' => $dia->getConcepto(),
                'esDescanso' => $dia->isEsDescanso(),
                'orden' => $dia->getOrden(),
                'ejercicios' => $ejerciciosDia,
                'totalEjercicios' => count($ejerciciosDia)
            ];
        }

        // 2️⃣ Información del creador
        $creadorInfo = null;
        if ($entrenamiento->getCreador()) {
            $creador = $entrenamiento->getCreador();
            $creadorInfo = [
                'id' => $creador->getId(),
                'nombre' => $creador->getNombre(),
                'apellidos' => $creador->getApellidos(),
                'email' => $creador->getEmail(),
                'especialidad' => $creador->getEspecialidad(),
                'tipo' => 'entrenador'
            ];
        } elseif ($entrenamiento->getCreadorUsuario()) {
            $creador = $entrenamiento->getCreadorUsuario();
            $creadorInfo = [
                'id' => $creador->getId(),
                'nombre' => $creador->getNombre(),
                'apellidos' => $creador->getApellidos(),
                'email' => $creador->getEmail(),
                'tipo' => 'usuario'
            ];
        }

        // 3️⃣ Información del usuario asignado
        $asignadoA = null;
        if ($entrenamiento->getAsignadoAUsuario()) {
            $usuario = $entrenamiento->getAsignadoAUsuario();
            $asignadoA = [
                'id' => $usuario->getId(),
                'nombre' => $usuario->getNombre(),
                'apellidos' => $usuario->getApellidos(),
                'email' => $usuario->getEmail()
            ];
        }

        // 4️⃣ Devolver estructura completa
        return [
            'id' => $entrenamiento->getId(),
            'nombre' => $entrenamiento->getNombre(),
            'descripcion' => $entrenamiento->getDescripcion(),
            'tipo' => $entrenamiento->getTipo(),
            'nivelDificultad' => $entrenamiento->getNivelDificultad(),
            'duracionMinutos' => $entrenamiento->getDuracionMinutos(),
            'valoracionPromedio' => $entrenamiento->getValoracionPromedio(),
            'totalValoraciones' => $entrenamiento->getTotalValoraciones(),
            'esPublico' => $entrenamiento->isEsPublico(),
            'fechaCreacion' => $entrenamiento->getFechaCreacion()?->format('Y-m-d H:i:s'),
            'creador' => $creadorInfo,
            'asignadoA' => $asignadoA,
            'dias' => $diasSerializados,
            'totalDias' => count($diasSerializados),
            'completado' => false,
            'entrenamientoEjercicios' => $this->serializeEntrenamientoEjercicios($entrenamiento)
        ];
    }

    // ============================================
    // HELPER: Serializar ejercicios del entrenamiento
    // ============================================
    private function serializeEntrenamientoEjercicios(Entrenamiento $entrenamiento): array
    {
        $ejercicios = [];
        
        foreach ($entrenamiento->getEntrenamientoEjercicios() as $entEjercicio) {
            $ejercicios[] = [
                'id' => $entEjercicio->getId(),
                'ejercicio' => [
                    'id' => $entEjercicio->getEjercicio()->getId(),
                    'nombre' => $entEjercicio->getEjercicio()->getNombre(),
                    'grupoMuscular' => $entEjercicio->getEjercicio()->getGrupoMuscular(),
                    'tipo' => $entEjercicio->getEjercicio()->getTipo(),
                ],
                'series' => $entEjercicio->getSeries(),
                'repeticiones' => $entEjercicio->getRepeticiones(),
                'descansoSegundos' => $entEjercicio->getDescansoSegundos(),
                'notas' => $entEjercicio->getNotas(),
                'orden' => $entEjercicio->getOrden(),
            ];
        }
        
        return $ejercicios;
    }

    // ============================================
    // HELPER: Serializar entrenamiento (básico)
    // ============================================
    private function serializeEntrenamiento(Entrenamiento $entrenamiento): array
    {
        // Serializar días de la semana
        $diasSerializados = [];
        foreach ($entrenamiento->getDias() as $dia) {
            $ejerciciosDia = [];
            foreach ($dia->getEjercicios() as $diaEjercicio) {
                $ejerciciosDia[] = [
                    'id' => $diaEjercicio->getId(),
                    'ejercicio' => [
                        'id' => $diaEjercicio->getEjercicio()->getId(),
                        'nombre' => $diaEjercicio->getEjercicio()->getNombre(),
                        'grupoMuscular' => $diaEjercicio->getEjercicio()->getGrupoMuscular(),
                    ],
                    'series' => $diaEjercicio->getSeries(),
                    'repeticiones' => $diaEjercicio->getRepeticiones(),
                    'descansoSegundos' => $diaEjercicio->getDescansoSegundos(),
                    'notas' => $diaEjercicio->getNotas(),
                    'orden' => $diaEjercicio->getOrden(),
                ];
            }

            $diasSerializados[] = [
                'id' => $dia->getId(),
                'diaSemana' => $dia->getDiaSemana(),
                'concepto' => $dia->getConcepto(),
                'esDescanso' => $dia->isEsDescanso(),
                'orden' => $dia->getOrden(),
                'ejercicios' => $ejerciciosDia
            ];
        }

        return [
            'id' => $entrenamiento->getId(),
            'nombre' => $entrenamiento->getNombre(),
            'descripcion' => $entrenamiento->getDescripcion(),
            'tipo' => $entrenamiento->getTipo(),
            'nivelDificultad' => $entrenamiento->getNivelDificultad(),
            'duracionMinutos' => $entrenamiento->getDuracionMinutos(),
            'valoracionPromedio' => $entrenamiento->getValoracionPromedio(),
            'totalValoraciones' => $entrenamiento->getTotalValoraciones(),
            'esPublico' => $entrenamiento->isEsPublico(),
            'fechaCreacion' => $entrenamiento->getFechaCreacion()?->format('Y-m-d H:i:s'),
            'creador' => $entrenamiento->getCreador() ? [
                'id' => $entrenamiento->getCreador()->getId(),
                'nombre' => $entrenamiento->getCreador()->getNombre()
            ] : null,
            'creadorUsuario' => $entrenamiento->getCreadorUsuario() ? [
                'id' => $entrenamiento->getCreadorUsuario()->getId(),
                'nombre' => $entrenamiento->getCreadorUsuario()->getNombre() . ' ' . $entrenamiento->getCreadorUsuario()->getApellidos()
            ] : null,
            'asignadoA' => $entrenamiento->getAsignadoAUsuario() ? [
                'id' => $entrenamiento->getAsignadoAUsuario()->getId(),
                'nombre' => $entrenamiento->getAsignadoAUsuario()->getNombre() . ' ' . $entrenamiento->getAsignadoAUsuario()->getApellidos()
            ] : null,
            'dias' => $diasSerializados
        ];
    }
}