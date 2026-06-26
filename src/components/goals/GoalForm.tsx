import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Goal, GoalInput } from '@/types/goal'
import Input from '@/components/ui/Input'

const goalSchema = z.object({
  name: z.string().min(1, 'Nama target wajib diisi'),
  targetAmount: z.number().min(1, 'Nominal minimal Rp 1'),
  deadline: z.string().min(1, 'Deadline wajib diisi'),
  description: z.string().optional(),
})

type GoalFormData = z.infer<typeof goalSchema>

interface GoalFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: GoalInput) => void
  initialData?: Goal | null
}

function GoalForm({ isOpen, onClose, onSubmit, initialData }: GoalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
  })

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        targetAmount: initialData.targetAmount,
        deadline: initialData.deadline.split('T')[0],
        description: initialData.description || '',
      })
    }
  }, [initialData, reset])

  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  const handleFormSubmit = (data: GoalFormData) => {
    onSubmit({
      name: data.name,
      targetAmount: data.targetAmount,
      deadline: new Date(data.deadline).toISOString(),
      description: data.description,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {initialData ? 'Edit Target' : 'Tambah Target'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            label="Nama Target"
            placeholder="Contoh: Liburan ke Bali"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Target Nominal"
            type="number"
            placeholder="0"
            error={errors.targetAmount?.message}
            {...register('targetAmount', { valueAsNumber: true })}
          />
          <Input
            label="Deadline"
            type="date"
            error={errors.deadline?.message}
            {...register('deadline')}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Deskripsi (opsional)
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
              rows={2}
              placeholder="Tambahkan catatan..."
              {...register('description')}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
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

export default GoalForm