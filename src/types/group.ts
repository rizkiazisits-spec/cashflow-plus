export type GroupRole = 'admin' | 'member'

export interface SavingGroup {
  id: string
  name: string
  description?: string
  targetAmount: number
  currentAmount: number
  deadline: string
  createdBy: string
  isCompleted: boolean
  inviteCode: string
  createdAt: string
  updatedAt: string
}

export interface GroupMember {
  id: string
  groupId: string
  userId: string
  role: GroupRole
  joinedAt: string
}

export interface GroupContribution {
  id: string
  groupId: string
  userId: string
  amount: number
  note?: string
  createdAt: string
}

export interface GroupWithMembers extends SavingGroup {
  members: GroupMember[]
  contributions: GroupContribution[]
}