import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadingProvider } from './contexts/LoadingContext';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingScreen } from './components/layout/LoadingScreen';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/admin/AdminLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { Home } from './pages/Home';
import { Nosotros } from './pages/Nosotros';
import { Servicios } from './pages/Servicios';
import { Testimonios } from './pages/Testimonios';
import { Contacto } from './pages/Contacto';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminPosts } from './pages/admin/AdminPosts';
import { AdminPostEditor } from './pages/admin/AdminPostEditor';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminSiteContent } from './pages/admin/AdminSiteContent';

function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <Router>
          <LoadingScreen />
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminAnalytics />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/posts"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminPosts />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/posts/:id"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminPostEditor />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminCategories />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/content"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminSiteContent />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/nosotros" element={<Nosotros />} />
                    <Route path="/servicios" element={<Servicios />} />
                    <Route path="/testimonios" element={<Testimonios />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </Router>
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;
