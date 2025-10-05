FROM node:22-alpine

WORKDIR /app

# package.json をコピー（ルート、shared、frontend）
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY frontend/package*.json ./frontend/

# 依存関係をインストール
RUN npm install

# shared のソースをコピー
COPY shared ./shared

# frontend のソースをコピー
COPY frontend ./frontend

WORKDIR /app/frontend
EXPOSE 3000

CMD ["npm", "run", "dev"]
