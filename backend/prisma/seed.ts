import { PrismaClient, TransactionType } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// カテゴリマスターデータ
const EXPENSE_CATEGORIES = ['家賃', '水道光熱費', '通信費', '税金', '食費', '交際費', '移動費', '雑費', 'その他']

const INCOME_CATEGORIES = ['給与', '賞与', 'その他']

async function main() {
  console.log('🌱 Start seeding...')

  // 1. ダミーユーザー作成
  console.log('👤 Creating dummy user...')
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: 'password',
      name: 'デモユーザー',
    },
  })
  console.log(`✅ User created: ${user.email}`)

  // 2. カテゴリ作成（支出）
  console.log('📂 Creating expense categories...')
  const expenseCategories = await Promise.all(
    EXPENSE_CATEGORIES.map((name) =>
      prisma.category.upsert({
        where: {
          name_userId_type: {
            name,
            userId: user.id,
            type: 'EXPENSE',
          },
        },
        update: {},
        create: {
          name,
          type: 'EXPENSE',
          userId: user.id,
        },
      })
    )
  )
  console.log(`✅ Created ${expenseCategories.length} expense categories`)

  // 3. カテゴリ作成（収入）
  console.log('📂 Creating income categories...')
  const incomeCategories = await Promise.all(
    INCOME_CATEGORIES.map((name) =>
      prisma.category.upsert({
        where: {
          name_userId_type: {
            name,
            userId: user.id,
            type: 'INCOME',
          },
        },
        update: {},
        create: {
          name,
          type: 'INCOME',
          userId: user.id,
        },
      })
    )
  )
  console.log(`✅ Created ${incomeCategories.length} income categories`)

  // カテゴリIDのマップを作成
  const expenseCategoryMap = Object.fromEntries(expenseCategories.map((c) => [c.name, c.id]))
  const incomeCategoryMap = Object.fromEntries(incomeCategories.map((c) => [c.name, c.id]))

  // 4. 2025年8月の取引データ作成
  console.log('💰 Creating transactions for August 2025...')

  // 8月の支出（8件）
  const augustExpenses = [
    {
      amount: 80000,
      type: 'EXPENSE' as TransactionType,
      description: '8月分家賃',
      date: new Date('2025-08-01T00:00:00Z'),
      categoryId: expenseCategoryMap['家賃'],
    },
    {
      amount: 12000,
      type: 'EXPENSE' as TransactionType,
      description: '電気・ガス・水道',
      date: new Date('2025-08-05T00:00:00Z'),
      categoryId: expenseCategoryMap['水道光熱費'],
    },
    {
      amount: 5000,
      type: 'EXPENSE' as TransactionType,
      description: 'スマホ料金',
      date: new Date('2025-08-10T00:00:00Z'),
      categoryId: expenseCategoryMap['通信費'],
    },
    {
      amount: 35000,
      type: 'EXPENSE' as TransactionType,
      description: 'スーパー・外食',
      date: new Date('2025-08-15T00:00:00Z'),
      categoryId: expenseCategoryMap['食費'],
    },
    {
      amount: 8000,
      type: 'EXPENSE' as TransactionType,
      description: '友人との飲み会',
      date: new Date('2025-08-18T00:00:00Z'),
      categoryId: expenseCategoryMap['交際費'],
    },
    {
      amount: 6000,
      type: 'EXPENSE' as TransactionType,
      description: '電車・バス代',
      date: new Date('2025-08-20T00:00:00Z'),
      categoryId: expenseCategoryMap['移動費'],
    },
    {
      amount: 3000,
      type: 'EXPENSE' as TransactionType,
      description: '日用品購入',
      date: new Date('2025-08-25T00:00:00Z'),
      categoryId: expenseCategoryMap['雑費'],
    },
    {
      amount: 15000,
      type: 'EXPENSE' as TransactionType,
      description: '書籍・趣味',
      date: new Date('2025-08-28T00:00:00Z'),
      categoryId: expenseCategoryMap['その他'],
    },
  ]

  // 8月の収入（2件）
  const augustIncome = [
    {
      amount: 300000,
      type: 'INCOME' as TransactionType,
      description: '8月分給与',
      date: new Date('2025-08-25T00:00:00Z'),
      categoryId: incomeCategoryMap['給与'],
    },
    {
      amount: 5000,
      type: 'INCOME' as TransactionType,
      description: 'フリマ売上',
      date: new Date('2025-08-30T00:00:00Z'),
      categoryId: incomeCategoryMap['その他'],
    },
  ]

  await prisma.transaction.createMany({
    data: [...augustExpenses, ...augustIncome].map((t) => ({
      ...t,
      userId: user.id,
    })),
  })
  console.log(`✅ Created ${augustExpenses.length + augustIncome.length} transactions for August`)

  // 5. 2025年9月の取引データ作成
  console.log('💰 Creating transactions for September 2025...')

  // 9月の支出（9件）
  const septemberExpenses = [
    {
      amount: 80000,
      type: 'EXPENSE' as TransactionType,
      description: '9月分家賃',
      date: new Date('2025-09-01T00:00:00Z'),
      categoryId: expenseCategoryMap['家賃'],
    },
    {
      amount: 11000,
      type: 'EXPENSE' as TransactionType,
      description: '電気・ガス・水道',
      date: new Date('2025-09-05T00:00:00Z'),
      categoryId: expenseCategoryMap['水道光熱費'],
    },
    {
      amount: 5000,
      type: 'EXPENSE' as TransactionType,
      description: 'スマホ料金',
      date: new Date('2025-09-10T00:00:00Z'),
      categoryId: expenseCategoryMap['通信費'],
    },
    {
      amount: 28000,
      type: 'EXPENSE' as TransactionType,
      description: '住民税',
      date: new Date('2025-09-15T00:00:00Z'),
      categoryId: expenseCategoryMap['税金'],
    },
    {
      amount: 40000,
      type: 'EXPENSE' as TransactionType,
      description: 'スーパー・外食',
      date: new Date('2025-09-18T00:00:00Z'),
      categoryId: expenseCategoryMap['食費'],
    },
    {
      amount: 12000,
      type: 'EXPENSE' as TransactionType,
      description: '誕生日プレゼント',
      date: new Date('2025-09-20T00:00:00Z'),
      categoryId: expenseCategoryMap['交際費'],
    },
    {
      amount: 7000,
      type: 'EXPENSE' as TransactionType,
      description: '電車・バス代',
      date: new Date('2025-09-22T00:00:00Z'),
      categoryId: expenseCategoryMap['移動費'],
    },
    {
      amount: 4500,
      type: 'EXPENSE' as TransactionType,
      description: 'ドラッグストア',
      date: new Date('2025-09-25T00:00:00Z'),
      categoryId: expenseCategoryMap['雑費'],
    },
    {
      amount: 8000,
      type: 'EXPENSE' as TransactionType,
      description: 'サブスク料金',
      date: new Date('2025-09-28T00:00:00Z'),
      categoryId: expenseCategoryMap['その他'],
    },
  ]

  // 9月の収入（2件）
  const septemberIncome = [
    {
      amount: 300000,
      type: 'INCOME' as TransactionType,
      description: '9月分給与',
      date: new Date('2025-09-25T00:00:00Z'),
      categoryId: incomeCategoryMap['給与'],
    },
    {
      amount: 3000,
      type: 'INCOME' as TransactionType,
      description: 'ポイント還元',
      date: new Date('2025-09-30T00:00:00Z'),
      categoryId: incomeCategoryMap['その他'],
    },
  ]

  await prisma.transaction.createMany({
    data: [...septemberExpenses, ...septemberIncome].map((t) => ({
      ...t,
      userId: user.id,
    })),
  })
  console.log(`✅ Created ${septemberExpenses.length + septemberIncome.length} transactions for September`)

  console.log('✨ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
