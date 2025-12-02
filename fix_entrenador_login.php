<?php
// Script simple para resetear contraseña de Laura García

$servername = "127.0.0.1";
$username = "jose";
$password = "josefa";
$dbname = "ultimatefitness_db";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "\n==========================================\n";
    echo "RESETEO DE CONTRASEÑAS - ENTRENADORES\n";
    echo "==========================================\n\n";
    
    // Verificar hash actual de Laura
    $stmt = $pdo->prepare("SELECT id, nombre, email, password_hash FROM entrenadores WHERE email = 'laura.garcia@ultimate.com'");
    $stmt->execute();
    $laura = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($laura) {
        echo "📧 Entrenador encontrado: {$laura['nombre']} ({$laura['email']})\n";
        echo "🔑 Hash actual (primeros 60 caracteres): " . substr($laura['password_hash'], 0, 60) . "\n\n";
        
        // Probar password123 con el hash actual
        $testPassword = 'password123';
        $verifyOld = password_verify($testPassword, $laura['password_hash']);
        echo "🧪 ¿Funciona '$testPassword' con el hash actual? " . ($verifyOld ? '✅ SÍ' : '❌ NO') . "\n\n";
        
        if (!$verifyOld) {
            echo "⚠️ La contraseña NO funciona. Generando nuevo hash...\n\n";
            
            // Generar nuevo hash
            $newHash = password_hash($testPassword, PASSWORD_BCRYPT, ['cost' => 13]);
            echo "✅ Nuevo hash generado\n";
            
            // Verificar que el nuevo hash funciona
            $verifyNew = password_verify($testPassword, $newHash);
            echo "🧪 Verificación del nuevo hash: " . ($verifyNew ? '✅ VÁLIDO' : '❌ INVÁLIDO') . "\n\n";
            
            // Actualizar en BD
            $updateStmt = $pdo->prepare("UPDATE entrenadores SET password_hash = ? WHERE email = ?");
            $updateStmt->execute([$newHash, 'laura.garcia@ultimate.com']);
            
            echo "💾 ✅ Contraseña actualizada en la base de datos\n\n";
        } else {
            echo "✅ La contraseña YA funciona correctamente\n\n";
        }
    } else {
        echo "❌ No se encontró laura.garcia@ultimate.com\n\n";
    }
    
    echo "==========================================\n";
    echo "ACTUALIZANDO TODOS LOS ENTRENADORES\n";
    echo "==========================================\n\n";
    
    // Actualizar todos los entrenadores
    $stmt = $pdo->query("SELECT id, nombre, email FROM entrenadores");
    $entrenadores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($entrenadores as $entrenador) {
        $newHash = password_hash('password123', PASSWORD_BCRYPT, ['cost' => 13]);
        $updateStmt = $pdo->prepare("UPDATE entrenadores SET password_hash = ? WHERE id = ?");
        $updateStmt->execute([$newHash, $entrenador['id']]);
        
        echo "✅ {$entrenador['nombre']} ({$entrenador['email']}) -> password: password123\n";
    }
    
    echo "\n✅ ✅ ✅ COMPLETADO\n";
    echo "==========================================\n";
    echo "Ahora puedes iniciar sesión con:\n";
    echo "  📧 Email: laura.garcia@ultimate.com\n";
    echo "  🔑 Password: password123\n";
    echo "==========================================\n\n";
    
} catch(PDOException $e) {
    echo "❌ Error de conexión: " . $e->getMessage() . "\n";
}
?>
