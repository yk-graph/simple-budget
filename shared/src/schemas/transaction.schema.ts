import { z } from 'zod'

// 取引作成用スキーマ
export const createTransactionSchema = z.object({
  amount: z.number().positive('金額は正の整数でなければなりません').int('金額は整数でなければなりません'),
  type: z.enum(['INCOME', 'EXPENSE'], { message: 'タイプはINCOMEまたはEXPENSEでなければなりません' }),
  description: z.string().max(500).optional(),
  date: z.union([
    z.string().refine((val) => !isNaN(Date.parse(val)), '日付の形式が不正です'),
    z.date()
  ]),
  categoryId: z.number()
})

// 取引更新用スキーマ
export const updateTransactionSchema = z.object({
  amount: z.number().positive('金額は正の整数でなければなりません').int('金額は整数でなければなりません').optional(),
  type: z.enum(['INCOME', 'EXPENSE'], { message: 'タイプはINCOMEまたはEXPENSEでなければなりません' }),
  description: z.string().max(500).optional(),
  date: z.union([
    z.string().refine((val) => !isNaN(Date.parse(val)), '日付の形式が不正です'),
    z.date()
  ]),
  categoryId: z.number()
})

// 取引一覧取得クエリパラメータ用スキーマ
export const getTransactionsQuerySchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  categoryId: z.string().transform(Number).optional(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'startDateの形式が不正です').optional(),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'endDateの形式が不正です').optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
})

// サマリー取得クエリパラメータ用スキーマ
export const getSummaryQuerySchema = z.object({
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'startDateの形式が不正です').optional(),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'endDateの形式が不正です').optional(),
})

// 型定義をエクスポート
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
export type GetTransactionsQuery = z.infer<typeof getTransactionsQuerySchema>
export type GetSummaryQuery = z.infer<typeof getSummaryQuerySchema>