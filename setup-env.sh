#!/bin/bash

echo "========================================"
echo "  simple-budget データベース初期化"
echo "========================================"
echo ""

# データベースをリセット
echo "🗑️  既存のデータベースをリセット中..."
docker-compose exec backend npx prisma migrate reset --force

if [ $? -ne 0 ]; then
  echo "❌ データベースリセットに失敗しました"
  exit 1
fi

echo ""
echo "✅ データベースリセット完了"
echo ""

# 初期データ投入
echo "🌱 初期データを投入中..."
docker-compose exec backend npm run seed

if [ $? -ne 0 ]; then
  echo "❌ 初期データ投入に失敗しました"
  exit 1
fi

echo ""
echo "========================================"
echo "  ✅ データベース初期化完了"
echo "========================================"
echo ""
echo "デモユーザー情報:"
echo "  Email: demo@example.com"
echo "  Password: password123"
echo ""
echo "登録されたデータ:"
echo "  - 支出カテゴリ: 9件"
echo "  - 収入カテゴリ: 3件"
echo "  - 2025年8月の取引: 10件"
echo "  - 2025年9月の取引: 11件"
echo ""
echo "次のステップ:"
echo "  1. http://localhost:8080/api/auth/login でログイン"
echo "  2. http://localhost:8080/api/transactions で取引データ確認"
echo ""