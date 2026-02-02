import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [successMessage, setSuccessMessage] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        setError('Credenciales invalidas. Verifica tu email y contrasena.');
      } else {
        navigate('/admin');
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage('Usuario creado exitosamente. Ahora puedes iniciar sesion.');
        setMode('login');
      }
    }

    setLoading(false);
  };

  const createDemoAdmin = async () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const demoEmail = 'admin@demo.com';
    const demoPassword = 'admin123456';

    const { error: signUpError } = await signUp(demoEmail, demoPassword);

    if (signUpError && !signUpError.message.includes('already registered')) {
      setError('Error creando usuario demo: ' + signUpError.message);
      setLoading(false);
      return;
    }

    setEmail(demoEmail);
    setPassword(demoPassword);
    setSuccessMessage('Usuario demo creado. Email: admin@demo.com | Password: admin123456');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 via-white to-sage-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-forest-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administracion</h1>
            <p className="text-gray-600 mt-2">
              {mode === 'login' ? 'Inicia sesion para continuar' : 'Crear cuenta de administrador'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition-colors"
                  placeholder="admin@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contrasena
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition-colors"
                  placeholder="********"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest-600 hover:bg-forest-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  {mode === 'login' ? 'Iniciar Sesion' : 'Crear Cuenta'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
                setSuccessMessage('');
              }}
              className="w-full text-forest-600 hover:text-forest-700 font-medium py-2 transition-colors"
            >
              {mode === 'login' ? 'Crear una cuenta nueva' : 'Ya tengo una cuenta'}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">o</span>
              </div>
            </div>

            <button
              onClick={createDemoAdmin}
              disabled={loading}
              className="w-full bg-sage-100 hover:bg-sage-200 text-sage-800 font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UserPlus className="w-5 h-5" />
              Crear Admin Demo
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Crea rapidamente un usuario de prueba
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
