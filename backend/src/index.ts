import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // データベース接続テスト
  const result = await prisma.$queryRaw`SELECT 1`
  console.log('✅ Database connected successfully')
  console.log('Result:', result)

  // ユーザー数を取得
  const userCount = await prisma.user.count()
  console.log(`📊 User count: ${userCount}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
