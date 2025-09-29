import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export class PasswordUtil {
  // パスワードをハッシュ化
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
  }

  // パスワードを検証
  static async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
