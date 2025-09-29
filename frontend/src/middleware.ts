import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // アクセストークンをクッキーから取得
  const token = request.cookies.get('accessToken')?.value
  const { pathname } = request.nextUrl

  // 認証が不要なパス
  const publicPaths = ['/login', '/register']
  const isPublicPath = publicPaths.some((path) => pathname === path)

  // 認証が不要なパスの場合
  if (isPublicPath) {
    // 既にログインしている場合はホームページにリダイレクト
    if (token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // 認証が必要なパスで未認証の場合はログインページにリダイレクト
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // トークンが存在する場合はそのまま通す
  return NextResponse.next()
}

// middlewareを適用するパスを設定
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
