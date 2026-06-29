import { motion } from 'framer-motion'
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatisticCard from '@/components/dashboard/StatisticCard'
import RecentTransactions from '@/components/dashboard/RecentTransactions'
import ExpenseChart from '@/components/charts/ExpenseChart'
import { useTransactions } from '@/hooks'

function DashboardPage() {
  const { transactions, totalIncome, totalExpense, balance, isLoading } = useTransactions()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Selamat datang di CashFlow+!</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/transactions')}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
        >
          <ArrowUpRight className="h-4 w-4" />
          Tambah Transaksi
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatisticCard
          title="Total Saldo"
          value={`Rp ${balance.toLocaleString('id-ID')}`}
          icon={Wallet}
          iconBgColor="bg-blue-50 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatisticCard
          title="Pemasukan"
          value={`Rp ${totalIncome.toLocaleString('id-ID')}`}
          icon={TrendingUp}
          iconBgColor="bg-blue-50 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatisticCard
          title="Pengeluaran"
          value={`Rp ${totalExpense.toLocaleString('id-ID')}`}
          icon={TrendingDown}
          iconBgColor="bg-blue-50 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
          trend={{ value: 3.1, isPositive: false }}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions transactions={transactions.slice(0, 5)} />
        </div>
        <div className="lg:col-span-1">
          <ExpenseChart transactions={transactions} />
        </div>
      </div>
    </motion.div>
  )
}

export default DashboardPage