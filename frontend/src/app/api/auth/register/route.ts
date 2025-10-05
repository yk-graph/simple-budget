import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // バックエンドAPIへのリクエスト
    const response = await fetch(`${env.API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })

    if (!response.ok) {
      const { error } = await response.json()
      return NextResponse.json({ message: error.message || '会員登録に失敗しました' }, { status: response.status })
    }

    const data = await response.json()
    const cookieStore = await cookies()

    // バックエンドAPIのレスポンス構造に合わせてトークンを取得
    const accessToken = data.data?.accessToken
    const refreshToken = data.data?.refreshToken

    if (!accessToken || !refreshToken) {
      throw new Error('トークンが取得できませんでした')
    }

    // アクセストークンをクッキーに保存
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7日
    })

    // リフレッシュトークンもクッキーに保存
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30日
    })

    return NextResponse.json({ message: '会員登録が完了しました' })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ message: '会員登録に失敗しました' }, { status: 500 })
  }
}
