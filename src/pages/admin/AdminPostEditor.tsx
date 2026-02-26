import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Image,
  Video,
  Eye,
  Bold,
  Italic,
  List,
  Heading2,
  LinkIcon,
  Upload,
  X,
  Link2,
  Film
} from 'lucide-react';
import { api, BlogPost, BlogCategory } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export const AdminPostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [videoMode, setVideoMode] = useState<'link' | 'upload'>('link');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    video_url: '',
    category_id: '',
    status: 'draft' as 'draft' | 'published',
  });

  useEffect(() => {
    fetchCategories();
    if (!isNew && id) {
      fetchPost(id);
    }
  }, [id, isNew]);

  const fetchCategories = async () => {
    try {
      const data = await api.categories.list();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPost = async (postId: string) => {
    try {
      const data = await api.posts.get(postId);

      if (data) {
        setForm({
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt || '',
          featured_image: data.featured_image || '',
          video_url: data.video_url || '',
          category_id: data.category_id || '',
          status: data.status,
        });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await api.upload(file);
      setForm(prev => ({ ...prev, featured_image: url }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 200 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('El video excede el limite de 200MB');
      return;
    }

    setUploadingVideo(true);
    setVideoUploadProgress(0);

    const fakeProgress = setInterval(() => {
      setVideoUploadProgress(prev => {
        if (prev >= 90) { clearInterval(fakeProgress); return prev; }
        return prev + 10;
      });
    }, 500);

    try {
      const url = await api.uploadVideo(file);
      setVideoUploadProgress(100);
      setForm(prev => ({ ...prev, video_url: url }));
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al subir video';
      alert(msg);
    } finally {
      clearInterval(fakeProgress);
      setUploadingVideo(false);
      setVideoUploadProgress(0);
    }
  };

  const isUploadedVideo = (url: string) => {
    return url && (url.startsWith('/api/uploads/') || url.startsWith('/uploads/'));
  };

  const isEmbedUrl = (url: string) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  };

  const insertFormatting = (before: string, after: string = before) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = form.content.substring(start, end);
    const newContent =
      form.content.substring(0, start) +
      before +
      selectedText +
      after +
      form.content.substring(end);

    setForm(prev => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleSave = async (publish: boolean = false) => {
    if (!form.title.trim()) {
      alert('El titulo es requerido');
      return;
    }

    setSaving(true);
    try {
      const postData: Partial<BlogPost> = {
        title: form.title,
        slug: form.slug || generateSlug(form.title),
        content: form.content,
        excerpt: form.excerpt,
        featured_image: form.featured_image,
        video_url: form.video_url,
        category_id: form.category_id || null,
        status: publish ? 'published' : form.status,
        published_at: publish ? new Date().toISOString() : null,
        author_id: user?.id || null,
      };

      if (isNew) {
        await api.posts.create(postData);
      } else {
        await api.posts.update(id!, postData);
      }

      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error al guardar el post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/posts')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? 'Nuevo Post' : 'Editar Post'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Eye className="w-5 h-5" />
            {showPreview ? 'Editar' : 'Vista Previa'}
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            Guardar Borrador
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Publicar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titulo
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500 text-lg"
                  placeholder="Titulo del post"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL (slug)
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm mr-2">/blog/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                    placeholder="url-del-post"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extracto
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                  rows={2}
                  placeholder="Breve descripcion del post..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido
            </label>

            {showPreview ? (
              <div
                className="prose max-w-none min-h-[400px] p-4 border border-gray-200 rounded-lg bg-gray-50"
                dangerouslySetInnerHTML={{ __html: form.content }}
              />
            ) : (
              <>
                <div className="flex items-center gap-1 p-2 border border-gray-300 border-b-0 rounded-t-lg bg-gray-50">
                  <button
                    type="button"
                    onClick={() => insertFormatting('<strong>', '</strong>')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Negrita"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('<em>', '</em>')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Italica"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('<h2>', '</h2>')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Subtitulo"
                  >
                    <Heading2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('<ul>\n<li>', '</li>\n</ul>')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Lista"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('<a href="">', '</a>')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Enlace"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => insertFormatting('<img src="" alt="" class="rounded-lg" />', '')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Imagen"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('URL del video (YouTube, Vimeo, o enlace directo):');
                      if (!url) return;
                      const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                      const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
                      let html = '';
                      if (youtubeMatch) {
                        html = `<div class="aspect-video my-4"><iframe src="https://www.youtube.com/embed/${youtubeMatch[1]}" class="w-full h-full rounded-lg" allowfullscreen></iframe></div>`;
                      } else if (vimeoMatch) {
                        html = `<div class="aspect-video my-4"><iframe src="https://player.vimeo.com/video/${vimeoMatch[1]}" class="w-full h-full rounded-lg" allowfullscreen></iframe></div>`;
                      } else {
                        html = `<video src="${url}" controls class="w-full rounded-lg my-4"></video>`;
                      }
                      insertFormatting(html, '');
                    }}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Insertar video"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  id="content-editor"
                  value={form.content}
                  onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500 font-mono text-sm"
                  rows={16}
                  placeholder="Escribe el contenido del post en HTML..."
                />
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Imagen Destacada</h3>
            {form.featured_image ? (
              <div className="relative">
                <img
                  src={form.featured_image}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => setForm(prev => ({ ...prev, featured_image: '' }))}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-forest-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {uploadingImage ? (
                  <div className="w-8 h-8 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Subir imagen</span>
                  </>
                )}
              </label>
            )}
            <div className="mt-3">
              <input
                type="url"
                value={form.featured_image}
                onChange={(e) => setForm(prev => ({ ...prev, featured_image: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                placeholder="O pega una URL de imagen..."
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Video className="w-5 h-5" />
              Video (opcional)
            </h3>

            <div className="flex rounded-lg border border-gray-300 overflow-hidden mb-4">
              <button
                type="button"
                onClick={() => setVideoMode('link')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                  videoMode === 'link'
                    ? 'bg-forest-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Link2 className="w-4 h-4" />
                Enlace
              </button>
              <button
                type="button"
                onClick={() => setVideoMode('upload')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                  videoMode === 'upload'
                    ? 'bg-forest-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Upload className="w-4 h-4" />
                Subir
              </button>
            </div>

            {form.video_url && (
              <div className="mb-4">
                <div className="relative rounded-lg overflow-hidden bg-gray-900">
                  {isUploadedVideo(form.video_url) ? (
                    <video
                      src={form.video_url}
                      className="w-full aspect-video object-contain"
                      controls
                    />
                  ) : isEmbedUrl(form.video_url) ? (
                    <div className="flex items-center gap-2 p-3 bg-forest-50 rounded-lg">
                      <Film className="w-5 h-5 text-forest-600 shrink-0" />
                      <span className="text-sm text-forest-700 truncate">{form.video_url}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Video className="w-5 h-5 text-gray-500 shrink-0" />
                      <span className="text-sm text-gray-600 truncate">{form.video_url}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, video_url: '' }))}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {videoMode === 'link' ? (
              <div>
                <input
                  type="url"
                  value={isUploadedVideo(form.video_url) ? '' : form.video_url}
                  onChange={(e) => setForm(prev => ({ ...prev, video_url: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                  placeholder="URL de YouTube, Vimeo, etc..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  Soporta YouTube y Vimeo. El video se incrustara automaticamente.
                </p>
              </div>
            ) : (
              <div>
                {uploadingVideo ? (
                  <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="w-8 h-8 border-4 border-forest-500 border-t-transparent rounded-full animate-spin mb-3" />
                    <div className="w-3/4 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-forest-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${videoUploadProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-2">Subiendo video... {videoUploadProgress}%</span>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-forest-500 transition-colors">
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Subir video</span>
                    <span className="text-xs text-gray-400 mt-1">MP4, WebM, OGG (max 200MB)</span>
                  </label>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Categoria</h3>
            <select
              value={form.category_id}
              onChange={(e) => setForm(prev => ({ ...prev, category_id: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
            >
              <option value="">Sin categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Estado</h3>
            <select
              value={form.status}
              onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
