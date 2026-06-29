import { useState } from 'react'  // ← useEffect dihapus
import { motion } from 'framer-motion'
import { User, Mail, LogOut, Moon, Sun, Bell } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'

// ... sisanya sama

function SettingsPage() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState(true)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pengaturan</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Kelola akun dan preferensi Anda</p>

      <div className="mt-6 max-w-2xl space-y-4">
        {/* Profile */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Profil</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Nama</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.user_metadata?.full_name || 'Tidak ada nama'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Preferensi</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <Sun className="h-4 w-4 text-amber-500" />
                ) : (
                  <Moon className="h-4 w-4 text-indigo-400" />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300">Tema</span>
              </div>
              <button
                onClick={toggleTheme}
                className="rounded-lg bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {theme === 'light' ? 'Ganti ke Gelap' : 'Ganti ke Terang'}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Notifikasi</span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  notifications
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {notifications ? 'Aktif' : 'Nonaktif'}
              </button>
            </div>
          </div>
        </div>

        {/* Danger */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">Keamanan</h3>
          <button
            onClick={handleLogout}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Keluar dari Aplikasi
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default SettingsPage