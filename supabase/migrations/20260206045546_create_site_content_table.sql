/*
  # Create site_content table for editable Home page texts

  1. New Tables
    - `site_content`
      - `id` (uuid, primary key) - Unique identifier
      - `key` (text, unique) - Unique identifier for each text block (e.g., 'hero_heading')
      - `value` (text) - The actual content/text
      - `section` (text) - Section grouping: 'hero', 'values', 'about', 'cta'
      - `label` (text) - Human-readable label shown in admin editor
      - `field_type` (text) - 'input' for short text or 'textarea' for long text
      - `updated_at` (timestamp) - Last modification time

  2. Security
    - Enable RLS on `site_content` table
    - Public read access (for the Home page to load texts without auth)
    - Authenticated-only write access (for admin editing)

  3. Seed Data
    - All current Home page texts are inserted as initial values
    - Organized by section: hero, values, about, cta

  4. Notes
    - The `key` column is unique to prevent duplicate entries
    - Public read is necessary so the Home page can display texts for all visitors
    - Only authenticated admin users can modify content
*/

CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  section text NOT NULL DEFAULT '',
  label text NOT NULL DEFAULT '',
  field_type text NOT NULL DEFAULT 'input' CHECK (field_type IN ('input', 'textarea')),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site content"
  ON site_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update site content"
  ON site_content
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert site content"
  ON site_content
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content(key);
CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section);

-- Seed data: Hero section
INSERT INTO site_content (key, value, section, label, field_type) VALUES
  ('hero_heading_1', 'CASA HOGAR RESIDENCIAL', 'hero', 'Titulo Principal (Linea 1)', 'input'),
  ('hero_heading_2', 'SANTA MARTA', 'hero', 'Titulo Principal (Linea 2)', 'input'),
  ('hero_tagline', 'Vida, Salud y Familia.', 'hero', 'Lema / Tagline', 'input'),
  ('hero_subtitle', 'Dedicados al cuidado del adulto mayor.', 'hero', 'Subtitulo', 'input'),
  ('hero_btn_services', 'Conocer Servicios', 'hero', 'Texto Boton Servicios', 'input'),
  ('hero_btn_contact', 'Contactar Ahora', 'hero', 'Texto Boton Contacto', 'input')
ON CONFLICT (key) DO NOTHING;

-- Seed data: Values section
INSERT INTO site_content (key, value, section, label, field_type) VALUES
  ('values_title', 'Nuestros Valores', 'values', 'Titulo de Seccion', 'input'),
  ('values_description', 'En Santa Marta brindamos a nuestros residentes un servicio completo y permanente, con un equipo calificado que garantiza su bienestar y calidad de vida.', 'values', 'Descripcion de Seccion', 'textarea'),
  ('value_1', 'Dignidad', 'values', 'Valor 1', 'input'),
  ('value_2', 'Comunicación', 'values', 'Valor 2', 'input'),
  ('value_3', 'Amor', 'values', 'Valor 3', 'input'),
  ('value_4', 'Empatía', 'values', 'Valor 4', 'input'),
  ('value_5', 'Seguridad', 'values', 'Valor 5', 'input'),
  ('value_6', 'Protección', 'values', 'Valor 6', 'input')
ON CONFLICT (key) DO NOTHING;

-- Seed data: About section
INSERT INTO site_content (key, value, section, label, field_type) VALUES
  ('about_title', 'Más de 25 años cuidando a nuestros adultos mayores', 'about', 'Titulo de Seccion', 'input'),
  ('about_paragraph_1', 'Santa Marta, fundada en 1999 por empresarios panameños, ofrece atención integral y de calidad a la tercera edad, con más de 25 años de experiencia y certificación del MIDES.', 'about', 'Parrafo 1', 'textarea'),
  ('about_paragraph_2', 'Nuestro servicio se centra en preservar la calidad de vida en un ambiente de paz, amor y armonía, respetando la diversidad cultural y religiosa.', 'about', 'Parrafo 2', 'textarea'),
  ('about_paragraph_3', 'Contamos con un equipo especializado de médicos, enfermeras y cuidadores, además de instalaciones seguras con áreas sociales, dormitorios equipados y sistemas de seguridad.', 'about', 'Parrafo 3', 'textarea'),
  ('about_experience_number', '25+', 'about', 'Numero de Experiencia', 'input'),
  ('about_experience_text', 'Años de experiencia', 'about', 'Texto de Experiencia', 'input'),
  ('about_btn_text', 'Conocer Más', 'about', 'Texto del Boton', 'input')
ON CONFLICT (key) DO NOTHING;

-- Seed data: CTA section
INSERT INTO site_content (key, value, section, label, field_type) VALUES
  ('cta_title', '¿Necesita más información?', 'cta', 'Titulo', 'input'),
  ('cta_description', 'Estamos aquí para ayudarle. Contáctenos y con gusto le brindaremos toda la información que necesite para su ser querido.', 'cta', 'Descripcion', 'textarea'),
  ('cta_btn_text', 'Contactar Ahora', 'cta', 'Texto del Boton', 'input')
ON CONFLICT (key) DO NOTHING;
