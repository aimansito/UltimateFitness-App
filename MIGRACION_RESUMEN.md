# Resumen del Trabajo de Migración DB

## ✅ Completado Exitosamente

### 1. Entidad DietaPlato Creada
- **Archivo**: `src/Entity/DietaPlato.php` ✅
- **Repositorio**: `src/Repository/DietaPlatoRepository.php` ✅
- Mapea la tabla `dieta_platos` de tu SQL dump
- Incluye todos los campos: `dieta_id`, `plato_id`, `dia_semana`, `tipo_comida`, `orden`, `notas`

### 2. Entidad Dieta Actualizada  
- **Archivo**: `src/Entity/Dieta.php` ✅
- Añadido campo `asignadoAUsuario` con relación a `Usuario`
- Reemplazada colección `dietaAlimentos` con `dietaPlatos`
- Métodos `addDietaPlato()` / `removeDietaPlato()` implementados

## ⚠️ Requiere Edición Manual

Debido a problemas de corrupción de archivos con las ediciones automáticas, estos archivos necesitan 3 cambios pequeños each:

### Usuario.php - 3 Cambios Manuales

Ver archivo: `USUARIO_MANUAL_UPDATE.md` para instrucciones detalladas.

**Resumen**:
1. Añadir campo `dietasAsignadas` después de línea 126
2. Inicializar en constructor (línea 134)
3. Añadir métodos getter/add/remove después de línea 526

### Plato.php - 3 Cambios Manuales

**Cambio 1** (líneas 109-111):
```php
// Cambiar de:
#[ORM\OneToMany(mappedBy: 'plato', targetEntity: DietaAlimento::class)]
private Collection $dietaAlimentos;

// A:
#[ORM\OneToMany(targetEntity: DietaPlato::class, mappedBy: 'plato')]
private Collection $dietaPlatos;
```

**Cambio 2** (línea 115):
```php
// Cambiar de:
$this->dietaAlimentos = new ArrayCollection();

// A:
$this->dietaPlatos = new ArrayCollection();
```

**Cambio 3** (líneas 337-340):
```php
// Cambiar de:
public function getDietaAlimentos(): Collection
{
    return $this->dietaAlimentos;
}

// A:
public function getDietaPlatos(): Collection
{
    return $this->dietaPlatos;
}
```

## 📋 Próximos Pasos Después de Ediciones Manuales

1. **Actualizar DietaController.php**
   - Reemplazar `use App\Entity\DietaAlimento;` con `use App\Entity\DietaPlato;`
   - En  `crearDieta()` (líneas 111-154):
     - Crear instancias de `DietaPlato` en lugar de `DietaAlimento`
     - Eliminar el HACK del `alimentoDummy`
     - Soportar campo opcional `asignado_a_usuario_id`
   
2. **Crear Endpoint de Asignación de Dietas**
   - Ruta: `POST /api/dietas/{id}/asignar`
   - Parámetros: `{usuario_id: number}`
   - Validar que el usuario es premium
   - Set `dieta->setAsignadoAUsuario($usuario)`

3. **Validar Schema de Doctrine**
   ```bash
   php bin/console doctrine:schema:validate
   ```

4. **Probar Creación de Dietas**
   - Usar Postman/Insomnia para crear una dieta con platos
   - Verificar en BD table `dieta_platos`
   - Verificar que `asignado_a_usuario_id` se guarda correctamente

## 📁 Archivos Creados/Modificados

### ✅ Creados
- `src/Entity/DietaPlato.php`
- `src/Repository/DietaPlatoRepository.php`
- `USUARIO_MANUAL_UPDATE.md` (instrucciones)

### ✅ Modificados
- `src/Entity/Dieta.php` (completo)

### ⏳ Pendientes (edición manual)
- `src/Entity/Usuario.php` (3 cambios pequeños)
- `src/Entity/Plato.php` (3 cambios pequeños)

### ⏳ Pendientes (después de manual)
- `src/Controller/DietaController.php`
- Nuevo endpoint para asignar dietas

