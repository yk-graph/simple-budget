# Simple Budget Frontend

Next.js App Routerを使用したフロントエンドアプリケーション

## 開発環境

### 前提条件
- Docker & Docker Compose
- Node.js 22+ (ローカル開発時)

### Docker開発環境での起動

```bash
# プロジェクトルートから全サービスを起動
docker-compose up -d

# フロントエンドのみを起動
docker-compose up frontend

# ログを確認
docker-compose logs -f frontend
```

アクセス: http://localhost:3000

### ローカル開発環境での起動

```bash
cd frontend
npm ci
npm run dev
```

## 本番環境

### Vercelデプロイ設定

1. GitHubリポジトリをVercelに接続
2. 環境変数を設定:
   - `BACKEND_URL`: AWS AppRunnerのURL (例: `https://your-backend-url.amazonaws.com/api`)

### 自動デプロイ
- mainブランチにpushすると自動的にVercelにデプロイされます
- プルリクエストを作成するとプレビューデプロイが作成されます

## 技術スタック

- **Framework**: Next.js 15 (App Router)
- **UI Library**: shadcn/ui + Tailwind CSS
- **Form Handling**: React Hook Form + Zod
- **Authentication**: JWT (HttpOnly Cookies)
- **Language**: TypeScript

## プロジェクト構造

```
src/
├── app/                    # App Router pages
│   ├── (auth)/            # 認証関連ページ (Route Group)
│   │   ├── login/         # ログインページ
│   │   └── register/      # 会員登録ページ
│   └── api/               # API Routes
│       └── auth/          # 認証API
├── components/            # React コンポーネント
│   ├── ui/               # shadcn/ui コンポーネント
│   └── forms/            # フォームコンポーネント
├── lib/                  # ユーティリティ関数
│   └── validations/      # Zodバリデーション
└── middleware.ts         # Next.js middleware (認証チェック)
```

## 環境変数

```bash
# .env.local を作成して以下を設定
BACKEND_URL=http://localhost:8080/api  # バックエンドAPI URL
```