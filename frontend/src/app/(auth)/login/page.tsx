import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import LoginForm from '@/components/forms/LoginForm'

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">ログイン</CardTitle>
        <CardDescription>アカウントにサインインしてください</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            アカウントをお持ちでない方は{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">
              新規登録
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}