import { z } from 'zod'

const emailValidation = z
  .email('メールアドレスの形式が不正です')
  .min(1, 'メールアドレスは必須です')

const passwordValidation = z
  .string()
  .min(8, 'パスワードは8文字以上で入力してください')
  .max(20, 'パスワードは20文字以内で入力してください')
  .regex(/(?=.*[a-z])/, 'パスワードには小文字を1文字以上含める必要があります')
  .regex(/(?=.*[A-Z])/, 'パスワードには大文字を1文字以上含める必要があります')
  .regex(/(?=.*[0-9])/, 'パスワードには数字を1文字以上含める必要があります')

// 登録用スキーマ
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, '名前は必須です')
    .max(20, '名前は20文字以内で入力してください'),
  email: emailValidation,
  password: passwordValidation,
})

// ログイン用スキーマ
export const loginSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
})

// リフレッシュトークン用スキーマ
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'リフレッシュトークンは必須です'),
})

// 型をエクスポート
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>