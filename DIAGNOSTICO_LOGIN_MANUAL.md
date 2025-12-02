# 🔍 DIAGNÓSTICO COMPLETO DEL LOGIN - GUÍA MANUAL

## 📋 Objetivo
Verificar cada componente del sistema de login paso a paso para identificar dónde está fallando.

---

## ✅ PASO 1: Verificar que el Backend está ejecutándose

### Comando:
```bash
# En una terminal nueva
cd c:\xampp\htdocs\ultimate-fitness
php -S localhost:8000 -t public
```

### ✅ Resultado esperado:
```
[Sun Dec  1 22:00:00 2025] PHP 8.x.x Development Server (http://localhost:8000) started
```

### ❌ Si falla:
- XAMPP debe estar iniciado
- El puerto 8000 no debe estar ocupado
- Verificar que `composer install` se haya ejecutado

---

## ✅ PASO 2: Verificar que el Frontend está ejecutándose

### Comando:
```bash
# En otra terminal
cd c:\xampp\htdocs\ultimate-fitness\frontend
npm run dev
```

### ✅ Resultado esperado:
```
VITE v... ready in ... ms
➜  Local:   http://localhost:5173/
```

### ❌ Si falla:
- Ejecutar `npm install` primero
- Verificar que Node.js esté instalado

---

## ✅ PASO 3: Verificar Conexión a Base de Datos

### Opción A: Desde MySQL Workbench o phpMyAdmin
1. Abrir phpMyAdmin: `http://localhost/phpmyadmin`
2. Usuario: `jose`
3. Password: `josefa`
4. Base de datos: `ultimatefitness_db`

### Opción B: Desde Terminal (si tienes mysql CLI)
```bash
mysql -h 127.0.0.1 -u jose -pjosefa ultimatefitness_db
```

### ✅ SQL para verificar entrenadores:
```sql
SELECT id, nombre, email, LEFT(password_hash, 60) as hash 
FROM entrenadores 
LIMIT 5;
```

### ✅ Resultado esperado:
Deberías ver una lista con 5 entrenadores y sus hashes empezando con `$2y$13$...`

---

## ✅ PASO 4: Verificar Hash de Laura García

### SQL:
```sql
SELECT 
    id,
    nombre,
    email,
    password_hash,
    activo,
    estado_aplicacion
FROM entrenadores 
WHERE email = 'laura.garcia@ultimate.com';
```

### ✅ Resultado esperado:
```
id: 2
nombre: Laura
email: laura.garcia@ultimate.com
password_hash: $2y$13$... (60 caracteres)
activo: 1
estado_aplicacion: aprobado
```

### ❌ Problemas posibles:
- Si `password_hash` es NULL → Hash no se guardó
- Si `activo` es 0 → Entrenador desactivado
- Si `estado_aplicacion` no es 'aprobado' → No puede hacer login

---

## ✅ PASO 5: Probar el Hash Manualmente con PHP

### Crear archivo: `test_password.php`
```php
<?php
$email = 'laura.garcia@ultimate.com';
$password = 'password123';

// Conectar a BD
$pdo = new PDO("mysql:host=127.0.0.1;dbname=ultimatefitness_db", "jose", "josefa");

// Obtener hash de Laura
$stmt = $pdo->prepare("SELECT password_hash FROM entrenadores WHERE email = ?");
$stmt->execute([$email]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);

if ($result) {
    $hash = $result['password_hash'];
    
    echo "Hash en BD: $hash\n\n";
    
    // Verificar password
    if (password_verify($password, $hash)) {
        echo "✅ PASSWORD CORRECTO - password123 FUNCIONA\n";
    } else {
        echo "❌ PASSWORD INCORRECTO - password123 NO FUNCIONA\n";
        echo "\nProbando si hay contraseña en texto plano...\n";
        if ($hash === $password) {
            echo "⚠️ ALERTA: La contraseña está guardada en TEXTO PLANO (muy inseguro)\n";
        }
    }
} else {
    echo "❌ ERROR: No se encontró el entrenador\n";
}
?>
```

### Ejecutar:
```bash
php test_password.php
```

### ✅ Resultado esperado:
```
✅ PASSWORD CORRECTO - password123 FUNCIONA
```

### ❌ Si dice "PASSWORD INCORRECTO":
El hash en la BD NO es para `password123`. Necesitas resetearlo.

---

## ✅ PASO 6: Probar el Endpoint de Login Directamente

### Opción A: Con PowerShell
```powershell
$body = @{
    email = "laura.garcia@ultimate.com"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/login" -Method POST -Body $body -ContentType "application/json" | Select-Object -ExpandProperty Content
```

