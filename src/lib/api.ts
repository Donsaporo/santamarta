const API_URL = import.meta.env.VITE_API_URL || '/api';

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
  category?: BlogCategory | null;
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

export type SiteContentItem = {
  key: string;
  value: string;
  section: string;
  label: string;
  field_type: 'input' | 'textarea';
};

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Error de red' }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: { id: string; email: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    me: () =>
      request<{ user: { id: string; email: string } }>('/auth/me'),
  },

  posts: {
    list: (params?: { status?: string; slug?: string; category_id?: string; exclude?: string; limit?: number }) => {
      const qs = new URLSearchParams();
      if (params?.status) qs.set('status', params.status);
      if (params?.slug) qs.set('slug', params.slug);
      if (params?.category_id) qs.set('category_id', params.category_id);
      if (params?.exclude) qs.set('exclude', params.exclude);
      if (params?.limit) qs.set('limit', String(params.limit));
      const query = qs.toString() ? `?${qs}` : '';
      return request<BlogPost[]>(`/posts${query}`);
    },

    get: (id: string) => request<BlogPost>(`/posts/${id}`),

    create: (data: Partial<BlogPost>) =>
      request<{ id: string }>('/posts', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, data: Partial<BlogPost>) =>
      request<{ success: boolean }>(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    delete: (id: string) =>
      request<{ success: boolean }>(`/posts/${id}`, { method: 'DELETE' }),
  },

  categories: {
    list: () => request<BlogCategory[]>('/categories'),

    create: (data: { name: string; slug: string }) =>
      request<BlogCategory>('/categories', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, data: { name: string; slug: string }) =>
      request<{ success: boolean }>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    delete: (id: string) =>
      request<{ success: boolean }>(`/categories/${id}`, { method: 'DELETE' }),
  },

  analytics: {
    track: (data: Omit<PageView, 'id' | 'created_at'>) =>
      request<{ success: boolean }>('/analytics', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    list: (since?: string) => {
      const qs = since ? `?since=${since}` : '';
      return request<PageView[]>(`/analytics${qs}`);
    },
  },

  content: {
    list: () => request<SiteContentItem[]>('/content'),

    update: (key: string, value: string) =>
      request<{ success: boolean }>(`/content/${key}`, {
        method: 'PUT',
        body: JSON.stringify({ value }),
      }),
  },

  upload: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const token = getToken();
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error('Error al subir imagen');
    const data = await res.json();
    return data.url;
  },
};
