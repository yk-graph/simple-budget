import jwt from 'jsonwebtoken'
import { env } from '../config/env'

interface TokenPayload {
  userId: string
  email: string
}

export class JwtUtil {
  // アクセストークン生成
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SESSION_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    })
  }

  // リフレッシュトークン生成
  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    })
  }

  // アクセストークン検証
  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_SESSION_SECRET) as TokenPayload
  }

  // リフレッシュトークン検証
  static verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload
  }
}
