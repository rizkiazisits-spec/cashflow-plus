import { motion } from 'framer-motion'
import { Pencil, Trash2, TrendingUp, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react'
import { Goal } from '@/types/goal'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface GoalCardProps {
  goal: Goal
  onEdit: () => void
  onDelete: () => void
  onAddSavings: (id: string, amount: number) => void
  progress: number
  status: 'completed' | 'on-track' | 'behind' | 'overdue'
}

function GoalCard({ goal, onEdit, onDelete, onAddSavings, progress, status }: GoalCardProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [amount, setAmount] = useState('')

  const statusConfig = {
    completed: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', icon: CheckCircle, label: 'Selesai' },
    'on-track': { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30', icon: TrendingUp, label: 'On Track' },
    behind: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30', icon: Clock, label: 'Tertinggal' },
    overdue: { color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/30', icon: AlertCircle, label: 'Terlewat' },
  }

  const config = statusConfig[status]

  const handleAddSavings = () => {
    const val = parseInt(amount)
    if (val > 0 && val <= goal.targetAmount - goal.currentAmount) {
      onAddSavings(goal.id, val)
      setAmount('')
      setShowAddForm(false)
    }
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
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{goal.name}</h3>
            <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', config.bg, config.color)}>
              <config.icon className="h-3 w-3" />
              {config.label}
            </span>
          </div>
          {goal.description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{goal.description}</p>
          )}
          <div className="mt-2 flex items-center gap-3 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Rp {goal.currentAmount.toLocaleString('id-ID')}
            </span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-white font-medium">
              Rp {goal.targetAmount.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Deadline: {new Date(goal.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-lg p-1.5 text-gray-400 dark:text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Tambah Tabungan"
          >
            <Plus className="h-4 w-4" />
          </button>
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
          <span>Progres</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={cn(
              'h-full rounded-full transition-colors',
              progress >= 100 ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-blue-500 dark:bg-blue-400'
            )}
          />
        </div>
      </div>

      {showAddForm && progress < 100 && (
        <div className="mt-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Nominal..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:text-white"
            />
            <button
              onClick={handleAddSavings}
              className="rounded-lg bg-blue-600 dark:bg-blue-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Tambah
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="rounded-lg px-3 py-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Batal
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Maks: Rp {(goal.targetAmount - goal.currentAmount).toLocaleString('id-ID')}
          </p>
        </div>
      )}
    </motion.div>
  )
}

export default GoalCard