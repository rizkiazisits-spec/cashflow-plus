import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Transaction, TransactionInput } from '@/types/transaction'
import Input from '@/components/ui/Input'
import InputCurrency from '@/components/ui/InputCurrency'
import { cn } from '@/lib/utils'

const transactionSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  amount: z.number().min(1, 'Nominal minimal Rp 1'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Kategori wajib diisi'),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  description: z.string().optional(),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface TransactionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TransactionInput) => void
  initialData?: Transaction | null
}

const defaultCategories = {
  income: ['Pemasukan', 'Gaji', 'Bonus', 'Investasi', 'Lainnya'],
  expense: ['Kebutuhan', 'Makanan', 'Transport', 'Pengeluaran', 'Hiburan', 'Lainnya'],
}

function TransactionForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
    },
  })

  const selectedType = watch('type')
  const amountValue = watch('amount')

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        amount: initialData.amount,
        type: initialData.type,
        category: initialData.category,
        date: initialData.date.split('T')[0],
        description: initialData.description || '',
      })
    }
  }, [initialData, reset])

  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  const handleFormSubmit = (data: TransactionFormData) => {
    onSubmit({
      title: data.title,
      amount: data.amount,
      type: data.type,
      category: data.category,
      date: new Date(data.date).toISOString(),
      description: data.description,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {initialData ? 'Edit Transaksi' : 'Tambah Transaksi'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            label="Judul"
            placeholder="Masukkan judul transaksi"
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Tipe
              </label>
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50/50 dark:bg-gray-800/50">
                <button
                  type="button"
                  onClick={() => setValue('type', 'income')}
                  className={cn(
                    'flex-1 rounded-md py-1.5 text-xs font-medium transition-colors',
                    selectedType === 'income'
                      ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  )}
                >
                  Pemasukan
                </button>
                <button
                  type="button"
                  onClick={() => setValue('type', 'expense')}
                  className={cn(
                    'flex-1 rounded-md py-1.5 text-xs font-medium transition-colors',
                    selectedType === 'expense'
                      ? 'bg-white dark:bg-gray-700 text-rose-600 dark:text-rose-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  )}
                >
                  Pengeluaran
                </button>
              </div>
              <input type="hidden" {...register('type')} />
            </div>

            <InputCurrency
              label="Nominal"
              value={amountValue}
              onValueChange={(val) => setValue('amount', val || 0)}
              error={errors.amount?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Kategori
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:text-white"
              {...register('category')}
            >
              <option value="">Pilih kategori</option>
              {(selectedType === 'income'
                ? defaultCategories.income
                : defaultCategories.expense
              ).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.category.message}</p>
            )}
          </div>

          <Input
            label="Tanggal"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Deskripsi (opsional)
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none dark:text-white"
              rows={2}
              placeholder="Tambahkan catatan..."
              {...register('description')}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransactionForm