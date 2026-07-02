-- ============================================================
-- Migration: 002_cloudinary_migration
-- Agrega columnas para almacenar public_id de Cloudinary
-- ============================================================

-- 1. articles: nuevo campo para el public_id de la imagen de header
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS header_image_public_id TEXT;

-- 2. article_images: nuevo campo para el public_id de cada imagen
ALTER TABLE article_images
ADD COLUMN IF NOT EXISTS public_id TEXT;

-- ============================================================
-- NOTA: Esta migración NO elimina las columnas antiguas
-- (header_image_url en articles, url en article_images).
-- Esas columnas se mantienen para no romper artículos existentes
-- que todavía referencian URLs de Supabase Storage.
--
-- Las nuevas columnas (header_image_public_id, public_id)
-- almacenan el public_id de Cloudinary. El código nuevo prioriza
-- estos campos; si están ausentes, usa el valor antiguo como fallback.
-- ============================================================

-- ============================================================
-- ADVERTENCIA sobre artículos existentes:
-- ----------------------------------------------------------
-- Los artículos actuales que tengan imágenes en Supabase Storage
-- (columnas header_image_url / article_images.url) quedarán
-- con imágenes servidas desde Supabase a menos que se migren
-- manualmente a Cloudinary. Este script NO migra imágenes
-- existentes automáticamente.
--
-- Para migrar artículos existentes:
--   1. Sube manualmente las imágenes de Supabase a Cloudinary
--      (puedes usar la consola de Cloudinary o el CLI).
--   2. Actualiza header_image_public_id con el public_id
--      correspondiente en cada artículo.
--   3. Para imágenes del cuerpo, actualiza el JSONB body
--      reemplazando las URLs de Supabase por public_ids.
-- ============================================================
