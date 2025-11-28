<?php

require __DIR__ . '/vendor/autoload.php';

use Symfony\Component\Dotenv\Dotenv;

$dotenv = new Dotenv();
$dotenv->load(__DIR__ . '/.env');

$databaseUrl = $_ENV['DATABASE_URL'];

// Parse database URL manually since we don't have the full Symfony stack here easily
// mysql://jose:josefa@127.0.0.1:3306/ultimatefitness_db?serverVersion=8.0&charset=utf8mb4
$parts = parse_url($databaseUrl);

$host = $parts['host'];
$port = $parts['port'] ?? 3306;
$user = $parts['user'];
$pass = $parts['pass'];
$db = ltrim($parts['path'], '/');
$query = $parts['query'] ?? '';
parse_str($query, $queryParams);
$charset = $queryParams['charset'] ?? 'utf8mb4';

echo "Connecting to $host:$port DB: $db User: $user Charset: $charset\n";

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Search for the user from the screenshot
    $stmt = $pdo->query("SELECT id, nombre, apellidos FROM usuarios WHERE nombre = 'Juan' OR apellidos LIKE '%rez%' LIMIT 1");
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo "Found User ID: " . $user['id'] . "\n";
        echo "Nombre: " . $user['nombre'] . "\n";
        echo "Apellidos: " . $user['apellidos'] . "\n";
        
        echo "Hex Dump (Apellidos):\n";
        foreach (str_split($user['apellidos']) as $char) {
            echo dechex(ord($char)) . " ";
        }
        echo "\n";
    } else {
        echo "User not found.\n";
    }

} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
