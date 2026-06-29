import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Wallet, 
  PiggyBank, 
  BarChart3, 
  Settings, 
  LogOut,
  X,
  Target
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Wallet, label: 'Transaksi', path: '/dashboard/transactions' },
  { icon: PiggyBank, label: 'Budget', path: '/dashboard/budget' },
  { icon: Target, label: 'Target', path: '/dashboard/goals' },
  { icon: BarChart3, label: 'Statistik', path: '/dashboard/statistics' },
  { icon: Settings, label: 'Pengaturan', path: '/dashboard/settings' },
]

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay - dark mode support */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50',
          'flex flex-col shadow-xl lg:shadow-none dark:shadow-gray-900/50',
          'lg:translate-x-0',
          !isOpen && 'lg:w-20'
        )}
      >
        {/* Logo & Close button */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800">
          <div className={cn('flex items-center gap-2', !isOpen && 'lg:hidden')}>
            <span className="text-xl font-bold text-gray-900 dark:text-white">CashFlow+</span>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-auto lg:flex hidden text-gray-500 dark:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  'hover:bg-blue-50 dark:hover:bg-blue-900/30',
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400',
                  !isOpen && 'lg:justify-center lg:px-2'
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className={cn('truncate', !isOpen && 'lg:hidden')}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom - Logout */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-3 space-y-1">
          <button
            onClick={handleLogout}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors',
              !isOpen && 'lg:justify-center lg:px-2'
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className={cn('truncate', !isOpen && 'lg:hidden')}>
              Keluar
            </span>
          </button>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar