import { createBrowserRouter } from 'react-router-dom'
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
import NotFoundPage from '@/pages/NotFoundPage'
import SettingsPage from '@/pages/SettingsPage'
import GroupDetailPage from '@/pages/GroupDetailPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
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
  {
    path: '*',
    element: <NotFoundPage />,
  },
])