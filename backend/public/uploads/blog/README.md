# Sistema de Upload de Imágenes para Blog

## 📁 Estructura
Las imágenes del blog se guardan en:
```
backend/public/uploads/blog/
```

## 🚀 Endpoints Disponibles

### 1. **Subir Imagen**
```
POST /api/blog/upload-image
```
- **Requiere**: Rol ADMIN
- **Content-Type**: multipart/form-data
- **Parámetro**: `image` (archivo)
- **Formatos aceptados**: JPEG, PNG, GIF, WEBP
- **Tamaño máximo**: 5MB

**Respuesta exitosa**:
```json
{
  "success": true,
  "imagen_url": "/uploads/blog/nombre-archivo-unique123.jpg",
  "filename": "nombre-archivo-unique123.jpg"
}
```

### 2. **Crear Post**
```
POST /api/blog/posts
```
- **Requiere**: Rol ADMIN
- **Content-Type**: application/json

**Ejemplo de request**:
```json
{
  "titulo": "Mi primer post",
  "contenido": "Contenido completo del post...",
  "extracto": "Resumen breve del post",
  "imagen_portada": "/uploads/blog/imagen.jpg",
  "categoria": "nutricion",
  "es_premium": false,
  "destacado": true,
  "publicar_ahora": true
}
```

### 3. **Actualizar Post**
```
PUT /api/blog/posts/{id}
```
- **Requiere**: Rol ADMIN
- **Content-Type**: application/json

### 4. **Eliminar Post**
```
DELETE /api/blog/posts/{id}
```
- **Requiere**: Rol ADMIN
- **Nota**: También elimina la imagen del servidor

## 📝 Flujo de Trabajo Recomendado

1. **Subir la imagen primero**:
   ```javascript
   const formData = new FormData();
   formData.append('image', file);
   
   const response = await api.post('/api/blog/upload-image', formData);
   const imagenUrl = response.data.imagen_url;
   ```

2. **Crear el post con la URL de la imagen**:
   ```javascript
   const postData = {
     titulo: "Mi Post",
     contenido: "...",
     imagen_portada: imagenUrl,
     // ...otros campos
   };
   
   await api.post('/api/blog/posts', postData);
   ```

## 🔒 Seguridad

- ✅ Solo usuarios con rol `ROLE_ADMIN` pueden subir imágenes
- ✅ Validación de tipo de archivo
- ✅ Validación de tamaño máximo (5MB)
- ✅ Nombres de archivo únicos (con uniqid())
- ✅ Slugging de nombres para evitar caracteres especiales

## ⚙️ Configuración

El directorio se crea automáticamente si no existe.
Permisos recomendados: `0777` (ya configurado)
