# ベースステージ（共通部分）
FROM node:22-alpine AS base
WORKDIR /app

# OpenSSLとその他必要なライブラリをインストール
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./

# 開発環境用ステージ
FROM base AS development

# 開発用依存関係をインストール
RUN npm ci

# ソースコードをコピー
COPY . .

# Prismaクライアント生成
RUN npx prisma generate

EXPOSE 8080

# 開発サーバー起動
CMD ["npm", "run", "dev"]

# 本番環境用（依存関係）
FROM base AS production-deps

# 本番用依存関係のみ
RUN npm ci --only=production

# ビルドステージ
FROM base AS builder

# 開発用依存関係をコピー
COPY --from=development /app/node_modules ./node_modules
COPY . .

# Prisma生成とTypeScriptビルド
RUN npx prisma generate
RUN npm run build

# 本番実行ステージ
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# 本番用依存関係をコピー
COPY --from=production-deps /app/node_modules ./node_modules

# ビルド成果物をコピー
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

# Prismaクライアント生成（本番環境用）
RUN npx prisma generate

EXPOSE 8080

# 本番サーバー起動
CMD ["node", "dist/index.js"]