import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Copy, Users, Target, Wallet } from 'lucide-react'
import { useGroups } from '@/hooks'
import GroupCard from './GroupCard'
import CreateGroupModal from './CreateGroupModal'
import JoinGroupModal from './JoinGroupModal'

function GroupGoals() {
  const { groups, isLoadingGroups, createGroup, joinGroup } = useGroups()
  const navigate = useNavigate()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isJoinOpen, setIsJoinOpen] = useState(false)

  // Summary stats
  const totalGroups = groups.length
  const totalTarget = groups.reduce(
    (sum: number, g: any) => sum + (g.target_amount || 0),
    0
  )
  const totalSaved = groups.reduce(
    (sum: number, g: any) => sum + (g.current_amount || 0),
    0
  )
  const totalMembers = groups.reduce(
    (sum: number, g: any) => sum + (g.member_count || 0),
    0
  )

  const handleCreate = async (data: any) => {
    await createGroup(data)
  }

  const handleJoin = async (code: string) => {
    await joinGroup(code)
  }

  if (isLoadingGroups) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Memuat target bersama...
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Target</p>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            {totalGroups}
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-emerald-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Terkumpul</p>
          </div>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            Rp {totalSaved.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Anggota</p>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            {totalMembers}
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Target Total</p>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            Rp {totalTarget.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          Buat Target
        </button>

        <button
          onClick={() => setIsJoinOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Copy className="h-4 w-4" />
          Gabung dengan Kode
        </button>
      </div>

      {/* Daftar Target Bersama */}
      {groups.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="text-center">
            <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-3">
              Belum ada target bersama
            </p>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
              Buat target atau bergabung dengan kode undangan
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group: any) => (
            <GroupCard
              key={group.id}
              group={group}
              onClick={() => navigate(`/dashboard/groups/${group.id}`)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateGroupModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <JoinGroupModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onJoin={handleJoin}
      />
    </>
  )
}

export default GroupGoals