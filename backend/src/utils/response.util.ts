import { Response } from 'express'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
  }
}

export class ResponseUtil {
  // 成功レスポンス
  static success<T>(res: Response, data: T, statusCode: number = 200) {
    const response: ApiResponse<T> = {
      success: true,
      data,
    }
    return res.status(statusCode).json(response)
  }

  // エラーレスポンス
  static error(res: Response, message: string, statusCode: number = 500, code?: string) {
    const response: ApiResponse = {
      success: false,
      error: {
        message,
        code,
      },
    }
    return res.status(statusCode).json(response)
  }

  // バリデーションエラー
  static validationError(res: Response, message: string) {
    return this.error(res, message, 400, 'VALIDATION_ERROR')
  }

  // リクエストエラー
  static unauthorized(res: Response, message: string = 'Unauthorized') {
    return this.error(res, message, 401, 'UNAUTHORIZED')
  }

  // 権限エラー
  static forbidden(res: Response, message: string = 'Forbidden') {
    return this.error(res, message, 403, 'FORBIDDEN')
  }

  // リソースが見つからないエラー
  static notFound(res: Response, message: string = 'Resource not found') {
    return this.error(res, message, 404, 'NOT_FOUND')
  }
}
