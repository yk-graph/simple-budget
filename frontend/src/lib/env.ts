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
  BACKEND_URL: getRequiredEnvVar('BACKEND_URL'),

  // オプショナルな環境変数
  NODE_ENV: getOptionalEnvVar('NODE_ENV', 'development'),
} as const

// 環境変数の値を検証する関数
export function validateEnvironment() {
  try {
    // BACKEND_URLの形式を検証
    const backendUrl = new URL(env.BACKEND_URL)

    // プロトコルの検証
    if (!['http:', 'https:'].includes(backendUrl.protocol)) {
      throw new Error(`Invalid BACKEND_URL protocol: ${backendUrl.protocol}. Must be http: or https:`)
    }

    // 本番環境でのlocalhostチェック
    if (env.NODE_ENV === 'production' && backendUrl.hostname === 'localhost') {
      throw new Error('BACKEND_URL cannot be localhost in production environment')
    }

    console.log('✅ Environment variables validated successfully')
    return true
  } catch (error) {
    console.error('❌ Environment validation failed:', error)
    throw error
  }
}
