export const env = {
  NODE_ENV: process.env.NODE_ENV!,
  PORT: Number(process.env.PORT!) || 8080,
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SESSION_SECRET: process.env.JWT_SESSION_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_EXPIRES_IN: '1h',
  JWT_REFRESH_EXPIRES_IN: '7d',
} as const

// 必須環境変数のチェック
const requiredEnvVars = ['DATABASE_URL', 'JWT_SESSION_SECRET', 'JWT_REFRESH_SECRET'] as const

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is required`)
  }
}
