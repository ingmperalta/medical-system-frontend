// frontend/src/app/login/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, AlertCircle, Loader2, User } from 'lucide-react';
import { api } from '@/lib/api';
import { errorHandler } from '@/errors';

const defaultUserForm = {
    userName: '',
    password: '',
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(defaultUserForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageLoading,setPageLoading] = useState(true)

  const checkCookie = async () => {
    try{
      const { data } = await api.post('/v1.0/doctor/checkSession')
      console.log('code>>',data.code)
      // Redireccionar al dashboard
      router.push('/prescriptions');
    } catch (err) {
      setPageLoading(false)
      // console.log('err', err)
    }
  }
  useEffect(()=>{
    const localData = localStorage.getItem('token')
    if ( !localData )
    {
        setPageLoading(false)
        return      
    }
    checkCookie()    
  },[])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Aquí iría la llamada a tu API
      const { data } = await api.post('v1.0/doctor/auth', formData);
      console.log('data>>',data)
      const object = data.data
      // Guardar token y datos del usuario
      localStorage.setItem('token', object.token);
      localStorage.setItem('user', JSON.stringify({
        id: object.id,
        firstName: object.firstName,
        lastName: object.lastName,
        userName: object.userName
      }));

      // Redireccionar al dashboard
      router.push('/prescriptions');
    } catch (err: any) {
      setError(errorHandler(err)?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const signIn = (e: any) => {
    e.preventDefault();
    router.push('/doctors');
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mt-5"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl text-white font-bold">⚕</span>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Bienvenido de nuevo
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sistema de Gestión Médica
            </p>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    placeholder="ejemplo"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="appearance-none relative block w-full pl-10 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Remember Me and Forgot Password */}
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>

            {/* Demo Credentials */}
            {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-semibold text-blue-800 mb-2">Credenciales de prueba:</p>
              <div className="space-y-1 text-xs text-blue-700">
                <p><span className="font-medium">Nombre de usuario:</span> doctor@ejemplo.com</p>
                <p><span className="font-medium">Contraseña:</span> password123</p>
              </div>
            </div> */}
          </form>

          {/* Footer Links */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <a 
                href="#" 
                className="font-medium text-blue-600 hover:text-blue-500 transition"
                onClick={signIn}
              >
                Regístrate ahora!
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Branding */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob"></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-white">
            <div className="max-w-md text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                <span className="text-5xl">🏥</span>
              </div>
              <h1 className="text-4xl font-bold">
                Sistema de Gestión Médica
              </h1>
              <p className="text-xl text-blue-100">
                Administra pacientes, citas, recetas y más desde un solo lugar
              </p>
              
              {/* Features */}
              <div className="mt-12 space-y-4 text-left">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Gestión de Pacientes</h3>
                    <p className="text-sm text-blue-100">Registros completos y organizados</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Agenda Inteligente</h3>
                    <p className="text-sm text-blue-100">Programación de citas eficiente</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Recetas Digitales</h3>
                    <p className="text-sm text-blue-100">Genera e imprime recetas al instante</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}