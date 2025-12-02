<?php
require 'vendor/autoload.php';

use App\Kernel;
use App\Entity\Ejercicio;
use Symfony\Component\Dotenv\Dotenv;

(new Dotenv())->bootEnv(__DIR__.'/.env');

$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$kernel->boot();

$container = $kernel->getContainer();
$entityManager = $container->get('doctrine')->getManager();

$ejercicios = $entityManager->getRepository(Ejercicio::class)->findAll();

echo "Total ejercicios: " . count($ejercicios) . "\n";
foreach ($ejercicios as $ej) {
    echo "- " . $ej->getNombre() . " (" . $ej->getGrupoMuscular() . ")\n";
}
