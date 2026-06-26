import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Target } from 'lucide-react'
import { useGoals } from '@/hooks'
import { Goal, GoalInput } from '@/types/goal'
import GoalCard from '@/components/goals/GoalCard'
import GoalForm from '@/components/goals/GoalForm'

function GoalsPage() {
  const { goals, isLoading, addGoal, editGoal, deleteGoal, addSavings, getProgress, getGoalStatus } = useGoals()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  const handleAddGoal = async (data: GoalInput) => {
    await addGoal(data)
  }

  const handleEditGoal = async (data: GoalInput) => {
    if (editingGoal) {
      await editGoal({ id: editingGoal.id, data })
      setEditingGoal(null)
    }
  }

  const handleDeleteGoal = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus target ini?')) {
      await deleteGoal(id)
    }
  }

  const handleAddSavings = async (id: string, amount: number) => {
    await addSavings({ id, amount })
  }

  const totalGoals = goals.length
  const completedGoals = goals.filter((g) => getProgress(g) >= 100).length
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-2 text-sm text-gray-500">Memuat target...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Target Tabungan</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola target keuangan Anda</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          Tambah Target
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Total Target</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{totalGoals}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Selesai</p>
          <p className="text-lg font-bold text-emerald-600 mt-1">{completedGoals}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Total Tabungan</p>
          <p className="text-lg font-bold text-blue-600 mt-1">
            Rp {totalSaved.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Target Total</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            Rp {totalTarget.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {goals.length === 0 ? (
        <div className="mt-8 flex h-64 items-center justify-center rounded-2xl border border-gray-100 bg-white">
          <div className="text-center">
            <Target className="h-12 w-12 text-gray-300 mx-auto" />
            <p className="text-gray-400 text-sm mt-3">Belum ada target</p>
            <p className="text-xs text-gray-300 mt-1">Tambahkan target untuk memulai</p>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => {
                setEditingGoal(goal)
                setIsFormOpen(true)
              }}
              onDelete={() => handleDeleteGoal(goal.id)}
              onAddSavings={handleAddSavings}
              progress={getProgress(goal)}
              status={getGoalStatus(goal)}
            />
          ))}
        </div>
      )}

      <GoalForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingGoal(null)
        }}
        onSubmit={editingGoal ? handleEditGoal : handleAddGoal}
        initialData={editingGoal}
      />
    </motion.div>
  )
}

export default GoalsPage