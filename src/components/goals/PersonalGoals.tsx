import { useState } from 'react'
import { Plus, Target } from 'lucide-react'
import { useGoals } from '@/hooks'
import { Goal, GoalInput } from '@/types/goal'
import GoalCard from './GoalCard'
import GoalForm from './GoalForm'

function PersonalGoals() {
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
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Memuat target...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 mr-4">
          <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Target</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{totalGoals}</p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">Selesai</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">{completedGoals}</p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Tabungan</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
              Rp {totalSaved.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">Target Total</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
              Rp {totalTarget.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          Tambah Target
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="text-center">
            <Target className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-3">Belum ada target</p>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Tambahkan target untuk memulai</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </>
  )
}

export default PersonalGoals