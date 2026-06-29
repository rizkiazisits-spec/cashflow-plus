import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

// ========== HOOK ==========
export function useGroups() {
  const { user } = useAuth()
  const userId = user?.id
  const queryClient = useQueryClient()

  // ===== QUERY: Daftar group yang diikuti/dibuat =====
  const {
    data: groups = [],
    isLoading: isLoadingGroups,
    error: groupsError,
  } = useQuery({
    queryKey: ['groups', userId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_my_groups')
      if (error) throw new Error(error.message)
      return data || []
    },
    enabled: !!userId,
  })

  // ===== QUERY: Detail group (dipanggil per ID) =====
  const getGroupDetail = (groupId: string | undefined) => {
    return useQuery({
      queryKey: ['group', groupId, userId],
      queryFn: async () => {
        if (!groupId) throw new Error('Group ID required')
        const { data, error } = await supabase.rpc('get_group_detail', {
          _group_id: groupId,
        })
        if (error) throw new Error(error.message)
        return data
      },
      enabled: !!userId && !!groupId,
    })
  }

  // ===== MUTASI: Buat target =====
  const createMutation = useMutation({
    mutationFn: async (input: any) => {
      const { data, error } = await supabase
        .from('saving_groups')
        .insert({
          name: input.name,
          description: input.description || '',
          target_amount: input.targetAmount,
          deadline: input.deadline,
          created_by: userId,
          current_amount: 0,
          is_completed: false,
        })
        .select()
        .single()

      if (error) throw new Error(error.message)

      // Otomatis jadi admin
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: data.id,
          user_id: userId,
          role: 'admin',
        })

      if (memberError) throw new Error(memberError.message)

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', userId] })
    },
  })

  // ===== MUTASI: Gabung dengan kode =====
  const joinMutation = useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await supabase.rpc('join_group_by_invite_code', {
        _invite_code: code,
      })
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', userId] })
    },
  })

  // ===== MUTASI: Tambah kontribusi =====
  const contributeMutation = useMutation({
    mutationFn: async ({
      groupId,
      amount,
      note,
    }: {
      groupId: string
      amount: number
      note?: string
    }) => {
      const { data, error } = await supabase.rpc('add_contribution', {
        _group_id: groupId,
        _amount: amount,
        _note: note || '',
      })
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', userId] })
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] })
    },
  })

  // ===== MUTASI: Edit group (admin) =====
  const editMutation = useMutation({
    mutationFn: async ({
      groupId,
      input,
    }: {
      groupId: string
      input: {
        name: string
        description?: string
        targetAmount: number
        deadline: string
      }
    }) => {
      const { error } = await supabase.rpc('edit_group', {
        _group_id: groupId,
        _name: input.name,
        _description: input.description || '',
        _target_amount: input.targetAmount,
        _deadline: input.deadline,
      })
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', userId] })
    },
  })

  // ===== MUTASI: Promote ke admin =====
  const promoteMutation = useMutation({
    mutationFn: async ({
      groupId,
      targetUserId,
    }: {
      groupId: string
      targetUserId: string
    }) => {
      const { error } = await supabase.rpc('promote_to_admin', {
        _group_id: groupId,
        _target_user_id: targetUserId,
      })
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', userId] })
    },
  })

  // ===== MUTASI: Hapus anggota =====
  const removeMutation = useMutation({
    mutationFn: async ({
      groupId,
      targetUserId,
    }: {
      groupId: string
      targetUserId: string
    }) => {
      const { error } = await supabase.rpc('remove_member', {
        _group_id: groupId,
        _target_user_id: targetUserId,
      })
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', userId] })
    },
  })

  // ===== MUTASI: Selesaikan target =====
  const completeMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const { error } = await supabase.rpc('complete_group', {
        _group_id: groupId,
      })
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', userId] })
    },
  })

  return {
    // Data & loading
    groups,
    isLoadingGroups,
    groupsError,

    // Queries
    getGroupDetail,

    // Mutations
    createGroup: createMutation.mutateAsync,
    joinGroup: joinMutation.mutateAsync,
    addContribution: contributeMutation.mutateAsync,
    editGroup: editMutation.mutateAsync,
    promoteToAdmin: promoteMutation.mutateAsync,
    removeMember: removeMutation.mutateAsync,
    completeGroup: completeMutation.mutateAsync,
  }
}

// ===== HOOK UNTUK DETAIL GROUP (STANDALONE) =====
export function useGroupDetail(groupId: string | undefined) {
  const { user } = useAuth()
  const userId = user?.id

  return useQuery({
    queryKey: ['group', groupId, userId],
    queryFn: async () => {
      if (!groupId) throw new Error('Group ID required')
      const { data, error } = await supabase.rpc('get_group_detail', {
        _group_id: groupId,
      })
      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!userId && !!groupId,
  })
}