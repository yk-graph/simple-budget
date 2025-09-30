# ============================================
# ベースステージ（共通の依存関係）
# ============================================
FROM node:22-alpine AS base

WORKDIR /app

# Prisma動作に必要
RUN apk add --no-cache openssl libc6-compat

# package.json を一度だけコピー（全ステージで共有）
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY backend/package*.json ./backend/

# shared のソースをコピー（全ステージで共有）
COPY shared ./shared

# ============================================
# 開発環境用ステージ
# ============================================
FROM base AS development

# 開発用依存関係をインストール
RUN npm install

# Prisma Client を生成
WORKDIR /app/shared
RUN npx prisma generate

# backend のソースをコピー
WORKDIR /app
COPY backend ./backend

# エントリーポイントシェルスクリプトをコピーして実行権限を付与
COPY backend/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

WORKDIR /app/backend
EXPOSE 8080

# エントリーポイントを設定し、指定したシェルスクリプトを実行した後にデフォルトのコマンドを実行
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]

# ============================================
# 依存関係ステージ（本番用）
# ============================================
FROM base AS dependencies

# 本番用依存関係のみインストール
RUN npm ci --only=production

# Prisma Client を生成
WORKDIR /app/shared
RUN npx prisma generate

# ============================================
# ビルドステージ（TypeScript コンパイル用）
# ============================================
FROM base AS builder

# devDependencies も含めてインストール（TypeScript に必要）
RUN npm ci

# backend のソースをコピー
WORKDIR /app
COPY backend ./backend

# TypeScript をビルド
WORKDIR /app/backend
RUN npm run build

# ============================================
# 本番実行ステージ
# ============================================
FROM node:22-alpine AS production

WORKDIR /app

# Prisma動作に必要
RUN apk add --no-cache openssl libc6-compat

# dependencies ステージから本番用 node_modules をコピー
COPY --from=dependencies /app/backend/node_modules ./backend/node_modules
COPY --from=dependencies /app/shared/node_modules ./shared/node_modules

# builder ステージからビルド成果物をコピー
COPY --from=builder /app/backend/dist ./backend/dist

# shared/prisma をコピー（マイグレーション実行に必要）
COPY --from=builder /app/shared/prisma ./shared/prisma

# エントリーポイントスクリプトをコピー
COPY backend/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

WORKDIR /app/backend
EXPOSE 8080

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
