import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface TransactionItemProps {
  icon: LucideIcon
  iconBgColor: string
  iconColor: string
  title: string
  category: string
  date: string
  amount: number
  type: 'income' | 'expense'
}

function TransactionItem({
  icon: Icon,
  iconBgColor,
  iconColor,
  title,
  category,
  date,
  amount,
  type,
}: TransactionItemProps) {
  const isIncome = type === 'income'

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      {/* Icon */}
      <div className={cn('rounded-xl p-2.5', iconBgColor)}>
        <Icon className={cn('h-5 w-5', iconColor)} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{category}</span>
          <span className="h-1 w-1 rounded-full bg-gray-300" />
          <span>{date}</span>
        </div>
      </div>

      {/* Amount */}
      <p
        className={cn(
          'text-sm font-semibold',
          isIncome ? 'text-emerald-600' : 'text-rose-600'
        )}
      >
        {isIncome ? '+' : '-'} Rp {amount.toLocaleString('id-ID')}
      </p>
    </div>
  )
}

export default TransactionItem