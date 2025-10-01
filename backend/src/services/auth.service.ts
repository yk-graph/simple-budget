import { PrismaClient } from '@simple-budget/shared'

import { PasswordUtil } from '../utils/password.util'
import { JwtUtil } from '../utils/jwt.util'

const prisma = new PrismaClient()

export interface RegisterDto {
  email: string
  password: string
  name: string
}

export interface LoginDto {
  email: string
  password: string
}

export class AuthService {
  // ユーザー登録
  static async register(dto: RegisterDto) {
    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (existingUser) {
      throw new Error('Email already exists')
    }

    // パスワードハッシュ化
    const hashedPassword = await PasswordUtil.hash(dto.password)

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    // トークン生成
    const accessToken = JwtUtil.generateAccessToken({
      userId: user.id,
      email: user.email,
    })

    const refreshToken = JwtUtil.generateRefreshToken({
      userId: user.id,
      email: user.email,
    })

    // セッション保存
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7日後

    await prisma.session.create({
      data: {
        sessionToken: accessToken,
        refreshToken: refreshToken,
        userId: user.id,
        expiresAt,
        isActive: true,
      },
    })

    return {
      user,
      accessToken,
      refreshToken,
    }
  }

  // ログイン
  static async login(dto: LoginDto) {
    // ユーザー検索
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (!user) {
      throw new Error('Invalid credentials')
    }

    // パスワード検証
    const isValidPassword = await PasswordUtil.verify(dto.password, user.password)

    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    // トークン生成
    const accessToken = JwtUtil.generateAccessToken({
      userId: user.id,
      email: user.email,
    })

    const refreshToken = JwtUtil.generateRefreshToken({
      userId: user.id,
      email: user.email,
    })

    // セッション保存
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await prisma.session.create({
      data: {
        sessionToken: accessToken,
        refreshToken: refreshToken,
        userId: user.id,
        expiresAt,
        isActive: true,
      },
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    }
  }

  // ログアウト
  static async logout(userId: string, sessionToken: string) {
    await prisma.session.updateMany({
      where: {
        userId,
        sessionToken,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    })
  }

  // リフレッシュトークン
  static async refreshToken(refreshToken: string) {
    // リフレッシュトークン検証
    const payload = JwtUtil.verifyRefreshToken(refreshToken)

    // セッション確認
    const session = await prisma.session.findFirst({
      where: {
        refreshToken,
        userId: payload.userId,
        isActive: true,
      },
    })

    if (!session) {
      throw new Error('Invalid refresh token')
    }

    // 新しいアクセストークン生成
    const newAccessToken = JwtUtil.generateAccessToken({
      userId: payload.userId,
      email: payload.email,
    })

    // セッション更新
    await prisma.session.update({
      where: { id: session.id },
      data: {
        sessionToken: newAccessToken,
      },
    })

    return {
      accessToken: newAccessToken,
    }
  }
}
