import { Request, Response, NextFunction } from 'express'
import { Prisma, ZodError } from '@simple-budget/shared'

import { HttpException } from '../errors'
import { ResponseUtil } from '../utils/response.util'

export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error)

  // HttpException
  if (error instanceof HttpException) {
    return ResponseUtil.error(res, error.message, error.statusCode, error.code)
  }

  // Zodバリデーションエラー
  if (error instanceof ZodError) {
    const messages = error.issues.map((err) => err.message).join(', ')
    return ResponseUtil.validationError(res, messages)
  }

  // Prismaエラー
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // ユニーク制約違反
    if (error.code === 'P2002') {
      return ResponseUtil.error(res, 'Resource already exists', 409)
    }
    // レコードが見つからない
    if (error.code === 'P2025') {
      return ResponseUtil.notFound(res, 'Resource not found')
    }
  }

  // デフォルトエラー
  return ResponseUtil.error(res, error.message || 'Internal server error', 500)
}
