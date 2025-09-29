'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CreateTransactionModal from '@/components/transactions/CreateTransactionModal'

interface Transaction {
  id: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  description?: string
  date: string
  category: {
    id: number
    name: string
    type: 'INCOME' | 'EXPENSE'
  }
}

interface DashboardData {
  summary: {
    totalIncome: number
    totalExpense: number
    balance: number
  }
  recentTransactions: Transaction[]
}

interface DashboardClientProps {
  data: DashboardData | null
}

export function DashboardClient({ data }: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const summary = data?.summary || { totalIncome: 0, totalExpense: 0, balance: 0 }
  const recentTransactions = data?.recentTransactions || []

  const handleTransactionSuccess = () => {
    router.refresh()
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-stone-700">ダッシュボード</h1>
          <p className="text-stone-500 mt-4">家計簿アプリへようこそ</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-stone-700 hover:bg-stone-600 text-white px-8 py-4 rounded-lg font-medium"
        >
          新規作成
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* 今月の支出 */}
        <div className="bg-white p-8 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-stone-700 mb-4">今月の支出</h3>
          <p className="text-3xl font-bold text-stone-700">¥{summary.totalExpense.toLocaleString()}</p>
        </div>

        {/* 今月の収入 */}
        <div className="bg-white p-8 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-stone-700 mb-4">今月の収入</h3>
          <p className="text-3xl font-bold text-stone-700">¥{summary.totalIncome.toLocaleString()}</p>
        </div>

        {/* 残高 */}
        <div className="bg-white p-8 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-stone-700 mb-4">残高</h3>
          <p className={`text-3xl font-bold ${summary.balance >= 0 ? 'text-stone-700' : 'text-red-600'}`}>
            ¥{summary.balance.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-stone-700 mb-8">最近の取引</h3>
        {recentTransactions.length === 0 ? (
          <div className="text-stone-500 text-center py-8">
            まだ取引がありません
          </div>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-4 border-b border-stone-100 last:border-b-0">
                <div>
                  <p className="font-medium text-stone-700">
                    {transaction.description || 'その他'}
                  </p>
                  <p className="text-sm text-stone-500">
                    {new Date(transaction.date).toLocaleDateString('ja-JP')}
                    {` • ${transaction.category.name}`}
                  </p>
                </div>
                <p className={`font-semibold ${
                  transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'INCOME' ? '+' : '-'}¥{transaction.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  )
}