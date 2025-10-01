import { Request, Response, NextFunction } from 'express'
import { registerSchema, loginSchema, refreshTokenSchema } from '@simple-budget/shared'

import { AuthService } from '../services/auth.service'
import { ResponseUtil } from '../utils/response.util'

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

      return ResponseUtil.success(res, null, 204)
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
