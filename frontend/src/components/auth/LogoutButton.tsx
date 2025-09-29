'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    if (isLoading) return
    
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // ログアウト成功時にログインページへリダイレクト
        router.push('/login')
        router.refresh()
      } else {
        console.error('ログアウトに失敗しました')
      }
    } catch (error) {
      console.error('ログアウト時にエラーが発生しました:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? 'ログアウト中...' : 'ログアウト'}
    </Button>
  )
}