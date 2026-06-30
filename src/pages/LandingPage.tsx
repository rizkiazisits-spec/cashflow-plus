import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Hero, FeatureCards, CTA, Footer } from '@/components/landing'

function LandingPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  // Redirect jika sudah login
  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Memuat...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* ===== HEADER ===== */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">CashFlow+</span>
          </Link>

          {/* Navigation Links - Selalu Terlihat */}
          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/login"
              className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="text-sm sm:text-base bg-blue-600 dark:bg-blue-500 text-white px-4 py-1.5 sm:py-2 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
            >
              Daftar
            </Link>
          </nav>
        </div>
      </header>

      {/* ===== KONTEN LANDING ===== */}
      <Hero />
      <FeatureCards />
      <CTA />
      <Footer />
    </div>
  )
}

export default LandingPage