export class HttpException extends Error {
  constructor(public readonly statusCode: number, public readonly message: string, public readonly code?: string) {
    super(message)
    this.name = 'HttpException'
  }

  // バリデーションエラー
  static badRequest(message: string = 'Bad request') {
    return new HttpException(400, message, 'BAD_REQUEST')
  }

  // 認証エラー
  static unauthorized(message: string = 'Unauthorized') {
    return new HttpException(401, message, 'UNAUTHORIZED')
  }

  // 権限エラー
  static forbidden(message: string = 'Forbidden') {
    return new HttpException(403, message, 'FORBIDDEN')
  }

  // リソースが見つからないエラー
  static notFound(message: string = 'Resource not found') {
    return new HttpException(404, message, 'NOT_FOUND')
  }

  // 重複エラー
  static conflict(message: string = 'Resource already exists') {
    return new HttpException(409, message, 'CONFLICT')
  }

  // サーバーエラー
  static internalServerError(message: string = 'Internal server error') {
    return new HttpException(500, message, 'INTERNAL_SERVER_ERROR')
  }
}
