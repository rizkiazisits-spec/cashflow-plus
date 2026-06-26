import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Transaction, TransactionInput } from '@/types/transaction'
import { useAuth } from '@/contexts/AuthContext'

// Fetch semua transaksi milik user
const fetchTransactions = async (userId: string): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    amount: item.amount,
    type: item.type,
    category: item.category,
    date: item.date,
    description: item.description || '',
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }))
}

// Tambah transaksi
const addTransaction = async (userId: string, input: TransactionInput) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      title: input.title,
      amount: input.amount,
      type: input.type,
      category: input.category,
      date: input.date,
      description: input.description || null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return {
    id: data.id,
    title: data.title,
    amount: data.amount,
    type: data.type,
    category: data.category,
    date: data.date,
    description: data.description || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as Transaction
}

// Edit transaksi
const editTransaction = async (id: string, userId: string, input: Partial<TransactionInput>) => {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return {
    id: data.id,
    title: data.title,
    amount: data.amount,
    type: data.type,
    category: data.category,
    date: data.date,
    description: data.description || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as Transaction
}

// Hapus transaksi
const deleteTransaction = async (id: string, userId: string) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
  return id
}

export function useTransactions() {
  const { user } = useAuth()
  const userId = user?.id
  const queryClient = useQueryClient()
  const queryKey = ['transactions', userId]

  // Query untuk mengambil data
  const {
    data: transactions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated')
      return fetchTransactions(userId)
    },
    enabled: !!userId,
  })

  // Mutasi tambah dengan optimistik update
  const addMutation = useMutation({
    mutationFn: (input: TransactionInput) => {
      if (!userId) throw new Error('User not authenticated')
      return addTransaction(userId, input)
    },
    onMutate: async (newTransaction) => {
      await queryClient.cancelQueries({ queryKey })
      const previousTransactions = queryClient.getQueryData<Transaction[]>(queryKey) || []

      const optimisticTransaction: Transaction = {
        id: `temp-${Date.now()}`,
        ...newTransaction,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      queryClient.setQueryData<Transaction[]>(queryKey, [
        optimisticTransaction,
        ...previousTransactions,
      ])

      return { previousTransactions }
    },
    onError: (_err, _newTransaction, context) => {
      queryClient.setQueryData<Transaction[]>(queryKey, context?.previousTransactions || [])
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  // Mutasi edit
  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TransactionInput> }) => {
      if (!userId) throw new Error('User not authenticated')
      return editTransaction(id, userId, data)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  // Mutasi hapus
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!userId) throw new Error('User not authenticated')
      return deleteTransaction(id, userId)
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey })
      const previousTransactions = queryClient.getQueryData<Transaction[]>(queryKey) || []
      queryClient.setQueryData<Transaction[]>(
        queryKey,
        previousTransactions.filter((tx) => tx.id !== deletedId)
      )
      return { previousTransactions }
    },
    onError: (_err, _deletedId, context) => {
      queryClient.setQueryData<Transaction[]>(queryKey, context?.previousTransactions || [])
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  // Total perhitungan
  const totalIncome = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalExpense = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const balance = totalIncome - totalExpense

  return {
    transactions,
    isLoading,
    error,
    addTransaction: addMutation.mutateAsync,
    editTransaction: editMutation.mutateAsync,
    deleteTransaction: deleteMutation.mutateAsync,
    totalIncome,
    totalExpense,
    balance,
  }
}