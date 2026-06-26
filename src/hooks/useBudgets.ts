import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Budget, BudgetInput } from '@/types/budget'
import { useAuth } from '@/contexts/AuthContext'

const fetchBudgets = async (userId: string): Promise<Budget[]> => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .order('category', { ascending: true })

  if (error) throw new Error(error.message)
  return data.map((item: any) => ({
    id: item.id,
    category: item.category,
    amount: item.amount,
    month: item.month,
    spent: item.spent || 0,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }))
}

const addBudget = async (userId: string, input: BudgetInput) => {
  const { data, error } = await supabase
    .from('budgets')
    .insert({
      user_id: userId,
      category: input.category,
      amount: input.amount,
      month: input.month,
      spent: 0,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Budget
}

const editBudget = async (id: string, userId: string, input: Partial<BudgetInput>) => {
  const { data, error } = await supabase
    .from('budgets')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Budget
}

const deleteBudget = async (id: string, userId: string) => {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
  return id
}

// Update spent amount (dipanggil saat transaksi ditambahkan/dihapus)
const updateBudgetSpent = async (category: string, month: string, userId: string, delta: number) => {
  // Ambil budget yang sesuai
  const { data: existing } = await supabase
    .from('budgets')
    .select('id, spent')
    .eq('user_id', userId)
    .eq('category', category)
    .eq('month', month)
    .single()

  if (!existing) return

  const newSpent = Math.max(0, existing.spent + delta)
  const { error } = await supabase
    .from('budgets')
    .update({ spent: newSpent, updated_at: new Date().toISOString() })
    .eq('id', existing.id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}

export function useBudgets() {
  const { user } = useAuth()
  const userId = user?.id
  const queryClient = useQueryClient()

  const {
    data: budgets = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['budgets', userId],
    queryFn: () => fetchBudgets(userId!),
    enabled: !!userId,
  })

  const addMutation = useMutation({
    mutationFn: (input: BudgetInput) => addBudget(userId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', userId] })
    },
  })

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BudgetInput> }) =>
      editBudget(id, userId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', userId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBudget(id, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', userId] })
    },
  })

  const updateSpent = async (category: string, delta: number) => {
    const month = new Date().toISOString().slice(0, 7)
    await updateBudgetSpent(category, month, userId!, delta)
    queryClient.invalidateQueries({ queryKey: ['budgets', userId] })
  }

  return {
    budgets,
    isLoading,
    error,
    addBudget: addMutation.mutateAsync,
    editBudget: editMutation.mutateAsync,
    deleteBudget: deleteMutation.mutateAsync,
    updateSpent,
    getBudgetByCategory: (category: string) => budgets.find((b) => b.category === category),
  }
}