import { cookies } from 'next/headers'
import { env } from '@/lib/env'
import { DashboardClient } from './DashboardClient'

interface Transaction {
  id: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  description?: string
  date: string
  category: {
    id: number
    name: string
    type: 'INCOME' | 'EXPENSE'
  }
}

interface DashboardData {
  summary: {
    totalIncome: number
    totalExpense: number
    balance: number
  }
  recentTransactions: Transaction[]
}

async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      console.error('No access token found')
      return null
    }

    // 今月の開始日と終了日を計算
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // 収支サマリーを取得
    const summaryResponse = await fetch(
      `${env.API_URL}/transactions/summary?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    // 最近の取引を取得（5件）
    const transactionsResponse = await fetch(`${env.API_URL}/transactions?limit=5`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!summaryResponse.ok || !transactionsResponse.ok) {
      console.error('Backend API failed:', {
        summaryStatus: summaryResponse.status,
        transactionsStatus: transactionsResponse.status,
      })
      return null
    }

    const summaryData = await summaryResponse.json()
    const transactionsData = await transactionsResponse.json()

    return {
      summary: summaryData.data,
      recentTransactions: transactionsData.data.transactions || [],
    }
  } catch (error) {
    console.error('Dashboard data fetch error:', error)
    return null
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return <DashboardClient data={data} />
}
