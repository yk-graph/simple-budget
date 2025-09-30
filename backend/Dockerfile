# ベースステージ（共通部分）
FROM node:22-alpine AS base

WORKDIR /app

# Prisma動作に必要
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./

# 開発環境用ステージ
FROM base AS development

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "run", "dev"]

# 本番実行ステージ
FROM base AS production

# 本番用依存関係のみ
RUN npm ci --only=production

COPY . .

# Prisma生成とTypeScriptビルド
RUN npx prisma generate
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
