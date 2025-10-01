import { PrismaClient, TransactionType } from '@simple-budget/shared'

const prisma = new PrismaClient()

export interface CreateTransactionDto {
  amount: number
  type: TransactionType
  description?: string
  date: Date
  categoryId: number
}

export interface UpdateTransactionDto {
  amount?: number
  type?: TransactionType
  description?: string
  date?: Date
  categoryId?: number
}

export interface GetTransactionsQuery {
  type?: TransactionType
  categoryId?: number
  startDate?: Date
  endDate?: Date
  page?: number
  limit?: number
}

export class TransactionService {
  // 取引一覧取得（フィルター・ページネーション対応）
  static async getTransactions(userId: string, query: GetTransactionsQuery) {
    const { type, categoryId, startDate, endDate, page = 1, limit = 20 } = query

    // フィルター条件構築
    const where: any = { userId }

    if (type) {
      where.type = type
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (startDate || endDate) {
      where.date = {}
      if (startDate) {
        where.date.gte = startDate
      }
      if (endDate) {
        where.date.lte = endDate
      }
    }

    // ページネーション計算
    const skip = (page - 1) * limit

    // データ取得
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ])

    return {
      transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  // 取引詳細取得
  static async getTransactionById(transactionId: string, userId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    })

    if (!transaction) {
      throw new Error('Transaction not found')
    }

    return transaction
  }

  // 取引作成
  static async createTransaction(userId: string, dto: CreateTransactionDto) {
    const transaction = await prisma.transaction.create({
      data: {
        ...dto,
        userId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    })

    return transaction
  }

  // 取引更新
  static async updateTransaction(transactionId: string, userId: string, dto: UpdateTransactionDto) {
    // 取引の存在確認
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    })

    if (!existingTransaction) {
      throw new Error('Transaction not found')
    }

    // カテゴリが指定されている場合、検証
    if (dto.categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: dto.categoryId,
        },
      })

      if (!category) {
        throw new Error('Category not found')
      }

      // typeが更新される場合、カテゴリとの整合性チェック
      const newType = dto.type || existingTransaction.type
      if (category.type !== newType) {
        throw new Error('Category type does not match transaction type')
      }
    }

    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: dto,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    })

    return transaction
  }

  // 取引削除
  static async deleteTransaction(transactionId: string, userId: string) {
    // 取引の存在確認
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    })

    if (!transaction) {
      throw new Error('Transaction not found')
    }

    await prisma.transaction.delete({
      where: { id: transactionId },
    })

    return { message: 'Transaction deleted successfully' }
  }

  // 収支サマリー取得
  static async getSummary(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId }

    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = startDate
      if (endDate) where.date.lte = endDate
    }

    // 収入の合計 https://www.prisma.io/docs/orm/reference/prisma-client-reference#aggregate
    const incomeResult = await prisma.transaction.aggregate({
      where: {
        ...where,
        type: 'INCOME',
      },
      _sum: {
        amount: true,
      },
    })

    // 支出の合計
    const expenseResult = await prisma.transaction.aggregate({
      where: {
        ...where,
        type: 'EXPENSE',
      },
      _sum: {
        amount: true,
      },
    })

    const totalIncome = incomeResult._sum.amount || 0
    const totalExpense = expenseResult._sum.amount || 0
    const balance = totalIncome - totalExpense

    return {
      totalIncome,
      totalExpense,
      balance,
    }
  }
}
