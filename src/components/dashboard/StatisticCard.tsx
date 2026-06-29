import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatisticCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  iconBgColor?: string
  iconColor?: string
}

function StatisticCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
  iconBgColor = 'bg-blue-50 dark:bg-blue-900/30',
  iconColor = 'text-blue-600 dark:text-blue-400',
}: StatisticCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                  trend.isPositive
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">dari bulan lalu</span>
            </div>
          )}
        </div>
        <div className={cn('rounded-xl p-3', iconBgColor)}>
          <Icon className={cn('h-6 w-6', iconColor)} />
        </div>
      </div>
    </motion.div>
  )
}

export default StatisticCard