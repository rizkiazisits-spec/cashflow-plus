import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2 } from 'lucide-react'
import Input from '@/components/ui/Input'
import InputCurrency from '@/components/ui/InputCurrency'
import { useGroups } from '@/hooks/useGroups'

const editGroupSchema = z.object({
  name: z.string().min(1, 'Nama target wajib diisi'),
  description: z.string().optional(),
  targetAmount: z.number().min(1, 'Nominal minimal Rp 1'),
  deadline: z.string().min(1, 'Deadline wajib diisi'),
})

type EditGroupFormData = z.infer<typeof editGroupSchema>

interface EditGroupModalProps {
  isOpen: boolean
  onClose: () => void
  group: any
  onSuccess: () => void
}

function EditGroupModal({ isOpen, onClose, group, onSuccess }: EditGroupModalProps) {
  const { editGroup } = useGroups()
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditGroupFormData>({
    resolver: zodResolver(editGroupSchema),
    defaultValues: {
      targetAmount: 0,
    },
  })

  const targetAmountValue = watch('targetAmount')

  useEffect(() => {
    if (group && isOpen) {
      reset({
        name: group.name,
        description: group.description || '',
        targetAmount: group.targetAmount,
        deadline: group.deadline.split('T')[0],
      })
    }
  }, [group, isOpen, reset])

  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  const onSubmit = async (data: EditGroupFormData) => {
    if (!group) return
    try {
      await editGroup({
        groupId: group.id,
        input: {
          name: data.name,
          description: data.description,
          targetAmount: data.targetAmount,
          deadline: new Date(data.deadline).toISOString(),
        },
      })
      onSuccess()
      onClose()
    } catch (error) {
      alert('Gagal mengupdate target')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Target</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nama Target"
            placeholder="Contoh: Liburan ke Bali"
            error={errors.name?.message}
            {...register('name')}
          />

          <InputCurrency
            label="Target Nominal"
            value={targetAmountValue}
            onValueChange={(val) => setValue('targetAmount', val || 0)}
            error={errors.targetAmount?.message}
          />

          <Input
            label="Deadline"
            type="date"
            error={errors.deadline?.message}
            {...register('deadline')}
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
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditGroupModal