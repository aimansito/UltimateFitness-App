<?php
try {
    // Datos de conexión
    $host = 'gateway01.eu-central-1.prod.aws.tidbcloud.com';
    $port = 4000;
    $dbname = 'test';
    $user = '3CoeWriZw3FbSex.root';
    $password = 'G2QgyvEbfKu7D432';

    // DSN
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname";

    // Opciones para SSL - Importante para TiDB
    $options = [
        PDO::MYSQL_ATTR_SSL_CA => true, // Intentar usar default CA
        PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false // Desactivar verificación estricta para probar
    ];

    echo "Intentando conectar a TiDB Cloud...\n";
    $pdo = new PDO($dsn, $user, $password, $options);
    
    echo "¡CONEXIÓN EXITOSA! ✅\n";
    
    // Probar una consulta
    $stmt = $pdo->query("SELECT VERSION()");
    $version = $stmt->fetchColumn();
    echo "Versión del servidor: $version\n";

} catch (PDOException $e) {
    echo "❌ ERROR DE CONEXIÓN:\n";
    echo $e->getMessage() . "\n";
}
