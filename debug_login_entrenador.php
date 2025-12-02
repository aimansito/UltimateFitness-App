<?php
// Script temporal para debuggear y arreglar login de entrenadores

require_once __DIR__ . '/vendor/autoload.php';

use Doctrine\DBAL\DriverManager;

// Conexión a la base de datos
$connectionParams = [
    'dbname' => 'ultimatefitness_db',
    'user' => 'root',
    'password' => '',
    'host' => 'localhost',
    'driver' => 'pdo_mysql',
];

try {
    $conn = DriverManager::getConnection($connectionParams);
    
    echоPrint("\n==========================================\n");
    echo "DEBUG LOGIN ENTRENADORES\n";
    echo "==========================================\n\n";
    
    // 1. Ver el hash actual de Laura
    $sql = "SELECT id, nombre, email, password_hash FROM entrenadores WHERE email = 'laura.garcia@ultimate.com'";
    $result = $conn->fetchAssociative($sql);
    
    if ($result) {
        echo "📧 Entrenador: {$result['nombre']} ({$result['email']})\n";
        echo "🔑 Hash actual: {$result['password_hash']}\n\n";
        
        // 2. Generar nuevo hash con password123
        $newPassword = 'password123';
        $newHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 13]);
        
        echo "🔄 Generando nuevo hash para: $newPassword\n";
        echo "✅ Nuevo hash: $newHash\n\n";
        
        // 3. Verificar que el hash funciona
        $verify = password_verify($newPassword, $newHash);
        echo "🧪 Verificación del nuevo hash: " . ($verify ? '✅ VÁLIDO' : '❌ INVÁLIDO') . "\n\n";
        
        // 4. Verificar el hash actual con password123
        $verifyOld = password_verify($newPassword, $result['password_hash']);
        echo "🧪 Verificación del hash ACTUAL en BD con '$newPassword': " . ($verifyOld ? '✅ VÁLIDO' : '❌ INVÁLIDO') . "\n\n";
        
        // 5. Actualizar en la base de datos
        $updateSql = "UPDATE entrenadores SET password_hash = ? WHERE email = ?";
        $affectedRows = $conn->executeStatement($updateSql, [$newHash, 'laura.garcia@ultimate.com']);
        
        if ($affectedRows > 0) {
            echo "💾 ✅ Contraseña actualizada exitosamente en la base de datos\n";
            echo "📝 Email: laura.garcia@ultimate.com\n";
            echo "🔑 Password: password123\n\n";
            
            // 6. Verificar que quedó bien guardado
            $sqlVerify = "SELECT password_hash FROM entrenadores WHERE email = 'laura.garcia@ultimate.com'";
            $resultVerify = $conn->fetchAssociative($sqlVerify);
            $finalVerify = password_verify($newPassword, $resultVerify['password_hash']);
            
            echo "🔍 Verificación final: " . ($finalVerify ? '✅ FUNCIONA' : '❌ ERROR') . "\n";
        } else {
            echo "❌ Error: No se pudo actualizar la contraseña\n";
        }
        
    } else {
        echo "❌ No se encontró el entrenador con email laura.garcia@ultimate.com\n";
    }
    
    echo "\n==========================================\n";
    echo "ACTUALIZAR TODOS LOS ENTRENADORES\n";
    echo "==========================================\n\n";
    
    // Actualizar TODOS los entrenadores
    $allTrainers = $conn->fetchAllAssociative("SELECT id, nombre, email FROM entrenadores");
    
    foreach ($allTrainers as $trainer) {
        $newHash = password_hash('password123', PASSWORD_BCRYPT, ['cost' => 13]);
        $conn->executeStatement(
            "UPDATE entrenadores SET password_hash = ? WHERE id = ?",
            [$newHash, $trainer['id']]
        );
        echo "✅ {$trainer['nombre']} ({$trainer['email']}) -> password123\n";
    }
    
    echo "\n✅ COMPLETADO: Todos los entrenadores ahora tienen la contraseña: password123\n\n";
    
} catch (\Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
}
