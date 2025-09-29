import { Router } from 'express'
import { TransactionController } from '../controllers/transaction.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// すべてのエンドポイントで認証が必要
router.use(authMiddleware)

// 取引一覧取得
router.get('/', TransactionController.getTransactions)

// 収支サマリー取得
router.get('/summary', TransactionController.getSummary)

// 取引詳細取得
router.get('/:id', TransactionController.getTransactionById)

// 取引作成
router.post('/', TransactionController.createTransaction)

// 取引更新
router.put('/:id', TransactionController.updateTransaction)

// 取引削除
router.delete('/:id', TransactionController.deleteTransaction)

export default router
