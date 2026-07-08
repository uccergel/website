// src/lib/env.ts

/**
 * Ortam değişkenlerini type-safe bir şekilde okur.
 * Eksik değişken varsa build zamanında hata verir.
 */
function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(
      `Environment variable "${key}" is not set. ` +
        `Check your .env file in the project root.`
    )
  }
  return value
}

export const env = {
  RAINDROP_TOKEN: getEnv('RAINDROP_TOKEN')
} as const
