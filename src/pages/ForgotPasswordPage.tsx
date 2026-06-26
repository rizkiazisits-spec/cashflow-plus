import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Input from '@/components/ui/Input'

function ForgotPasswordPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto mt-12"
    >
      <h2 className="text-2xl font-bold text-gray-900 text-center">Lupa Password</h2>
      <p className="text-sm text-gray-500 text-center mt-1">
        Masukkan email Anda dan kami akan kirimkan link reset password
      </p>

      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="contoh@email.com"
        />

        <button className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all">
          Kirim Link Reset
        </button>

        <div className="text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:underline font-medium transition-colors">
            Kembali ke Login
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default ForgotPasswordPage