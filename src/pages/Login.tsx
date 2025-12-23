import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { loginRequest } from '../request/auth/auth.request';

export const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar errores del campo cuando el usuario empiece a escribir
    if (fieldErrors[e.target.name]) {
      setFieldErrors({
        ...fieldErrors,
        [e.target.name]: '',
      });
    }
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    setLoading(true);

    try {
      const response = await loginRequest({
        email: formData.email,
        password: formData.password,
      });

      // Guardar el token en localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (err: any) {
      if (err.errors) {
        // Errores de validación del backend
        const errors: Record<string, string> = {};
        Object.keys(err.errors).forEach((key) => {
          errors[key] = err.errors[key][0]; // Tomar el primer error de cada campo
        });
        setFieldErrors(errors);
        setError(err.message || 'Error al iniciar sesión');
      } else {
        setError(err.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-darker via-blue-dark to-dark-primary flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.login.backHome}
          </Link>
        </div>
        <div className="bg-blue-deep/50 backdrop-blur-sm border border-dark-accent rounded-2xl p-8 sm:p-10 shadow-xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-left mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300">
            {t.login.title}
          </h1>
          <p className="text-gray-400 text-sm mb-8 text-left">
            {t.hero.subtitle}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 text-left">
                {t.login.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 bg-blue-deep/30 border rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  fieldErrors.email ? 'border-red-500' : 'border-dark-accent'
                }`}
                placeholder={t.login.email}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-400 text-left">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2 text-left">
                {t.login.password}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 bg-blue-deep/30 border rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  fieldErrors.password ? 'border-red-500' : 'border-dark-accent'
                }`}
                placeholder={t.login.password}
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-400 text-left">{fieldErrors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-dark-accent rounded bg-blue-deep/30"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  {t.login.rememberMe}
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                  {t.login.forgotPassword}
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
            >
              {loading ? 'Iniciando sesión...' : t.login.submit}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              {t.login.noAccount}{' '}
              <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">
                {t.login.register}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

