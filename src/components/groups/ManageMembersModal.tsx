import { useState } from 'react'
import { X, Crown, Trash2 } from 'lucide-react'
import { useGroups } from '@/hooks/useGroups'

interface ManageMembersModalProps {
  isOpen: boolean
  onClose: () => void
  group: any
  onSuccess: () => void
}

function ManageMembersModal({ isOpen, onClose, group, onSuccess }: ManageMembersModalProps) {
  const { promoteToAdmin, removeMember } = useGroups()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const sortedMembers = [...group.members].sort((a, b) => {
    if (a.role === 'admin' && b.role !== 'admin') return -1
    if (a.role !== 'admin' && b.role === 'admin') return 1
    return 0
  })

  const handlePromote = async (userId: string) => {
    setIsLoading(true)
    setError('')
    try {
      await promoteToAdmin({ groupId: group.id, targetUserId: userId })
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Gagal mengubah role')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async (userId: string) => {
    if (!confirm('Apakah Anda yakin ingin mengeluarkan anggota ini?')) return
    setIsLoading(true)
    setError('')
    try {
      await removeMember({ groupId: group.id, targetUserId: userId })
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus anggota')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">👥 Kelola Anggota</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {sortedMembers.map((member) => {
            const isAdmin = member.role === 'admin'
            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-medium">
                    {member.user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.user.fullName}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{member.user.email}</p>
                  </div>
                  {isAdmin && <Crown className="h-4 w-4 text-yellow-500" />}
                </div>
                <div className="flex gap-2">
                  {!isAdmin && (
                    <button
                      onClick={() => handlePromote(member.userId)}
                      disabled={isLoading}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                    >
                      Jadikan Admin
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(member.userId)}
                    disabled={isLoading}
                    className="text-red-500 dark:text-red-400 hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
          💡 Admin dapat mengelola anggota dan menyelesaikan target.
        </p>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl border border-gray-200 dark:border-gray-700 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  )
}

export default ManageMembersModal