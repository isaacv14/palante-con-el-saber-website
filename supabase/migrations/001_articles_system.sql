-- ============================================================
-- Migration: 001_articles_system
-- Sistema de artículos, autores, imágenes y comentarios
-- ============================================================

-- -------------------------
-- 1. FUNCIÓN: updated_at
-- -------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -------------------------
-- 2. TABLA: authors
-- -------------------------
CREATE TABLE IF NOT EXISTS authors (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT        NOT NULL,
  photo_url   TEXT,
  instagram   TEXT,
  linkedin    TEXT,
  email       TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_authors_updated_at
  BEFORE UPDATE ON authors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- -------------------------
-- 3. TABLA: articles
-- -------------------------
CREATE TABLE IF NOT EXISTS articles (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id         UUID        NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  title             TEXT        NOT NULL,
  summary           TEXT        NOT NULL,
  body              JSONB       NOT NULL,
  header_image_url  TEXT,
  slug              TEXT        UNIQUE NOT NULL,
  status            TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- -------------------------
-- 4. TABLA: article_images
-- -------------------------
CREATE TABLE IF NOT EXISTS article_images (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id  UUID        NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  url         TEXT        NOT NULL,
  caption     TEXT,
  position    INTEGER,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------
-- 5. TABLA: comments
-- -------------------------
CREATE TABLE IF NOT EXISTS comments (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id  UUID        NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  author_name TEXT        NOT NULL,
  content     TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- -------------------------
-- 6. RLS: authors
-- -------------------------
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authors_select_public"
  ON authors FOR SELECT
  USING (true);

CREATE POLICY "authors_insert_own"
  ON authors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "authors_update_own"
  ON authors FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------
-- 7. RLS: articles
-- -------------------------
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "articles_select_published"
  ON articles FOR SELECT
  USING (status = 'published');

CREATE POLICY "articles_select_own"
  ON articles FOR SELECT
  USING (author_id IN (SELECT id FROM authors WHERE user_id = auth.uid()));

CREATE POLICY "articles_insert_auth"
  ON articles FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND author_id IN (SELECT id FROM authors WHERE user_id = auth.uid())
  );

CREATE POLICY "articles_update_own"
  ON articles FOR UPDATE
  USING (author_id IN (SELECT id FROM authors WHERE user_id = auth.uid()))
  WITH CHECK (author_id IN (SELECT id FROM authors WHERE user_id = auth.uid()));

CREATE POLICY "articles_delete_own"
  ON articles FOR DELETE
  USING (author_id IN (SELECT id FROM authors WHERE user_id = auth.uid()));

-- -------------------------
-- 8. RLS: article_images
-- -------------------------
ALTER TABLE article_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "article_images_select_public"
  ON article_images FOR SELECT
  USING (true);

CREATE POLICY "article_images_insert_own"
  ON article_images FOR INSERT
  WITH CHECK (
    article_id IN (
      SELECT id FROM articles
      WHERE author_id IN (SELECT id FROM authors WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "article_images_update_own"
  ON article_images FOR UPDATE
  USING (
    article_id IN (
      SELECT id FROM articles
      WHERE author_id IN (SELECT id FROM authors WHERE user_id = auth.uid())
    )
  )
  WITH CHECK (
    article_id IN (
      SELECT id FROM articles
      WHERE author_id IN (SELECT id FROM authors WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "article_images_delete_own"
  ON article_images FOR DELETE
  USING (
    article_id IN (
      SELECT id FROM articles
      WHERE author_id IN (SELECT id FROM authors WHERE user_id = auth.uid())
    )
  );

-- -------------------------
-- 9. RLS: comments
-- -------------------------
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments_select_approved"
  ON comments FOR SELECT
  USING (status = 'approved');

CREATE POLICY "comments_select_own_articles"
  ON comments FOR SELECT
  USING (
    article_id IN (
      SELECT id FROM articles
      WHERE author_id IN (SELECT id FROM authors WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "comments_insert_public"
  ON comments FOR INSERT
  WITH CHECK (status = 'pending');

CREATE POLICY "comments_update_auth"
  ON comments FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "comments_delete_auth"
  ON comments FOR DELETE
  USING (auth.role() = 'authenticated');
