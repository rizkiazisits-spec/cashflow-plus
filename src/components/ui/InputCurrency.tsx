import CurrencyInput from 'react-currency-input-field'
import { cn } from '@/lib/utils'

interface InputCurrencyProps {
  label?: string
  value?: number | string
  onValueChange?: (value: number | undefined) => void
  placeholder?: string
  error?: string
  disabled?: boolean
  className?: string
}

function InputCurrency({
  label,
  value,
  onValueChange,
  placeholder = '0',
  error,
  disabled,
  className,
}: InputCurrencyProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <CurrencyInput
        id="currency-input"
        name="currency-input"
        placeholder={placeholder}
        value={value}
        onValueChange={(val) => {
          // val adalah string (contoh: "Rp 1.000.000") atau undefined
          // Hapus semua karakter non-digit, parse ke number
          const raw = val?.replace(/[^0-9]/g, '') || ''
          const num = raw ? parseFloat(raw) : undefined
          onValueChange?.(num)
        }}
        intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
        className={cn(
          'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm outline-none transition-all dark:text-white',
          'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        disabled={disabled}
        prefix="Rp "
        groupSeparator="."
        decimalSeparator=","
        decimalScale={0}
        allowNegativeValue={false}
      />
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  )
}

export default InputCurrency