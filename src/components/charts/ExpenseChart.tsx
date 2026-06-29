import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Transaction } from '@/types/transaction'

interface ExpenseChartProps {
  transactions: Transaction[]
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f43f5e']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-white dark:bg-gray-800 p-3 shadow-lg border border-gray-100 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Rp {payload[0].value.toLocaleString('id-ID')}
        </p>
      </div>
    )
  }
  return null
}

function ExpenseChart({ transactions }: ExpenseChartProps) {
  const expenseData = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((acc: Record<string, number>, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount
      return acc
    }, {})

  const data = Object.entries(expenseData).map(([name, value]) => ({ name, value }))
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-[340px]"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Pengeluaran per Kategori</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Bulan ini</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500">Total</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            Rp {total.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[85%] items-center justify-center text-sm text-gray-400 dark:text-gray-500">
          Belum ada data pengeluaran
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
            barSize={28}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" strokeOpacity={0.4} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickFormatter={(value) => `Rp ${(value / 1000)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  )
}

export default ExpenseChart