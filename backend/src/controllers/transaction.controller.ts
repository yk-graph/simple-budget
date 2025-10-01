import { NextFunction, Request, Response } from 'express'
import {
  createTransactionSchema,
  getSummaryQuerySchema,
  getTransactionsQuerySchema,
  updateTransactionSchema,
} from '@simple-budget/shared'

import { TransactionService } from '../services/transaction.service'
import { ResponseUtil } from '../utils/response.util'

export class TransactionController {
  // 取引一覧取得
  static async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId

      // クエリパラメータのバリデーション
      const query = getTransactionsQuerySchema.parse(req.query)

      // 日付文字列をDateオブジェクトに変換
      const parsedQuery = {
        ...query,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
      }

      const result = await TransactionService.getTransactions(userId, parsedQuery)

      return ResponseUtil.success(res, result)
    } catch (error) {
      next(error)
    }
  }

  // 取引詳細取得
  static async getTransactionById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const { id } = req.params

      const transaction = await TransactionService.getTransactionById(id, userId)

      return ResponseUtil.success(res, transaction)
    } catch (error) {
      next(error)
    }
  }

  // 取引作成
  static async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId

      // バリデーション
      const dto = createTransactionSchema.parse(req.body)

      // 日付文字列をDateオブジェクトに変換
      const parsedDto = {
        ...dto,
        date: new Date(dto.date),
      }

      const transaction = await TransactionService.createTransaction(userId, parsedDto)

      return ResponseUtil.success(res, transaction, 201)
    } catch (error) {
      next(error)
    }
  }

  // 取引更新
  static async updateTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const { id } = req.params

      // バリデーション
      const dto = updateTransactionSchema.parse(req.body)

      // 日付文字列をDateオブジェクトに変換
      const parsedDto = {
        ...dto,
        date: new Date(dto.date),
      }

      const transaction = await TransactionService.updateTransaction(id, userId, parsedDto)

      return ResponseUtil.success(res, transaction)
    } catch (error) {
      next(error)
    }
  }

  // 取引削除
  static async deleteTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const { id } = req.params

      const result = await TransactionService.deleteTransaction(id, userId)

      return ResponseUtil.success(res, result)
    } catch (error) {
      next(error)
    }
  }

  // 収支サマリー取得
  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId

      // クエリパラメータのバリデーション
      const query = getSummaryQuerySchema.parse(req.query)

      const summary = await TransactionService.getSummary(
        userId,
        query.startDate ? new Date(query.startDate) : undefined,
        query.endDate ? new Date(query.endDate) : undefined
      )

      return ResponseUtil.success(res, summary)
    } catch (error) {
      next(error)
    }
  }
}
