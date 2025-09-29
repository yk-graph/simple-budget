import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      return NextResponse.json({ message: '認証が必要です' }, { status: 401 })
    }

    const body = await request.json()

    const response = await fetch(`${env.BACKEND_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.message || 'トランザクションの作成に失敗しました' },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Transaction creation API error:', error)
    return NextResponse.json(
      { message: 'トランザクションの作成中にエラーが発生しました' },
      { status: 500 }
    )
  }
}