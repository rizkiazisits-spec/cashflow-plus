import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Budget, BudgetInput } from '@/types/budget'
import Input from '@/components/ui/Input'
import InputCurrency from '@/components/ui/InputCurrency'

const budgetSchema = z.object({
  category: z.string().min(1, 'Kategori wajib diisi'),
  amount: z.number().min(1, 'Nominal minimal Rp 1'),
  month: z.string().min(1, 'Bulan wajib diisi'),
})

type BudgetFormData = z.infer<typeof budgetSchema>

interface BudgetFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: BudgetInput) => void
  initialData?: Budget | null
}

function BudgetForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: BudgetFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      month: new Date().toISOString().slice(0, 7),
      amount: 0,
    },
  })

  const amountValue = watch('amount')

  useEffect(() => {
    if (initialData) {
      reset({
        category: initialData.category,
        amount: initialData.amount,
        month: initialData.month,
      })
    }
  }, [initialData, reset])

  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  const handleFormSubmit = (data: BudgetFormData) => {
    onSubmit({
      category: data.category,
      amount: data.amount,
      month: data.month,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {initialData ? 'Edit Budget' : 'Tambah Budget'}
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
            label="Kategori"
            placeholder="Masukkan nama kategori"
            error={errors.category?.message}
            {...register('category')}
          />

          <InputCurrency
            label="Nominal Budget"
            value={amountValue}
            onValueChange={(val) => setValue('amount', val || 0)}
            error={errors.amount?.message}
          />

          <Input
            label="Bulan"
            type="month"
            error={errors.month?.message}
            {...register('month')}
          />

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

export default BudgetForm