'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { registerSchema, type RegisterInput } from '@simple-budget/shared'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setServerError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '会員登録に失敗しました')
      }

      router.push('/')
      router.refresh()
    } catch (error) {
      setServerError(error instanceof Error ? error.message : '会員登録に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
          {serverError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">お名前</Label>
        <Input id="name" type="text" placeholder="山田太郎" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">メールアドレス</Label>
        <Input id="email" type="email" placeholder="your@email.com" {...register('email')} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">パスワード</Label>
        <Input id="password" type="password" placeholder="8文字以上" {...register('password')} />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        <p className="text-xs text-muted-foreground">8文字以上で入力してください</p>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? '登録中...' : '新規登録'}
      </Button>
    </form>
  )
}
