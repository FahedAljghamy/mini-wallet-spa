/**
 * Environment Configuration
 *
 * Centralized environment variables management
 *
 * @author Fahed
 */

// ===== API Configuration =====
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  RETRY_ATTEMPTS: Number(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
  RETRY_DELAY: Number(import.meta.env.VITE_API_RETRY_DELAY) || 1000,
} as const

// ===== Authentication Configuration =====
export const AUTH_CONFIG = {
  JWT_STORAGE_KEY: import.meta.env.VITE_JWT_STORAGE_KEY || 'auth_token',
  REFRESH_TOKEN_KEY: import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token',
  SESSION_TIMEOUT: Number(import.meta.env.VITE_SESSION_TIMEOUT) || 1800000,
} as const

// ===== Real-time Configuration =====
export const REALTIME_CONFIG = {
  PUSHER_APP_KEY: import.meta.env.VITE_PUSHER_APP_KEY || 'your_pusher_app_key',
  PUSHER_APP_CLUSTER: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'your_pusher_cluster',
  PUSHER_APP_SECRET: import.meta.env.VITE_PUSHER_APP_SECRET || 'your_pusher_secret',
  PUSHER_APP_HOST: import.meta.env.VITE_PUSHER_APP_HOST || 'your_pusher_host',
  PUSHER_APP_PORT: Number(import.meta.env.VITE_PUSHER_APP_PORT) || 443,
  PUSHER_APP_ENCRYPTED: import.meta.env.VITE_PUSHER_APP_ENCRYPTED === 'true',
} as const

// ===== Currency & Localization =====
export const LOCALE_CONFIG = {
  DEFAULT_CURRENCY: import.meta.env.VITE_DEFAULT_CURRENCY || 'AED',
  SUPPORTED_CURRENCIES: (import.meta.env.VITE_SUPPORTED_CURRENCIES || 'AED,USD,EUR,GBP').split(','),
  LOCALE: import.meta.env.VITE_LOCALE || 'en-US',
  TIMEZONE: import.meta.env.VITE_TIMEZONE || 'Asia/Dubai',
} as const

// ===== Performance & Monitoring =====
export const MONITORING_CONFIG = {
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_PERFORMANCE_MONITORING: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || 'your_sentry_dsn',
} as const

// ===== Feature Flags =====
export const FEATURE_FLAGS = {
  ENABLE_PWA: import.meta.env.VITE_ENABLE_PWA === 'true',
  ENABLE_OFFLINE_MODE: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
  ENABLE_DARK_MODE: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
  ENABLE_2FA: import.meta.env.VITE_ENABLE_2FA === 'true',
} as const

// ===== Development Configuration =====
export const DEV_CONFIG = {
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  MOCK_API: import.meta.env.VITE_MOCK_API === 'true',
  SHOW_DEV_TOOLS: import.meta.env.VITE_SHOW_DEV_TOOLS === 'true',
} as const

// ===== Application Configuration =====
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Mini Wallet',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  ENV: import.meta.env.VITE_APP_ENV || 'development',
  AUTHOR: 'Eng.Fahed',
} as const

// ===== Environment Validation =====
export const validateEnvironment = (): void => {
  const requiredVars = ['VITE_API_BASE_URL']

  const missingVars = requiredVars.filter((varName) => !import.meta.env[varName])

  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars)
  }
}

// Validate environment on import
validateEnvironment()
