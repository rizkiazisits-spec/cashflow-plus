import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useTransactions } from '@/hooks'
import {
  TransactionFilters,
  TransactionTable,
  TransactionForm,
} from '@/components/transactions'
import { Transaction, TransactionInput } from '@/types/transaction'

function TransactionsPage() {
  const {
    transactions,
    isLoading,
    addTransaction,
    editTransaction,
    deleteTransaction,
  } = useTransactions()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [sortField, setSortField] = useState<'date' | 'amount'>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')

  const categories = useMemo(
    () => Array.from(new Set(transactions.map((tx) => tx.category))),
    [transactions]
  )

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions]
    if (searchQuery) {
      filtered = filtered.filter(
        (tx) =>
          tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (filterCategory !== 'all') {
      filtered = filtered.filter((tx) => tx.category === filterCategory)
    }
    if (filterType !== 'all') {
      filtered = filtered.filter((tx) => tx.type === filterType)
    }
    filtered.sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      } else {
        return sortDirection === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount
      }
    })
    return filtered
  }, [transactions, searchQuery, filterCategory, filterType, sortField, sortDirection])

  const handleAddTransaction = async (data: TransactionInput) => {
    await addTransaction(data)
  }

  const handleEditTransaction = async (data: TransactionInput) => {
    if (editingTransaction) {
      await editTransaction({ id: editingTransaction.id, data })
      setEditingTransaction(null)
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      await deleteTransaction(id)
    }
  }

  const handleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-2 text-sm text-gray-500">Memuat transaksi...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Transaksi</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola semua pemasukan dan pengeluaran Anda
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          Tambah Transaksi
        </button>
      </div>

      <div className="mt-6">
        <TransactionFilters
          onSearch={(query) => setSearchQuery(query)}
          onFilterCategory={(category) => setFilterCategory(category)}
          onFilterType={(type) => setFilterType(type)}
          categories={categories}
        />
      </div>

      <div className="mt-6">
        <TransactionTable
          transactions={filteredTransactions}
          onEdit={(tx) => {
            setEditingTransaction(tx)
            setIsFormOpen(true)
          }}
          onDelete={handleDeleteTransaction}
          onSort={handleSort}
        />
      </div>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingTransaction(null)
        }}
        onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
        initialData={editingTransaction}
      />
    </motion.div>
  )
}

export default TransactionsPage