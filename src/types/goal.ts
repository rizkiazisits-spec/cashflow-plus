export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string // ISO date
  description?: string
  createdAt: string
  updatedAt: string
}

export type GoalInput = Omit<Goal, 'id' | 'currentAmount' | 'createdAt' | 'updatedAt'>