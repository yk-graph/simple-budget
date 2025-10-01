import { z } from 'zod'

// 登録用スキーマ
export const registerSchema = z.object({
  email: z.email('メールアドレスの形式が不正です'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上である必要があります')
    .max(100, 'パスワードは100文字未満である必要があります'),
  name: z.string().min(1, '名前は必須です').max(50, '名前は50文字未満である必要があります'),
})

// ログイン用スキーマ
export const loginSchema = z.object({
  email: z.email('メールアドレスの形式が不正です'),
  password: z.string().min(1, 'パスワードは必須です'),
})

// リフレッシュトークン用スキーマ
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'リフレッシュトークンは必須です'),
})

// 型をエクスポート
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>