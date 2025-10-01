import { Category, Transaction, User } from '@prisma/client'

// Prisma Clientから型をre-export
export type { User, Transaction, Category, Session, TransactionType } from '@prisma/client'

// カスタム型定義
export type UserWithoutPassword = Omit<User, 'password'>

export type TransactionWithCategory = Transaction & {
  category: Category | null
}

// APIレスポンス型
export interface AuthResponse {
  user: UserWithoutPassword
  sessionToken: string
  refreshToken: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}