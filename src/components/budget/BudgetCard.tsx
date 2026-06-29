import { motion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import { Budget } from '@/types/budget'
import { cn } from '@/lib/utils'

interface BudgetCardProps {
  budget: Budget
  onEdit: () => void
  onDelete: () => void
}

function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const percentage = Math.min((budget.spent / budget.amount) * 100, 100)
  const isOverBudget = percentage > 100
  const isNearLimit = percentage >= 80 && percentage <= 100

  const getProgressColor = () => {
    if (isOverBudget) return 'bg-rose-500'
    if (isNearLimit) return 'bg-amber-500'
    return 'bg-blue-500 dark:bg-blue-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{budget.category}</h3>
            {isOverBudget && (
              <span className="inline-flex items-center rounded-full bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                Over Budget
              </span>
            )}
            {isNearLimit && !isOverBudget && (
              <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                Mendekati Limit
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Rp {budget.spent.toLocaleString('id-ID')}
            </span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-white font-medium">
              Rp {budget.amount.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="rounded-lg p-1.5 text-gray-400 dark:text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg p-1.5 text-gray-400 dark:text-gray-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
          <span>Penggunaan</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={cn('h-full rounded-full transition-colors', getProgressColor())}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default BudgetCard