import { Request, Response, NextFunction } from 'express'
import { JwtUtil } from '../utils/jwt.util'
import { ResponseUtil } from '../utils/response.util'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Authorizationヘッダーからトークン取得
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ResponseUtil.unauthorized(res, 'No token provided')
    }

    const token = authHeader.substring(7) // "Bearer "を除去

    // トークン検証
    const payload = JwtUtil.verifyAccessToken(token)

    // リクエストにユーザー情報を追加
    req.user = payload

    next()
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        return ResponseUtil.unauthorized(res, 'Token expired')
      }
      if (error.name === 'JsonWebTokenError') {
        return ResponseUtil.unauthorized(res, 'Invalid token')
      }
    }
    return ResponseUtil.unauthorized(res, 'Authentication failed')
  }
}
