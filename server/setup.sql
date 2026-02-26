-- ============================================
-- Santa Marta - MySQL Database Setup
-- Run this file once to create all tables
-- ============================================

CREATE DATABASE IF NOT EXISTS santa_marta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE santa_marta;

-- Admin users table (replaces Supabase Auth)
CREATE TABLE IF NOT EXISTS admin_users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Blog categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  content LONGTEXT NOT NULL DEFAULT '',
  excerpt TEXT DEFAULT '',
  featured_image VARCHAR(1000) DEFAULT '',
  video_url VARCHAR(1000) DEFAULT '',
  category_id CHAR(36) DEFAULT NULL,
  author_id CHAR(36) DEFAULT NULL,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  published_at DATETIME DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

-- Page views (analytics)
CREATE TABLE IF NOT EXISTS page_views (
  id CHAR(36) PRIMARY KEY,
  page_path VARCHAR(500) NOT NULL,
  page_title VARCHAR(500) DEFAULT '',
  referrer VARCHAR(1000) DEFAULT '',
  user_agent TEXT DEFAULT '',
  device_type ENUM('mobile', 'tablet', 'desktop') DEFAULT 'desktop',
  browser VARCHAR(100) DEFAULT '',
  os VARCHAR(100) DEFAULT '',
  country VARCHAR(100) DEFAULT '',
  city VARCHAR(100) DEFAULT '',
  session_id VARCHAR(100) DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX idx_page_views_page_path ON page_views(page_path);
CREATE INDEX idx_page_views_session_id ON page_views(session_id);

-- Site content (editable home page texts)
CREATE TABLE IF NOT EXISTS site_content (
  id CHAR(36) PRIMARY KEY,
  `key` VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  section VARCHAR(50) NOT NULL DEFAULT '',
  label VARCHAR(200) NOT NULL DEFAULT '',
  field_type ENUM('input', 'textarea') NOT NULL DEFAULT 'input',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_site_content_key ON site_content(`key`);
CREATE INDEX idx_site_content_section ON site_content(section);

-- ============================================
-- Seed data: Site Content
-- ============================================

INSERT INTO site_content (id, `key`, value, section, label, field_type) VALUES
  (UUID(), 'hero_heading_1', 'CASA HOGAR RESIDENCIAL', 'hero', 'Titulo Principal (Linea 1)', 'input'),
  (UUID(), 'hero_heading_2', 'SANTA MARTA', 'hero', 'Titulo Principal (Linea 2)', 'input'),
  (UUID(), 'hero_tagline', 'Vida, Salud y Familia.', 'hero', 'Lema / Tagline', 'input'),
  (UUID(), 'hero_subtitle', 'Dedicados al cuidado del adulto mayor.', 'hero', 'Subtitulo', 'input'),
  (UUID(), 'hero_btn_services', 'Conocer Servicios', 'hero', 'Texto Boton Servicios', 'input'),
  (UUID(), 'hero_btn_contact', 'Contactar Ahora', 'hero', 'Texto Boton Contacto', 'input'),
  (UUID(), 'values_title', 'Nuestros Valores', 'values', 'Titulo de Seccion', 'input'),
  (UUID(), 'values_description', 'En Santa Marta brindamos a nuestros residentes un servicio completo y permanente, con un equipo calificado que garantiza su bienestar y calidad de vida.', 'values', 'Descripcion de Seccion', 'textarea'),
  (UUID(), 'value_1', 'Dignidad', 'values', 'Valor 1', 'input'),
  (UUID(), 'value_2', 'Comunicación', 'values', 'Valor 2', 'input'),
  (UUID(), 'value_3', 'Amor', 'values', 'Valor 3', 'input'),
  (UUID(), 'value_4', 'Empatía', 'values', 'Valor 4', 'input'),
  (UUID(), 'value_5', 'Seguridad', 'values', 'Valor 5', 'input'),
  (UUID(), 'value_6', 'Protección', 'values', 'Valor 6', 'input'),
  (UUID(), 'about_title', 'Más de 25 años cuidando a nuestros adultos mayores', 'about', 'Titulo de Seccion', 'input'),
  (UUID(), 'about_paragraph_1', 'Santa Marta, fundada en 1999 por empresarios panameños, ofrece atención integral y de calidad a la tercera edad, con más de 25 años de experiencia y certificación del MIDES.', 'about', 'Parrafo 1', 'textarea'),
  (UUID(), 'about_paragraph_2', 'Nuestro servicio se centra en preservar la calidad de vida en un ambiente de paz, amor y armonía, respetando la diversidad cultural y religiosa.', 'about', 'Parrafo 2', 'textarea'),
  (UUID(), 'about_paragraph_3', 'Contamos con un equipo especializado de médicos, enfermeras y cuidadores, además de instalaciones seguras con áreas sociales, dormitorios equipados y sistemas de seguridad.', 'about', 'Parrafo 3', 'textarea'),
  (UUID(), 'about_experience_number', '25+', 'about', 'Numero de Experiencia', 'input'),
  (UUID(), 'about_experience_text', 'Años de experiencia', 'about', 'Texto de Experiencia', 'input'),
  (UUID(), 'about_btn_text', 'Conocer Más', 'about', 'Texto del Boton', 'input'),
  (UUID(), 'cta_title', '¿Necesita más información?', 'cta', 'Titulo', 'input'),
  (UUID(), 'cta_description', 'Estamos aquí para ayudarle. Contáctenos y con gusto le brindaremos toda la información que necesite para su ser querido.', 'cta', 'Descripcion', 'textarea'),
  (UUID(), 'cta_btn_text', 'Contactar Ahora', 'cta', 'Texto del Boton', 'input');
