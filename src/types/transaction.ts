export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  title: string
  amount: number
  type: TransactionType
  category: string
  date: string // ISO string
  description?: string
  createdAt: string
  updatedAt: string
}

export type TransactionInput = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>