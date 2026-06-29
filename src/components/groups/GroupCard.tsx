import { motion } from 'framer-motion'
import { Users, Calendar, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GroupCardProps {
  group: {
    id: string
    name: string
    description?: string
    target_amount: number      // ← snake_case
    current_amount: number     // ← snake_case
    deadline: string
    created_by: string
    is_completed: boolean      // ← snake_case
    invite_code: string
    member_count: number
  }
  onClick: () => void
}

function GroupCard({ group, onClick }: GroupCardProps) {
  const percentage = Math.min((group.current_amount / group.target_amount) * 100, 100)
  const isCompleted = group.is_completed
  const isOverdue = !isCompleted && new Date(group.deadline) < new Date()

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="cursor-pointer rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {group.name}
            </h3>
            {isCompleted && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Selesai
              </span>
            )}
            {isOverdue && !isCompleted && (
              <span className="inline-flex items-center rounded-full bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                Terlewat
              </span>
            )}
          </div>
          {group.description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
              {group.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {formatCurrency(group.current_amount)}
            </span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {formatCurrency(group.target_amount)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <Users className="h-3.5 w-3.5" />
            <span>{group.member_count}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(group.deadline)}</span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
          <span>Progres</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={cn(
              'h-full rounded-full transition-colors',
              isCompleted
                ? 'bg-emerald-500 dark:bg-emerald-400'
                : isOverdue
                ? 'bg-rose-500 dark:bg-rose-400'
                : 'bg-blue-500 dark:bg-blue-400'
            )}
          />
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
          Lihat Detail <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </motion.div>
  )
}

export default GroupCard