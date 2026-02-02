import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  video_url: string;
  category_id: string | null;
  author_id: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category?: BlogCategory;
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type PageView = {
  id: string;
  page_path: string;
  page_title: string;
  referrer: string;
  user_agent: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  country: string;
  city: string;
  session_id: string;
  created_at: string;
};
