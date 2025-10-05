import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import RegisterForm from '@/components/forms/RegisterForm'

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">新規登録</CardTitle>
        <CardDescription>新しいアカウントを作成してください</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            既にアカウントをお持ちの方は{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              ログイン
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
