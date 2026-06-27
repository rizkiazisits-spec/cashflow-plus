import { motion } from 'framer-motion'
import { ArrowRight, ShoppingBag, Coffee, Home, Briefcase, Gift } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TransactionItem from './TransactionItem'
import { Transaction } from '@/types/transaction'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

const iconMap: Record<string, any> = {
  'Pemasukan': Briefcase,
  'Kebutuhan': ShoppingBag,
  'Makanan': Coffee,
  'Pengeluaran': Home,
  'Hiburan': Gift,
}

function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const navigate = useNavigate()

  const getIcon = (category: string) => {
    return iconMap[category] || ShoppingBag
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Transaksi Terbaru</h3>
          <p className="text-xs text-gray-400 mt-0.5">{transactions.length} transaksi</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/transactions')}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Lihat Semua
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400">
          Belum ada transaksi
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {transactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              icon={getIcon(tx.category)}
              iconBgColor="bg-gray-50"
              iconColor="text-gray-600"
              title={tx.title}
              category={tx.category}
              date={new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              amount={tx.amount}
              type={tx.type}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default RecentTransactions