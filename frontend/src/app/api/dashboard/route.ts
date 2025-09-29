import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      return NextResponse.json({ message: '認証が必要です' }, { status: 401 })
    }

    // 今月の開始日と終了日を計算
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // 収支サマリーを取得
    const summaryResponse = await fetch(
      `${env.BACKEND_URL}/transactions/summary?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    // 最近の取引を取得（5件）
    const transactionsResponse = await fetch(
      `${env.BACKEND_URL}/transactions?limit=5`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!summaryResponse.ok || !transactionsResponse.ok) {
      return NextResponse.json(
        { message: 'ダッシュボードデータの取得に失敗しました' },
        { status: summaryResponse.status || transactionsResponse.status }
      )
    }

    const summaryData = await summaryResponse.json()
    const transactionsData = await transactionsResponse.json()

    return NextResponse.json({
      summary: summaryData.data,
      recentTransactions: transactionsData.data.transactions || [],
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { message: 'ダッシュボードデータの取得中にエラーが発生しました' },
      { status: 500 }
    )
  }
}