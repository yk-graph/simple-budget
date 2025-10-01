import { Router } from 'express'

import { AuthController } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// 公開エンドポイント
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/refresh', AuthController.refreshToken)

// 認証が必要なエンドポイント
router.post('/logout', authMiddleware, AuthController.logout)

export default router
