/*
  # Blog and Analytics System Tables

  This migration creates the complete database schema for:
  1. Blog system with posts and categories
  2. Analytics tracking for page views

  ## New Tables

  ### blog_categories
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Category name
  - `slug` (text, unique) - URL-friendly identifier
  - `created_at` (timestamp) - When the category was created

  ### blog_posts
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Post title
  - `slug` (text, unique) - URL-friendly identifier
  - `content` (text) - Full post content (HTML)
  - `excerpt` (text) - Short summary for listings
  - `featured_image` (text) - URL to main image
  - `video_url` (text) - Optional video embed URL
  - `category_id` (uuid) - Reference to category
  - `author_id` (uuid) - Reference to auth.users
  - `status` (text) - 'draft' or 'published'
  - `published_at` (timestamp) - When post was published
  - `created_at` (timestamp) - When post was created
  - `updated_at` (timestamp) - When post was last updated

  ### page_views
  - `id` (uuid, primary key) - Unique identifier
  - `page_path` (text) - URL path visited
  - `page_title` (text) - Title of the page
  - `referrer` (text) - Where the visitor came from
  - `user_agent` (text) - Browser/device info
  - `device_type` (text) - 'mobile', 'tablet', or 'desktop'
  - `browser` (text) - Browser name
  - `os` (text) - Operating system
  - `country` (text) - Visitor country
  - `city` (text) - Visitor city
  - `session_id` (text) - Unique session identifier
  - `created_at` (timestamp) - When the view occurred

  ## Security
  - RLS enabled on all tables
  - blog_categories: Public read, authenticated write
  - blog_posts: Public read for published, authenticated write
  - page_views: Public insert for tracking, authenticated read for analytics
*/

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON blog_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create categories"
  ON blog_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON blog_categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories"
  ON blog_categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL DEFAULT '',
  excerpt text DEFAULT '',
  featured_image text DEFAULT '',
  video_url text DEFAULT '',
  category_id uuid REFERENCES blog_categories(id) ON DELETE SET NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (true);

-- Create page_views table for analytics
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  page_title text DEFAULT '',
  referrer text DEFAULT '',
  user_agent text DEFAULT '',
  device_type text DEFAULT 'desktop' CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
  browser text DEFAULT '',
  os text DEFAULT '',
  country text DEFAULT '',
  city text DEFAULT '',
  session_id text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert page views"
  ON page_views
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view analytics"
  ON page_views
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);