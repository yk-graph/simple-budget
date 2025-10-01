import express, { Request, Response } from 'express'
import cors from 'cors'
import { PrismaClient } from '@simple-budget/shared'

import { env } from './config/env'
import routes from './routes'
import { errorMiddleware } from './middleware/error.middleware'

// Prismaクライアント初期化
const prisma = new PrismaClient()

// Expressアプリ初期化
const app = express()

// ミドルウェア
app.use(cors())
app.use(express.json())

// ヘルスチェックエンドポイント
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// データベース接続確認エンドポイント
app.get('/db-health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// APIルート
app.use('/api', routes)

// エラーハンドリングミドルウェア（最後に配置）
app.use(errorMiddleware)

// サーバー起動
app.listen(env.PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${env.PORT}`)
  console.log(`📊 Environment: ${env.NODE_ENV}`)
  console.log(`🗄️ Database: ${env.DATABASE_URL.split('@')[1]?.split('/')[0]}`)
})
