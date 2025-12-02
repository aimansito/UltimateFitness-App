<?php
// Script para verificar si la contraseña funciona
$email = 'laura.garcia@ultimate.com';
$password = 'password123';

echo "\n==========================================\n";
echo "TEST DE CONTRASEÑA\n";
echo "==========================================\n\n";

try {
    // Conectar a BD
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=ultimatefitness_db", "jose", "josefa");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Obtener hash de Laura
    $stmt = $pdo->prepare("SELECT id, nombre, email, password_hash, activo, estado_aplicacion FROM entrenadores WHERE email = ?");
    $stmt->execute([$email]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        echo "📧 Entrenador: {$result['nombre']} ({$result['email']})\n";
        echo "🆔 ID: {$result['id']}\n";
        echo "📊 Activo: " . ($result['activo'] ? '✅ SÍ' : '❌ NO') . "\n";
        echo "📋 Estado: {$result['estado_aplicacion']}\n";
        echo "🔑 Hash (primeros 40 caracteres): " . substr($result['password_hash'], 0, 40) . "...\n\n";
        
        // Verificar si el entrenador puede hacer login
        if (!$result['activo']) {
            echo "⚠️ PROBLEMA: El entrenador está DESACTIVADO\n";
            echo "   Solución: UPDATE entrenadores SET activo = 1 WHERE email = '$email';\n\n";
        }
        
        if ($result['estado_aplicacion'] !== 'aprobado') {
            echo "⚠️ PROBLEMA: El entrenador NO está aprobado (estado: {$result['estado_aplicacion']})\n";
            echo "   Solución: UPDATE entrenadores SET estado_aplicacion = 'aprobado' WHERE email = '$email';\n\n";
        }
        
        $hash = $result['password_hash'];
        
        // Verificar password
        echo "🧪 Probando contraseña: '$password'\n";
        if (password_verify($password, $hash)) {
            echo "✅✅✅ PASSWORD CORRECTO ✅✅✅\n";
            echo "\nLa contraseña 'password123' FUNCIONA con este usuario.\n";
            echo "El problema NO es la contraseña.\n\n";
            echo "Verifica:\n";
            echo "  1. Que el backend esté corriendo en localhost:8000\n";
            echo "  2. Que el frontend esté corriendo en localhost:5173\n";
            echo "  3. Que no haya errores CORS en la consola del navegador\n";
        } else {
            echo "❌❌❌ PASSWORD INCORRECTO ❌❌❌\n\n";
            echo "La contraseña 'password123' NO FUNCIONA con el hash en la BD.\n";
            echo "El hash en la base de datos es para otra contraseña.\n\n";
            
            // Generar nuevo hash
            echo "🔄 Generando nuevo hash para 'password123'...\n";
            $newHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 13]);
            echo "✅ Nuevo hash generado.\n\n";
            
            echo "📝 Para arreglarlo, ejecuta este SQL:\n";
            echo "----------------------------------------\n";
            echo "UPDATE entrenadores \n";
            echo "SET password_hash = '$newHash' \n";
            echo "WHERE email = '$email';\n";
            echo "----------------------------------------\n\n";
            
            // Preguntar si quiere actualizar automáticamente
            echo "¿Quieres actualizar la contraseña AHORA? (s/n): ";
            $handle = fopen("php://stdin", "r");
            $line = fgets($handle);
            $respuesta = trim($line);
            
            if (strtolower($respuesta) === 's' || strtolower($respuesta) === 'si') {
                $updateStmt = $pdo->prepare("UPDATE entrenadores SET password_hash = ? WHERE email = ?");
                $updateStmt->execute([$newHash, $email]);
                
                echo "\n✅ ¡Contraseña actualizada!\n";
                echo "Ahora puedes iniciar sesión con:\n";
                echo "  📧 Email: $email\n";
                echo "  🔑 Password: $password\n";
            } else {
                echo "\n⏭️ No se actualizó la contraseña. Copia el SQL de arriba y ejecútalo manualmente.\n";
            }
        }
        
    } else {
        echo "❌ ERROR: No se encontró el entrenador con email '$email'\n\n";
        echo "Verifica:\n";
        echo "  1. Que el email sea correcto\n";
        echo "  2. Que la tabla 'entrenadores' exista\n";
        echo "  3. Que haya datos en la tabla: SELECT COUNT(*) FROM entrenadores;\n";
    }
    
} catch(PDOException $e) {
    echo "❌ Error de conexión a la base de datos:\n";
    echo $e->getMessage() . "\n\n";
    echo "Verifica:\n";
    echo "  1. Que MySQL esté corriendo\n";
    echo "  2. Usuario: jose\n";
    echo "  3. Password: josefa\n";
    echo "  4. Base de datos: ultimatefitness_db\n";
    echo "  5. Host: 127.0.0.1:3306\n";
}

echo "\n==========================================\n\n";
?>
