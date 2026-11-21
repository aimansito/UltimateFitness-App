<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Ejercicios de pierna y glúteo que faltaban en el catálogo oficial.
 * Solo inserta los que no existan ya con ese nombre (la comparación no distingue
 * mayúsculas ni tildes), así que se puede aplicar sobre cualquier base sin duplicar.
 */
final class Version20261121100000 extends AbstractMigration
{
    // nombre => [tipo, grupo muscular, nivel, descripción]
    private const EJERCICIOS = [
        // Gemelos
        'Elevación de Talones de Pie' => ['aislamiento', 'piernas', 'principiante', 'Gemelo en máquina de pie: sube hasta ponerte de puntillas, aprieta un segundo arriba y baja hasta notar el estiramiento.'],
        'Elevación de Talones Sentado' => ['aislamiento', 'piernas', 'principiante', 'Gemelo en máquina sentada con las rodillas flexionadas; trabaja sobre todo el sóleo. Recorrido completo y bajada lenta.'],
        'Gemelos en Prensa' => ['aislamiento', 'piernas', 'principiante', 'En la prensa, apoya solo la punta de los pies en el borde de la plataforma con las piernas casi estiradas y empuja con los tobillos.'],
        'Gemelos a Una Pierna con Mancuerna' => ['aislamiento', 'piernas', 'principiante', 'De pie sobre un escalón con una pierna y la mancuerna en la mano del mismo lado. Baja el talón por debajo del escalón y sube de puntillas.'],
        'Gemelos de Pie en Multipower' => ['aislamiento', 'piernas', 'intermedio', 'Con la barra del multipower sobre los trapecios y las puntas sobre un disco, sube de puntillas y baja controlando.'],
        // Cuádriceps
        'Sentadilla Hack' => ['compuesto', 'piernas', 'intermedio', 'Sentadilla guiada en máquina hack con la espalda apoyada. Baja hasta romper el paralelo y empuja con todo el pie sin bloquear las rodillas.'],
        'Prensa de Pierna' => ['compuesto', 'piernas', 'principiante', 'Pies a la anchura de la cadera en el centro de la plataforma. Baja hasta 90 grados sin despegar la zona lumbar del respaldo y empuja sin bloquear.'],
        'Extensión de Cuádriceps' => ['aislamiento', 'piernas', 'principiante', 'Sentado en la máquina con el rodillo sobre los tobillos, estira las piernas del todo, aprieta un segundo y baja despacio.'],
        'Sentadilla Libre con Barra' => ['compuesto', 'piernas', 'intermedio', 'Barra sobre los trapecios, pies a la anchura de los hombros. Baja con el pecho alto y las rodillas siguiendo la línea de los pies hasta romper el paralelo.'],
        'Sentadilla Búlgara' => ['compuesto', 'piernas', 'intermedio', 'Pie trasero apoyado en un banco y el delantero adelantado. Baja en vertical hasta que la rodilla trasera casi toque el suelo y sube con la pierna de delante.'],
        // Femoral
        'Peso Muerto Rumano' => ['compuesto', 'piernas', 'intermedio', 'Rodillas ligeramente flexionadas, lleva la cadera atrás bajando la barra pegada a las piernas hasta notar el estiramiento del femoral. Sube apretando glúteos.'],
        'Peso Muerto Rumano con Mancuernas' => ['compuesto', 'piernas', 'principiante', 'Igual que con barra, con una mancuerna en cada mano delante de los muslos. Espalda neutra y bajada lenta.'],
        'Curl Femoral Unilateral de Pie' => ['aislamiento', 'piernas', 'principiante', 'En la máquina de pie o en polea, flexiona una pierna llevando el talón al glúteo sin mover la cadera. Baja controlando y cambia de pierna.'],
        'Curl Femoral Unilateral Tumbado' => ['aislamiento', 'piernas', 'principiante', 'Tumbado en la máquina de curl femoral, trabaja una pierna cada vez para igualar la fuerza de ambos lados.'],
        'Curl Femoral Sentado' => ['aislamiento', 'piernas', 'principiante', 'En la máquina sentada con el rodillo bajo los tobillos, lleva los talones hacia atrás y abajo y vuelve despacio.'],
        // Glúteo
        'Patada de Glúteo en Polea' => ['aislamiento', 'gluteos', 'principiante', 'Tobillera en la polea baja. Con el tronco algo inclinado, lleva la pierna atrás estirando la cadera y aprieta el glúteo arriba.'],
        'Patada de Glúteo en Máquina' => ['aislamiento', 'gluteos', 'principiante', 'En la máquina de patada de glúteo, empuja la plataforma hacia atrás con el talón sin arquear la zona lumbar.'],
        'Patada de Glúteo a Cuatro Patas' => ['aislamiento', 'gluteos', 'principiante', 'En cuadrupedia, eleva una pierna con la rodilla flexionada a 90 grados hasta la altura de la cadera. Se puede añadir goma o tobillera.'],
    ];

    public function getDescription(): string
    {
        return 'Ejercicios de gemelo, cuádriceps, femoral y glúteo que faltaban en el catálogo';
    }

    public function up(Schema $schema): void
    {
        foreach (self::EJERCICIOS as $nombre => [$tipo, $grupo, $nivel, $desc]) {
            $this->addSql(
                'INSERT INTO ejercicios (nombre, tipo, grupo_muscular, nivel_dificultad, descripcion, valoracion_promedio, total_valoraciones)
                 SELECT ?, ?, ?, ?, ?, 0, 0 FROM DUAL
                 WHERE NOT EXISTS (SELECT 1 FROM ejercicios WHERE creador_usuario_id IS NULL AND LOWER(nombre) IN (LOWER(?), LOWER(?)))',
                [$nombre, $tipo, $grupo, $nivel, $desc, $nombre, self::sinTildes($nombre)]
            );
        }
    }

    /** Por si la base compara con distinción de tildes (algunos nombres antiguos van sin ellas) */
    private static function sinTildes(string $t): string
    {
        return strtr($t, ['á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'Á' => 'A', 'É' => 'E', 'Í' => 'I', 'Ó' => 'O', 'Ú' => 'U']);
    }

    public function down(Schema $schema): void
    {
        // No se borran: pueden estar ya usados en rutinas
    }
}
