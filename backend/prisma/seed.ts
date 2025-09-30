// prisma/seed.ts
import { PrismaClient, TransactionType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // 支出用デフォルトカテゴリ
  const expenseCategories = [
    '食費',
    '交通費',
    '住居費',
    '光熱費',
    '通信費',
    '娯楽費',
    '医療費',
    '教育費',
    '衣服費',
    'その他支出',
  ]

  // 収入用デフォルトカテゴリ
  const incomeCategories = ['給与', '賞与', '副業', '投資', 'その他収入']

  // 支出カテゴリを作成 | upsertメソッド: 存在しなければ作成、存在すれば更新
  for (const categoryName of expenseCategories) {
    await prisma.category.upsert({
      where: {
        name_type: {
          name: categoryName,
          type: TransactionType.EXPENSE,
        },
      },
      update: {},
      create: {
        name: categoryName,
        type: TransactionType.EXPENSE,
      },
    })
  }

  console.log(`✅ Created ${expenseCategories.length} expense categories`)

  // 収入カテゴリを作成 | upsertメソッド: 存在しなければ作成、存在すれば更新
  for (const categoryName of incomeCategories) {
    await prisma.category.upsert({
      where: {
        name_type: {
          name: categoryName,
          type: TransactionType.INCOME,
        },
      },
      update: {},
      create: {
        name: categoryName,
        type: TransactionType.INCOME,
      },
    })
  }

  console.log(`✅ Created ${incomeCategories.length} income categories`)
  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
