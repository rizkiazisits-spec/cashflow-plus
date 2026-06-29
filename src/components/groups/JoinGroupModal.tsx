import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface JoinGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onJoin: (code: string) => Promise<void>
}

function JoinGroupModal({ isOpen, onClose, onJoin }: JoinGroupModalProps) {
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setInviteCode('')
      setError('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteCode.trim()) {
      setError('Masukkan kode undangan')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      await onJoin(inviteCode.trim().toUpperCase())
      onClose()
    } catch (err: any) {
      setError(err.message || 'Kode tidak valid')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Gabung dengan Kode
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Masukkan kode undangan yang diberikan oleh admin target bersama.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Contoh: ABC123"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:text-white uppercase"
              maxLength={8}
            />
          </div>
          {error && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>
          )}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Memproses...' : 'Gabung'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default JoinGroupModal