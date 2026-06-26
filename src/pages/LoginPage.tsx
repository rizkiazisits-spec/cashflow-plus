import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [authError, setAuthError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setAuthError('')
    const { error } = await signIn(data.email, data.password)
    if (error) {
      setAuthError(error.message || 'Gagal masuk, periksa email dan password')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto mt-12"
    >
      <h2 className="text-2xl font-bold text-gray-900 text-center">Masuk ke Akun</h2>
      <p className="text-sm text-gray-500 text-center mt-1">
        Belum punya akun?{' '}
        <Link to="/register" className="text-blue-600 hover:underline cursor-pointer font-medium">
          Daftar
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          {authError && (
            <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600 border border-rose-100">
              {authError}
            </div>
          )}
          <Input
            label="Email"
            type="email"
            placeholder="contoh@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <PasswordInput
            label="Kata Sandi"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline font-medium transition-colors">
              Lupa Password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? 'Memproses...' : 'Masuk'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default LoginPage