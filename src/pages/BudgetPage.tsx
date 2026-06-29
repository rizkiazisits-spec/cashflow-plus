import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Wallet } from 'lucide-react'
import { useBudgets } from '@/hooks'
import { Budget, BudgetInput } from '@/types/budget'
import BudgetCard from '@/components/budget/BudgetCard'
import BudgetForm from '@/components/budget/BudgetForm'

function BudgetPage() {
  const { budgets, isLoading, addBudget, editBudget, deleteBudget } = useBudgets()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)

  const handleAddBudget = async (data: BudgetInput) => {
    await addBudget(data)
  }

  const handleEditBudget = async (data: BudgetInput) => {
    if (editingBudget) {
      await editBudget({ id: editingBudget.id, data })
      setEditingBudget(null)
    }
  }

  const handleDeleteBudget = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus budget ini?')) {
      await deleteBudget(id)
    }
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Memuat budget...</p>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budget</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Kelola anggaran per kategori</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          Tambah Budget
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Budget</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            Rp {totalBudget.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Pengeluaran</p>
          <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            Rp {totalSpent.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Sisa Budget</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            Rp {(totalBudget - totalSpent).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {budgets.length === 0 ? (
        <div className="mt-8 flex h-64 items-center justify-center rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="text-center">
            <Wallet className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-3">Belum ada budget</p>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Tambahkan budget untuk mulai mengelola</p>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={() => {
                setEditingBudget(budget)
                setIsFormOpen(true)
              }}
              onDelete={() => handleDeleteBudget(budget.id)}
            />
          ))}
        </div>
      )}

      <BudgetForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingBudget(null)
        }}
        onSubmit={editingBudget ? handleEditBudget : handleAddBudget}
        initialData={editingBudget}
      />
    </motion.div>
  )
}

export default BudgetPage