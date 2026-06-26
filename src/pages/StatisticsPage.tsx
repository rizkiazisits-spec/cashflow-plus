import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
} from 'lucide-react'
import { useTransactions } from '@/hooks'
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

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#fb923c', '#facc15']

function StatisticsPage() {
  const { transactions, isLoading } = useTransactions()
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  // Filter transaksi berdasarkan bulan terpilih
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = new Date(tx.date)
      const txMonth = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`
      return txMonth === selectedMonth
    })
  }, [transactions, selectedMonth])

  // Hitung total
  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalExpense = filteredTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const balance = totalIncome - totalExpense
  const avgIncome = filteredTransactions.filter((tx) => tx.type === 'income').length > 0
    ? totalIncome / filteredTransactions.filter((tx) => tx.type === 'income').length
    : 0
  const avgExpense = filteredTransactions.filter((tx) => tx.type === 'expense').length > 0
    ? totalExpense / filteredTransactions.filter((tx) => tx.type === 'expense').length
    : 0

  // Data untuk grafik Income vs Expense per bulan (6 bulan terakhir)
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

  // Data untuk Expense by Category (donut chart)
  const expenseByCategory = useMemo(() => {
    const categoryMap: Record<string, number> = {}
    filteredTransactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount
      })
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
  }, [filteredTransactions])

  // Data untuk Income by Category (donut chart)
  const incomeByCategory = useMemo(() => {
    const categoryMap: Record<string, number> = {}
    filteredTransactions
      .filter((tx) => tx.type === 'income')
      .forEach((tx) => {
        categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount
      })
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
  }, [filteredTransactions])

  // Format currency
  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl bg-white p-3 shadow-lg border border-gray-100">
          <p className="text-xs font-medium text-gray-500">{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} className="text-sm font-semibold" style={{ color: p.color }}>
              {p.name}: {formatCurrency(p.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-2 text-sm text-gray-500">Memuat statistik...</p>
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistik Keuangan</h1>
          <p className="text-gray-500 text-sm mt-1">Analisis pemasukan dan pengeluaran Anda</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-blue-500" />
            <p className="text-xs text-gray-500">Saldo</p>
          </div>
          <p className={`text-lg font-bold mt-1 ${balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <p className="text-xs text-gray-500">Pemasukan</p>
          </div>
          <p className="text-lg font-bold text-emerald-600 mt-1">
            {formatCurrency(totalIncome)}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-rose-500" />
            <p className="text-xs text-gray-500">Pengeluaran</p>
          </div>
          <p className="text-lg font-bold text-rose-600 mt-1">
            {formatCurrency(totalExpense)}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-500" />
            <p className="text-xs text-gray-500">Transaksi</p>
          </div>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {filteredTransactions.length}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense (Area Chart) */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Pemasukan vs Pengeluaran (6 Bulan)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => `Rp ${(v/1000)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="income" stroke="#6366f1" fill="url(#incomeGradient)" name="Pemasukan" />
              <Area type="monotone" dataKey="expense" stroke="#f43f5e" fill="url(#expenseGradient)" name="Pengeluaran" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Balance Trend (Line Chart) */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Tren Saldo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => `Rp ${(v/1000)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="balance" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} name="Saldo" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense by Category (Pie Chart) */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Pengeluaran per Kategori</h3>
          {expenseByCategory.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-gray-400 text-sm">Belum ada data pengeluaran</div>
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

        {/* Income by Category (Pie Chart) */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Pemasukan per Kategori</h3>
          {incomeByCategory.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-gray-400 text-sm">Belum ada data pemasukan</div>
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

        {/* Summary Stats */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Ringkasan Bulan Ini</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">Total Transaksi</p>
              <p className="text-lg font-bold text-gray-900">{filteredTransactions.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Rata-rata Pemasukan</p>
              <p className="text-lg font-bold text-emerald-600">{formatCurrency(avgIncome)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Rata-rata Pengeluaran</p>
              <p className="text-lg font-bold text-rose-600">{formatCurrency(avgExpense)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Jumlah Kategori</p>
              <p className="text-lg font-bold text-gray-900">
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