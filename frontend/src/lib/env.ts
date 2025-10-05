// 環境変数のバリデーションとタイプセーフなアクセス
function getRequiredEnvVar(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function getOptionalEnvVar(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue
}

export const env = {
  // 必須の環境変数
  API_URL: getRequiredEnvVar('API_URL'),

  // オプショナルな環境変数
  NODE_ENV: getOptionalEnvVar('NODE_ENV', 'development'),
} as const
