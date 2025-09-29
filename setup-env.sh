#!/bin/bash

echo "========================================"
echo "  simple-budget 環境変数セットアップ"
echo "========================================"
echo ""

# ルート .env のコピー
if [ -f ".env" ]; then
  echo "⚠️  ルート .env は既に存在します。スキップします。"
else
  if [ -f ".env.example" ]; then
    cp .env.example .env
    echo "✅ ルート .env を作成しました"
  else
    echo "❌ .env.example が見つかりません"
    exit 1
  fi
fi

# backend/.env.local のコピー
if [ -f "backend/.env.local" ]; then
  echo "⚠️  backend/.env.local は既に存在します。スキップします。"
else
  if [ -f "backend/.env.example" ]; then
    cp backend/.env.example backend/.env.local
    echo "✅ backend/.env.local を作成しました"
  else
    echo "❌ backend/.env.example が見つかりません"
    exit 1
  fi
fi

echo ""
echo "========================================"
echo "  ✅ セットアップ完了"
echo "========================================"
echo ""
echo "次のステップ:"
echo "  1. docker-compose build"
echo "  2. docker-compose up -d"
echo ""