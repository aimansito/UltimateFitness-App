<?php
require __DIR__.'/vendor/autoload.php';

use Doctrine\DBAL\DriverManager;

// Conectar a BD
$connectionParams = [
    'dbname' => 'ultimatefitness_db',
    'user' => 'jose',
    'password' => 'josefa',
    'host' => '127.0.0.1',
    'driver' => 'pdo_mysql',
];

$conn = DriverManager::getConnection($connectionParams);

// Obtener hash de Laura
$sql = "SELECT password_hash FROM entrenadores WHERE email = 'laura.garcia@ultimate.com'";
$result = $conn->fetchAssociative($sql);

if ($result) {
    $hash = $result['password_hash'];
    
    echo "Hash en BD: $hash\n";
    echo "Longitud: " . strlen($hash) . "\n\n";
    
    // Probar diferentes contraseñas
    $passwords = ['laura', 'password', 'password123', 'Laura', 'LAURA'];
    
    foreach ($passwords as $pass) {
        $verify = password_verify($pass, $hash);
        echo ($verify ? '✅' : '❌') . " password_verify('$pass', hash) = " . ($verify ? 'TRUE' : 'FALSE') . "\n";
    }
    
} else {
    echo "❌ No se encontró el entrenador\n";
}