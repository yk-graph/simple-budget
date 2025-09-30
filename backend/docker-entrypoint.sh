#!/bin/sh
set -e

echo "🔍 Waiting for MySQL to be ready..."

until npx prisma db push --skip-generate 2>/dev/null || [ $? -eq 0 ]; do
  echo "⏳ MySQL is unavailable - sleeping"
  sleep 2
done

echo "✅ MySQL is ready!"

echo "🔧 Generating Prisma Client..."
npx prisma generate

# 開発環境：db push（マイグレーションファイル不要）
if [ "$NODE_ENV" = "development" ]; then
  echo "🚀 Pushing database schema (development)..."
  npx prisma db push --skip-generate --accept-data-loss
  
  echo "🌱 Seeding database with initial data..."
  npm run prisma:seed

# 本番環境：migrate deploy（マイグレーション履歴を使用）
elif [ "$NODE_ENV" = "production" ]; then
  echo "🚀 Deploying migrations (production)..."
  npx prisma migrate deploy
fi

echo "🎉 Setup complete! Starting application..."

exec "$@"
