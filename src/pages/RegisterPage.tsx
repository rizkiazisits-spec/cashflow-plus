import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [authError, setAuthError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setAuthError('')
    setSuccessMessage('')
    const { error } = await signUp(data.email, data.password, data.name)
    if (error) {
      setAuthError(error.message || 'Gagal mendaftar, coba lagi')
    } else {
      setSuccessMessage('Pendaftaran berhasil! Silakan cek email untuk verifikasi.')
      setTimeout(() => navigate('/login'), 3000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto mt-12"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Buat Akun Baru</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium">
          Masuk
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4">
          {authError && (
            <div className="rounded-lg bg-rose-50 dark:bg-rose-900/30 p-3 text-sm text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800">
              {authError}
            </div>
          )}
          {successMessage && (
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/30 p-3 text-sm text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
              {successMessage}
            </div>
          )}

          <Input
            label="Nama Lengkap"
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="contoh@email.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <PasswordInput
            label="Kata Sandi"
            placeholder="Minimal 6 karakter"
            error={errors.password?.message}
            {...register('password')}
          />

          <PasswordInput
            label="Konfirmasi Kata Sandi"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? 'Memproses...' : 'Daftar'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default RegisterPage