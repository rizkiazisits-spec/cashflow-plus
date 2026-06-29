import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Hero, FeatureCards, CTA, Footer } from '@/components/landing'

function LandingPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  // Jika user sudah login, redirect ke dashboard
  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, isLoading, navigate])

  // Tampilkan loading singkat agar tidak flicker
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

  // Jika user sudah login, jangan render landing (akan redirect)
  // Tapi biarkan useEffect yang handle
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Hero />
      <FeatureCards />
      <CTA />
      <Footer />
    </div>
  )
}

export default LandingPage