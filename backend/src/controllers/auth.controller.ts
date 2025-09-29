import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AuthService } from '../services/auth.service'
import { ResponseUtil } from '../utils/response.util'

// バリデーションスキーマ
const registerSchema = z.object({
  email: z.string().email('メールアドレスの形式が不正です'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上である必要があります')
    .max(100, 'パスワードは100文字未満である必要があります'),
  name: z.string().min(1, '名前は必須です').max(50, '名前は50文字未満である必要があります'),
})

const loginSchema = z.object({
  email: z.string().email('メールアドレスの形式が不正です'),
  password: z.string().min(1, 'パスワードは必須です'),
})

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'リフレッシュトークンは必須です'),
})

export class AuthController {
  // ユーザー登録
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      // バリデーション
      const dto = registerSchema.parse(req.body)

      // ユーザー登録
      const result = await AuthService.register(dto)

      return ResponseUtil.success(res, result, 201)
    } catch (error) {
      next(error)
    }
  }

  // ログイン
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      // バリデーション
      const dto = loginSchema.parse(req.body)

      // ログイン
      const result = await AuthService.login(dto)

      return ResponseUtil.success(res, result)
    } catch (error) {
      next(error)
    }
  }

  // ログアウト
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const sessionToken = req.headers.authorization!.substring(7)

      await AuthService.logout(userId, sessionToken)

      return ResponseUtil.success(res, { message: 'ログアウトしました' })
    } catch (error) {
      next(error)
    }
  }

  // リフレッシュトークン
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      // バリデーション
      const { refreshToken } = refreshTokenSchema.parse(req.body)

      // トークンリフレッシュ
      const result = await AuthService.refreshToken(refreshToken)

      return ResponseUtil.success(res, result)
    } catch (error) {
      next(error)
    }
  }
}
