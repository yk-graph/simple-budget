import LogoutButton from '@/components/auth/LogoutButton'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ/タイトル */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-stone-700">Simple Budget</h1>
          </div>

          {/* ナビゲーション（将来的に追加） */}
          <nav className="hidden md:flex items-center space-x-8">{/* 将来的にナビゲーションメニューを追加 */}</nav>

          {/* ユーザーメニュー */}
          <div className="flex items-center space-x-4">
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  )
}