### Opción B: Con curl (Git Bash o WSL)
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"laura.garcia@ultimate.com","password":"password123"}'
```

### ✅ Resultado esperado (200 OK):
```json
{
  "success": true,
  "message": "Login exitoso",
  "usuario": {
    "id": 2,
    "email": "laura.garcia@ultimate.com",
    "nombre": "Laura",
    "apellidos": "García Sánchez",
    "rol": "entrenador",
    "tipo_entidad": "entrenador"
  }
}
```

### ❌ Resultado error (401):
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

**Significa:** La contraseña en BD NO coincide con `password123`

---

## ✅ PASO 7: Verificar Logs del Backend

### En la terminal donde corre el backend PHP, deberías ver:
```
[Sun Dec  1 22:05:00 2025] [::1]:xxxxx [200]: POST /api/login
```

### ❌ Si ves error 500:
- Hay un error en el código PHP
- Revisar logs en `var/log/dev.log`

### ❌ Si no aparece NADA:
- El frontend no está enviando la petición al backend
- Verificar que la URL sea correcta: `http://localhost:8000/api/login`

---

## ✅ PASO 8: Verificar Consola del Navegador

### Abrir Chrome DevTools:
1. F12 o clic derecho → Inspeccionar
2. Ir a pestaña "Console"
3. Intentar login

### ✅ Deberías ver (en orden):
```javascript
Intentando login con: laura.garcia@ultimate.com
Respuesta del servidor: {success: true, usuario: {...}}
Login exitoso: {...}
```

### ❌ Si ves error 401:
```javascript
Error en login: AxiosError
Respuesta del servidor: {success: false, message: 'Credenciales inválidas'}
```

**Acción:** El problema está en el backend (contraseña incorrecta en BD)

### ❌ Si ves error CORS:
```
Access to XMLHttpRequest at 'http://localhost:8000/api/login' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Acción:** Verificar configuración CORS en `config/packages/nelmio_cors.yaml`

### ❌ Si ves "TypeError: Cannot read properties of undefined":
```javascript
TypeError: Cannot read properties of undefined (reading 'success')
```

**Acción:** El backend no está respondiendo o la respuesta no tiene el formato esperado

---

## ✅ PASO 9: Verificar Network en DevTools

### En Chrome DevTools:
1. Pestaña "Network"
2. Intentar login
3. Buscar la petición `login`
4. Click en ella

### Verificar:
- **Request URL:** `http://localhost:8000/api/login`
- **Request Method:** `POST`
- **Status Code:** 
  - ✅ `200 OK` → Login exitoso
  - ❌ `401 Unauthorized` → Credenciales incorrectas
  - ❌ `500 Internal Server Error` → Error en el código
  
### Request Payload debe ser:
```json
{
  "email": "laura.garcia@ultimate.com",
  "password": "password123"
}
```

### Response (si es 200):
```json
{
  "success": true,
  "message": "Login exitoso",
  "usuario": { ... }
}
```

---

## 🔧 SOLUCIÓN: Resetear Contraseña Manualmente

### Si NADA de lo anterior funciona, resetea la contraseña desde SQL:

### Paso 1: Generar hash nuevo
Ejecuta este PHP:
```php
<?php
echo password_hash('password123', PASSWORD_BCRYPT, ['cost' => 13]);
?>
```

Copia el hash resultante (ejemplo: `$2y$13$ABC123...`)

### Paso 2: Actualizar en BD
```sql
UPDATE entrenadores 
SET password_hash = '$2y$13$ABC123...'  -- Pegar el hash aquí
WHERE email = 'laura.garcia@ultimate.com';
```

### Paso 3: Verificar
```sql
SELECT email, LEFT(password_hash, 20) 
FROM entrenadores 
WHERE email = 'laura.garcia@ultimate.com';
```

---

## 📊 Checklist de Diagnóstico

Marca cada paso conforme lo vayas completando:

```
[ ] 1. Backend PHP corriendo en localhost:8000
[ ] 2. Frontend Vite corriendo en localhost:5173  
[ ] 3. Conexión a BD funciona (jose/josefa)
[ ] 4. Laura García existe en tabla entrenadores
[ ] 5. password_hash NO es NULL
[ ] 6. activo = 1
[ ] 7. estado_aplicacion = 'aprobado'
[ ] 8. test_password.php dice "PASSWORD CORRECTO"
[ ] 9. Endpoint /api/login responde 200 OK con curl/PowerShell
[ ] 10. Consola del navegador muestra "Login exitoso"
[ ] 11. Network muestra Status 200
[ ] 12. No hay errores CORS
```

### Si TODOS están ✅ pero sigue sin funcionar:

Probablemente el problema esté en:
- **AuthContext.jsx** - No está guardando el usuario correctamente
- **Navegación** - La redirección a `/dashboard` falla
- **localStorage** - No se está guardando la sesión

---

## 🆘 Comandos de Emergencia

### Resetear TODAS las contraseñas de entrenadores:
```bash
php fix_entrenador_login.php
```

### Ver logs del backend:
```bash
tail -f var/log/dev.log
```

### Limpiar caché de Symfony:
```bash
php bin/console cache:clear
```

### Ver qué hay en localStorage (Consola del navegador):
```javascript
console.log(localStorage.getItem('usuario'));
```

---

## 📞 Próximos Pasos

1. Ejecuta el checklist en orden
2. Anota en qué paso falla
3. Comparte el resultado conmigo indicando:
   - ✅ Qué pasos pasaron
   - ❌ En qué paso falló
   - 📋 El mensaje de error exacto

Así podré darte una solución más específica.

---

**Creado:** 2025-12-01  
**Versión:** 1.0
