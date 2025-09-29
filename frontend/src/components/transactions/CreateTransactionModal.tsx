'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CreateTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateTransactionModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: CreateTransactionModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
    description: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseInt(formData.amount),
          type: formData.type,
          description: formData.description,
          date: new Date(formData.date).toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('取引の作成に失敗しました')
      }

      onSuccess()
      onClose()
      setFormData({
        amount: '',
        type: 'EXPENSE',
        description: '',
        date: new Date().toISOString().split('T')[0],
      })
    } catch (error) {
      console.error('Transaction creation error:', error)
      alert('取引の作成に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-stone-700 mb-8">新しい取引</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <Label className="text-stone-700 font-medium">取引タイプ</Label>
            <div className="flex gap-4 mt-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'EXPENSE' }))}
                className={`flex-1 py-4 px-8 rounded-lg font-medium ${
                  formData.type === 'EXPENSE'
                    ? 'bg-red-600 text-white'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                支出
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'INCOME' }))}
                className={`flex-1 py-4 px-8 rounded-lg font-medium ${
                  formData.type === 'INCOME'
                    ? 'bg-green-600 text-white'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                収入
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="amount" className="text-stone-700 font-medium">金額</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="金額を入力"
              className="mt-4"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-stone-700 font-medium">説明</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="説明を入力（任意）"
              className="mt-4"
            />
          </div>

          <div>
            <Label htmlFor="date" className="text-stone-700 font-medium">日付</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="mt-4"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-stone-700 hover:bg-stone-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? '作成中...' : '作成'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}