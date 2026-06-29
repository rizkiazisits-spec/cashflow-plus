import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  FileText,
} from 'lucide-react'
import { useTransactions } from '@/hooks'
import { generatePDFReport } from '@/lib/pdfExport'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f43f5e']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-white dark:bg-gray-800 p-3 shadow-lg border border-gray-100 dark:border-gray-700">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name}: Rp {p.value.toLocaleString('id-ID')}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function StatisticsPage() {
  const { transactions } = useTransactions()
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [isExporting, setIsExporting] = useState(false)

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = new Date(tx.date)
      const txMonth = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`
      return txMonth === selectedMonth
    })
  }, [transactions, selectedMonth])

  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalExpense = filteredTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const balance = totalIncome - totalExpense

  const monthlyData = useMemo(() => {
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthTransactions = transactions.filter((tx) => {
        const txDate = new Date(tx.date)
        const txMonth = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`
        return txMonth === monthKey
      })
      const income = monthTransactions
        .filter((tx) => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0)
      const expense = monthTransactions
        .filter((tx) => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0)
      months.push({
        month: date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        income,
        expense,
        balance: income - expense,
      })
    }
    return months
  }, [transactions])

  const expenseByCategory = useMemo(() => {
    const categoryMap: Record<string, number> = {}
    filteredTransactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount
      })
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
  }, [filteredTransactions])

  const incomeByCategory = useMemo(() => {
    const categoryMap: Record<string, number> = {}
    filteredTransactions
      .filter((tx) => tx.type === 'income')
      .forEach((tx) => {
        categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount
      })
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
  }, [filteredTransactions])

  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
      const [year, month] = selectedMonth.split('-')
      const period = `${monthNames[parseInt(month) - 1]} ${year}`

      await generatePDFReport({
        transactions: filteredTransactions,
        totalIncome,
        totalExpense,
        balance,
        period,
        filename: `laporan-cashflow-${selectedMonth}.pdf`,
      })
    } catch (error) {
      console.error('Gagal ekspor PDF:', error)
      alert('❌ Gagal membuat PDF. Silakan coba lagi.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Statistik Keuangan</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Analisis pemasukan dan pengeluaran Anda
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:text-white"
          />
          <button
            onClick={handleExportPDF}
            disabled={isExporting || filteredTransactions.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <FileText className="h-4 w-4" />
            {isExporting ? '⏳ Memproses...' : '📄 Ekspor PDF'}
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Saldo</p>
          </div>
          <p className={`text-lg font-bold mt-1 ${balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Pemasukan</p>
          </div>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalIncome)}
          </p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-rose-500 dark:text-rose-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Pengeluaran</p>
          </div>
          <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">
            {formatCurrency(totalExpense)}
          </p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-500 dark:text-purple-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Transaksi</p>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            {filteredTransactions.length}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            📈 Pemasukan vs Pengeluaran (6 Bulan)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeOpacity={0.4} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => `Rp ${(v/1000)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="income" stroke="#3b82f6" fill="url(#incomeGradient)" name="Pemasukan" />
              <Area type="monotone" dataKey="expense" stroke="#f43f5e" fill="url(#expenseGradient)" name="Pengeluaran" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            📊 Tren Saldo
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeOpacity={0.4} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => `Rp ${(v/1000)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="balance" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} name="Saldo" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            🍩 Pengeluaran per Kategori
          </h3>
          {expenseByCategory.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-gray-400 dark:text-gray-500">
              ✨ Belum ada data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                >
                  {expenseByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            🍩 Pemasukan per Kategori
          </h3>
          {incomeByCategory.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-gray-400 dark:text-gray-500">
              ✨ Belum ada data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={incomeByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                >
                  {incomeByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            📋 Ringkasan Bulan Ini
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Transaksi</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{filteredTransactions.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Rata-rata Pemasukan</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {filteredTransactions.filter(t => t.type === 'income').length > 0
                  ? formatCurrency(totalIncome / filteredTransactions.filter(t => t.type === 'income').length)
                  : 'Rp 0'
                }
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Rata-rata Pengeluaran</p>
              <p className="text-lg font-bold text-rose-600 dark:text-rose-400">
                {filteredTransactions.filter(t => t.type === 'expense').length > 0
                  ? formatCurrency(totalExpense / filteredTransactions.filter(t => t.type === 'expense').length)
                  : 'Rp 0'
                }
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Jumlah Kategori</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {new Set(filteredTransactions.map((tx) => tx.category)).size}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default StatisticsPage