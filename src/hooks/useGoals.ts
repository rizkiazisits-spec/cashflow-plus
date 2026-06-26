import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Goal, GoalInput } from '@/types/goal'
import { useAuth } from '@/contexts/AuthContext'

const fetchGoals = async (userId: string): Promise<Goal[]> => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('deadline', { ascending: true })

  if (error) throw new Error(error.message)
  return data.map((item: any) => ({
    id: item.id,
    name: item.name,
    targetAmount: item.target_amount,
    currentAmount: item.current_amount || 0,
    deadline: item.deadline,
    description: item.description || '',
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }))
}

const addGoal = async (userId: string, input: GoalInput) => {
  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: userId,
      name: input.name,
      target_amount: input.targetAmount,
      deadline: input.deadline,
      description: input.description || null,
      current_amount: 0,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Goal
}

const editGoal = async (id: string, userId: string, input: Partial<GoalInput>) => {
  const { data, error } = await supabase
    .from('goals')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Goal
}

const deleteGoal = async (id: string, userId: string) => {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
  return id
}

const addSavingsToGoal = async (id: string, userId: string, amount: number) => {
  // Ambil goal saat ini
  const { data: goal } = await supabase
    .from('goals')
    .select('current_amount, target_amount')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (!goal) throw new Error('Goal not found')
  const newAmount = Math.min(goal.current_amount + amount, goal.target_amount)

  const { data, error } = await supabase
    .from('goals')
    .update({
      current_amount: newAmount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Goal
}

export function useGoals() {
  const { user } = useAuth()
  const userId = user?.id
  const queryClient = useQueryClient()

  const {
    data: goals = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['goals', userId],
    queryFn: () => fetchGoals(userId!),
    enabled: !!userId,
  })

  const addMutation = useMutation({
    mutationFn: (input: GoalInput) => addGoal(userId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] })
    },
  })

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GoalInput> }) =>
      editGoal(id, userId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGoal(id, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] })
    },
  })

  const addSavingsMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      addSavingsToGoal(id, userId!, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] })
    },
  })

  const getProgress = (goal: Goal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  }

  const getGoalStatus = (goal: Goal) => {
    const progress = getProgress(goal)
    if (progress >= 100) return 'completed'
    const today = new Date()
    const deadline = new Date(goal.deadline)
    const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (daysLeft < 0) return 'overdue'
    if (progress < 30 && daysLeft < 30) return 'behind'
    return 'on-track'
  }

  return {
    goals,
    isLoading,
    error,
    addGoal: addMutation.mutateAsync,
    editGoal: editMutation.mutateAsync,
    deleteGoal: deleteMutation.mutateAsync,
    addSavings: addSavingsMutation.mutateAsync,
    getProgress,
    getGoalStatus,
  }
}