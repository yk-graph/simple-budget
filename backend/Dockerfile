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

# エントリーポイントシェルスクリプトをコピーして実行権限を付与
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

RUN npx prisma generate

EXPOSE 8080

# エントリーポイントを設定し、指定したシェルスクリプトを実行した後にデフォルトのコマンドを実行
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]

# ビルドステージ（型定義を含めてビルド）
FROM base AS builder

# devDependenciesも含めてインストール（型定義に必要）
RUN npm ci

COPY . .

# Prisma生成とTypeScriptビルド
RUN npx prisma generate
RUN npm run build

# 本番実行ステージ
FROM base AS production

# 本番用依存関係のみインストール
RUN npm ci --only=production

# ビルドステージから成果物をコピー
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
