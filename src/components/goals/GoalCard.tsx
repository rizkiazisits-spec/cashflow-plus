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
    completed: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle, label: 'Selesai' },
    'on-track': { color: 'text-blue-600', bg: 'bg-blue-50', icon: TrendingUp, label: 'On Track' },
    behind: { color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock, label: 'Tertinggal' },
    overdue: { color: 'text-rose-600', bg: 'bg-rose-50', icon: AlertCircle, label: 'Terlewat' },
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
      className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">{goal.name}</h3>
            <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', config.bg, config.color)}>
              <config.icon className="h-3 w-3" />
              {config.label}
            </span>
          </div>
          {goal.description && (
            <p className="text-xs text-gray-400 mt-0.5">{goal.description}</p>
          )}
          <div className="mt-2 flex items-center gap-3 text-sm">
            <span className="text-gray-600">
              Rp {goal.currentAmount.toLocaleString('id-ID')}
            </span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">
              Rp {goal.targetAmount.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            <span>Deadline: {new Date(goal.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title="Tambah Tabungan"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button onClick={onEdit} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={onDelete} className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>Progres</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={cn(
              'h-full rounded-full transition-colors',
              progress >= 100 ? 'bg-emerald-500' : 'bg-blue-500'
            )}
          />
        </div>
      </div>

      {showAddForm && progress < 100 && (
        <div className="mt-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Nominal..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={handleAddSavings}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Tambah
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="rounded-lg px-3 py-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Batal
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Maks: Rp {(goal.targetAmount - goal.currentAmount).toLocaleString('id-ID')}
          </p>
        </div>
      )}
    </motion.div>
  )
}

export default GoalCard