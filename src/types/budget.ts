export interface Budget {
  id: string
  category: string
  amount: number // Budget maksimum
  month: string // Format: "YYYY-MM"
  spent: number // Total pengeluaran untuk kategori ini di bulan ini
  createdAt: string
  updatedAt: string
}

export type BudgetInput = Omit<Budget, 'id' | 'spent' | 'createdAt' | 'updatedAt'>