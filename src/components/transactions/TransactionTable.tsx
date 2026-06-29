import { Transaction } from '@/types/transaction'
import { Pencil, Trash2, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TransactionTableProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
  onSort: (field: 'date' | 'amount') => void
}

function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  onSort,
}: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="text-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm">Belum ada transaksi</p>
          <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Mulai catat transaksi sekarang</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatAmount = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
          <thead className="bg-gray-50/50 dark:bg-gray-700/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Transaksi
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kategori
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors group"
                onClick={() => onSort('date')}
              >
                <span className="flex items-center gap-1">
                  Tanggal
                  <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                </span>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors group"
                onClick={() => onSort('amount')}
              >
                <span className="flex items-center justify-end gap-1">
                  Nominal
                  <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                </span>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700 bg-white dark:bg-gray-800">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors group">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{tx.title}</p>
                    {tx.description && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[200px]">
                        {tx.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                    {tx.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(tx.date)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    )}
                  >
                    {tx.type === 'income' ? '+' : '-'} {formatAmount(tx.amount)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(tx)}
                      className="rounded-lg p-1.5 text-gray-400 dark:text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(tx.id)}
                      className="rounded-lg p-1.5 text-gray-400 dark:text-gray-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TransactionTable