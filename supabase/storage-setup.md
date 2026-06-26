# Supabase Storage — Configuración de Buckets

Crear los siguientes buckets desde el [Dashboard de Supabase](https://supabase.com/dashboard) → Storage → Create bucket.

---

## Bucket: `article-headers`

| Propiedad       | Valor                          |
|-----------------|--------------------------------|
| **Nombre**      | `article-headers`              |
| **Público**     | ✅ Sí                          |
| **Uso**         | Imagen de encabezado de cada artículo |

### Política de acceso recomendada

```sql
-- Permitir lectura pública
CREATE POLICY "article_headers_select_public"
ON storage.objects FOR SELECT
USING (bucket_id = 'article-headers');

-- Solo autores autenticados pueden subir/actualizar/eliminar
CREATE POLICY "article_headers_insert_auth"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'article-headers'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "article_headers_update_auth"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'article-headers'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "article_headers_delete_auth"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'article-headers'
  AND auth.role() = 'authenticated'
);
```

---

## Bucket: `article-body-images`

| Propiedad       | Valor                              |
|-----------------|------------------------------------|
| **Nombre**      | `article-body-images`              |
| **Público**     | ✅ Sí                              |
| **Uso**         | Imágenes insertadas en el cuerpo del artículo (editor rich text) |

### Política de acceso recomendada

```sql
-- Permitir lectura pública
CREATE POLICY "article_body_images_select_public"
ON storage.objects FOR SELECT
USING (bucket_id = 'article-body-images');

-- Solo autores autenticados pueden subir/actualizar/eliminar
CREATE POLICY "article_body_images_insert_auth"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'article-body-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "article_body_images_update_auth"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'article-body-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "article_body_images_delete_auth"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'article-body-images'
  AND auth.role() = 'authenticated'
);
```

---

## Bucket: `author-photos`

| Propiedad       | Valor                          |
|-----------------|--------------------------------|
| **Nombre**      | `author-photos`                |
| **Público**     | ✅ Sí                          |
| **Uso**         | Fotos de perfil de los autores |

### Política de acceso recomendada

```sql
-- Permitir lectura pública
CREATE POLICY "author_photos_select_public"
ON storage.objects FOR SELECT
USING (bucket_id = 'author-photos');

-- Solo el autor dueño de la foto puede subir/actualizar/eliminar
-- Se asume que el path sigue el patrón: {author_id}/{filename}
CREATE POLICY "author_photos_insert_own"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'author-photos'
  AND auth.role() = 'authenticated'
  AND SPLIT_PART(name, '/', 1) IN (
    SELECT id::text FROM authors WHERE user_id = auth.uid()
  )
);

CREATE POLICY "author_photos_update_own"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'author-photos'
  AND auth.role() = 'authenticated'
  AND SPLIT_PART(name, '/', 1) IN (
    SELECT id::text FROM authors WHERE user_id = auth.uid()
  )
);

CREATE POLICY "author_photos_delete_own"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'author-photos'
  AND auth.role() = 'authenticated'
  AND SPLIT_PART(name, '/', 1) IN (
    SELECT id::text FROM authors WHERE user_id = auth.uid()
  )
);
```

---

## Notas

- Todos los buckets son **públicos** para lectura (las imágenes se renderizan directamente en el frontend).
- Las políticas de escritura verifican que el usuario esté autenticado.
- Para `author-photos` se usa el `author_id` en el path para restringir cada usuario a su propia carpeta.
- Se pueden aplicar las políticas desde el Dashboard en la sección Storage → Policies, o ejecutando el SQL directamente en el SQL Editor.
