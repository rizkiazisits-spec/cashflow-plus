import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

function AuthLayout() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">CashFlow+</span>
          </Link>
          <nav className="flex items-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="text-sm bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Masuk
                </Link>
                <Link to="/register" className="text-sm bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                  Daftar
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout