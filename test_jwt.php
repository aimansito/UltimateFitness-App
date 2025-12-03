<?php
/**
 * Script de prueba para JWT
 * Ejecutar: php test_jwt.php
 */

// Test 1: Login
echo "===========================================\n";
echo "TEST 1: LOGIN\n";
echo "===========================================\n\n";

$loginData = [
    'email' => 'teresa.sanchez@example.com',
    'password' => 'password123'
];

$ch = curl_init('http://localhost:8000/api/login');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n\n";

$responseData = json_decode($response, true);

if (!isset($responseData['token'])) {
    echo "❌ ERROR: No se generó token\n";
    echo "✋ FIN DEL TEST - No se puede continuar sin token\n";
    exit(1);
}

$token = $responseData['token'];
echo "✅ Token generado exitosamente\n";
echo "Token (primeros 50 caracteres): " . substr($token, 0, 50) . "...\n\n";

// Test 2: Debug JWT
echo "\n===========================================\n";
echo "TEST 2: DEBUG JWT\n";
echo "===========================================\n\n";

$ch = curl_init('http://localhost:8000/api/debug/jwt');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: " . json_encode(json_decode($response), JSON_PRETTY_PRINT) . "\n\n";

// Test 3: Mis Dietas
echo "\n===========================================\n";
echo "TEST 3: MIS DIETAS (Usuario ID: 12)\n";
echo "===========================================\n\n";

$ch = curl_init('http://localhost:8000/api/usuario/mis-dietas/12');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";

if ($httpCode === 200) {
    echo "✅ ÉXITO: Mis Dietas funciona correctamente\n";
    $data = json_decode($response, true);
    echo "Total dietas asignadas: " . ($data['totalAsignadas'] ?? 0) . "\n";
    echo "Total dietas creadas: " . ($data['totalCreadas'] ?? 0) . "\n";
} else {
    echo "❌ ERROR: " . $httpCode . "\n";
    echo "Response: $response\n";
}

echo "\n===========================================\n";
echo "FIN DE LOS TESTS\n";
echo "===========================================\n";
