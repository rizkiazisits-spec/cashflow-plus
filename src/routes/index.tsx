import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import DashboardPage from '@/pages/DashboardPage'
import TransactionsPage from '@/pages/TransactionsPage'
import BudgetPage from '@/pages/BudgetPage'
import GoalsPage from '@/pages/GoalsPage'
import StatisticsPage from '@/pages/StatisticsPage'
import SettingsPage from '@/pages/SettingsPage'
import GroupDetailPage from '@/pages/GroupDetailPage'
import NotFoundPage from '@/pages/NotFoundPage'

// ===== WRAPPER UNTUK REDIRECT DI ROOT =====
function RootRedirect() {
  const { user, isLoading } = useAuth()

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
    return <Navigate to="/dashboard" replace />
  }

  return <LandingPage />
}

export const router = createBrowserRouter([
  // ===== ROOT (AUTO REDIRECT) =====
  {
    path: '/',
    element: <RootRedirect />,
  },

  // ===== AUTH PAGES (tanpa sidebar) =====
  {
    path: '/login',
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: '/register',
    element: <AuthLayout />,
    children: [{ index: true, element: <RegisterPage /> }],
  },
  {
    path: '/forgot-password',
    element: <AuthLayout />,
    children: [{ index: true, element: <ForgotPasswordPage /> }],
  },

  // ===== DASHBOARD (dengan ProtectedRoute) =====
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'transactions', element: <TransactionsPage /> },
          { path: 'budget', element: <BudgetPage /> },
          { path: 'goals', element: <GoalsPage /> },
          { path: 'statistics', element: <StatisticsPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'groups/:groupId', element: <GroupDetailPage /> },
        ],
      },
    ],
  },

  // ===== 404 =====
  {
    path: '*',
    element: <NotFoundPage />,
  },
])