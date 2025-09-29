import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    // バックエンドAPIにログアウトリクエストを送信
    if (accessToken) {
      try {
        await fetch(`${env.BACKEND_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
      } catch (error) {
        // バックエンドAPIのエラーは無視（クッキーは削除する）
        console.error('Backend logout error:', error)
      }
    }

    // クッキーを削除
    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')

    return NextResponse.json({ message: 'ログアウトしました' })
  } catch (error) {
    console.error('Logout error:', error)
    
    // エラーが発生してもクッキーは削除
    const cookieStore = await cookies()
    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')
    
    return NextResponse.json(
      { message: 'ログアウト処理でエラーが発生しましたが、クッキーは削除されました' },
      { status: 500 }
    )
  }
}