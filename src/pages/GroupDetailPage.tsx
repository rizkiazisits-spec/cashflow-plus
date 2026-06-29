import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Calendar, Crown, Plus, CheckCircle, Loader2, Edit, UserCog, Flag } from 'lucide-react'
import { useGroupDetail, useGroups } from '@/hooks/useGroups'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import InputCurrency from '@/components/ui/InputCurrency'
import EditGroupModal from '@/components/groups/EditGroupModal'
import ManageMembersModal from '@/components/groups/ManageMembersModal'

function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: group, isLoading, error, refetch } = useGroupDetail(groupId)
  const { addContribution, completeGroup } = useGroups()

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Modal states
  const [showAddContribution, setShowAddContribution] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showManageMembers, setShowManageMembers] = useState(false)
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false)

  // Contribution form
  const [amount, setAmount] = useState<number | undefined>(0)
  const [note, setNote] = useState('')
  const [submitError, setSubmitError] = useState('')

  const resetForm = () => {
    setAmount(0)
    setNote('')
    setSubmitError('')
    setIsSubmitting(false)
  }

  const handleCloseModal = () => {
    setShowAddContribution(false)
    resetForm()
  }

  const handleSubmitContribution = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    const numAmount = amount || 0
    if (!numAmount || numAmount <= 0) {
      setSubmitError('Masukkan nominal yang valid')
      return
    }
    if (!groupId) {
      setSubmitError('Group ID tidak ditemukan')
      return
    }

    setIsSubmitting(true)
    try {
      await addContribution({ groupId, amount: numAmount, note: note || undefined })
      await refetch()
      handleCloseModal()
    } catch (err: any) {
      setSubmitError(err.message || 'Gagal menambahkan kontribusi')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCompleteGroup = async () => {
    if (!groupId) return
    setIsSubmitting(true)
    try {
      await completeGroup(groupId)
      await refetch()
      setShowCompleteConfirm(false)
    } catch (err: any) {
      alert(err.message || 'Gagal menyelesaikan target')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if current user is admin
  const currentUserId = user?.id
  const isAdmin = group?.members?.some((m: any) => m.userId === currentUserId && m.role === 'admin') || false

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Memuat detail target...</p>
        </div>
      </div>
    )
  }

  if (error || !group) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-500 dark:text-red-400">Gagal memuat detail target</p>
      </div>
    )
  }

  const formatCurrency = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const percentage = Math.min((group.currentAmount / group.targetAmount) * 100, 100)
  const isCompleted = group.isCompleted
  const isOverdue = !isCompleted && new Date(group.deadline) < new Date()

  const totalContributions = group.contributions?.reduce((sum: number, c: any) => sum + c.amount, 0) || 0

  const membersWithPercentage = (group.members || []).map((member: any) => {
    const userContributions = (group.contributions || []).filter((c: any) => c.userId === member.userId)
    const totalUserContribution = userContributions.reduce((sum: number, c: any) => sum + c.amount, 0)
    const percentage = totalContributions > 0 ? (totalUserContribution / totalContributions) * 100 : 0
    return {
      ...member,
      totalContribution: totalUserContribution,
      percentage,
    }
  })

  const sortedMembers = [...membersWithPercentage].sort((a: any, b: any) => {
    if (a.role === 'admin' && b.role !== 'admin') return -1
    if (a.role !== 'admin' && b.role === 'admin') return 1
    return b.totalContribution - a.totalContribution
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <button
        onClick={() => navigate('/dashboard/goals')}
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar target
      </button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{group.name}</h1>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" /> Selesai
              </span>
            )}
            {isOverdue && !isCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-900/30 px-3 py-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                Terlewat
              </span>
            )}
          </div>
          {group.description && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{group.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Deadline: {formatDate(group.deadline)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{(group.members || []).length} anggota</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                Kode: {group.inviteCode}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {isAdmin && !isCompleted && (
            <>
              <button
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => setShowManageMembers(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <UserCog className="h-4 w-4" />
                Kelola Anggota
              </button>
              <button
                onClick={() => setShowCompleteConfirm(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 dark:bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
              >
                <Flag className="h-4 w-4" />
                Selesaikan
              </button>
            </>
          )}
          <button
            onClick={() => setShowAddContribution(true)}
            disabled={isCompleted}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300 ${
              isCompleted
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-md hover:scale-[1.02]'
            }`}
          >
            <Plus className="h-4 w-4" />
            Tambah Kontribusi
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progres</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {formatCurrency(group.currentAmount)} / {formatCurrency(group.targetAmount)}
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted ? 'bg-emerald-500' : isOverdue ? 'bg-rose-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
          <span>{Math.round(percentage)}% terkumpul</span>
          <span>Target {formatCurrency(group.targetAmount)}</span>
        </div>
      </div>

      {/* Daftar Anggota */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">👥 Anggota</h3>
          <span className="text-xs text-gray-400 dark:text-gray-500">{(group.members || []).length} anggota</span>
        </div>
        <div className="space-y-3">
          {sortedMembers.map((member: any) => (
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
                {member.role === 'admin' && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(member.totalContribution)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {member.percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Riwayat Kontribusi */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">📋 Riwayat Kontribusi</h3>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {(group.contributions || []).length} kontribusi
          </span>
        </div>
        {(group.contributions || []).length === 0 ? (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
            Belum ada kontribusi
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {(group.contributions || []).map((contrib: any) => {
              const member = (group.members || []).find((m: any) => m.userId === contrib.userId)
              return (
                <div
                  key={contrib.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-medium">
                      {member?.user.fullName.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {member?.user.fullName || 'User tidak ditemukan'}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDate(contrib.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(contrib.amount)}
                    </p>
                    {contrib.note && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">{contrib.note}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal Tambah Kontribusi */}
      {showAddContribution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tambah Kontribusi</h3>
              <button
                onClick={handleCloseModal}
                className="rounded-lg p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Masukkan nominal kontribusi Anda ke target bersama ini.
            </p>
            <form onSubmit={handleSubmitContribution}>
              <div className="mb-4">
                <InputCurrency
                  label="Nominal"
                  value={amount}
                  onValueChange={(val) => setAmount(val || 0)}
                  error={submitError}
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Catatan (opsional)
                </label>
                <input
                  type="text"
                  placeholder="Tambahkan catatan..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                  disabled={isSubmitting}
                />
              </div>
              {submitError && (
                <p className="text-sm text-red-500 dark:text-red-400 mb-3">{submitError}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Kirim'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      <EditGroupModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        group={group}
        onSuccess={() => refetch()}
      />

      {/* Manage Members Modal */}
      <ManageMembersModal
        isOpen={showManageMembers}
        onClose={() => setShowManageMembers(false)}
        group={group}
        onSuccess={() => refetch()}
      />

      {/* Complete Confirmation Modal */}
      {showCompleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Selesaikan Target?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Apakah Anda yakin ingin menandai target ini sebagai selesai? Ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteConfirm(false)}
                className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleCompleteGroup}
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-emerald-600 dark:bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Ya, Selesaikan'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default GroupDetailPage