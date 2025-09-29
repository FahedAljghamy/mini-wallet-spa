/// <reference types="vite/client" />

/**
 * Environment Variables Type Definitions
 *
 * @author Fahed
 */

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_API_RETRY_ATTEMPTS: string
  readonly VITE_API_RETRY_DELAY: string

  // Authentication
  readonly VITE_JWT_STORAGE_KEY: string
  readonly VITE_REFRESH_TOKEN_KEY: string
  readonly VITE_SESSION_TIMEOUT: string

  // Real-time Features
  readonly VITE_PUSHER_APP_KEY: string
  readonly VITE_PUSHER_APP_CLUSTER: string
  readonly VITE_PUSHER_APP_SECRET: string
  readonly VITE_PUSHER_APP_HOST: string
  readonly VITE_PUSHER_APP_PORT: string
  readonly VITE_PUSHER_APP_ENCRYPTED: string

  // Currency & Localization
  readonly VITE_DEFAULT_CURRENCY: string
  readonly VITE_SUPPORTED_CURRENCIES: string
  readonly VITE_LOCALE: string
  readonly VITE_TIMEZONE: string

  // Performance & Monitoring
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_PERFORMANCE_MONITORING: string
  readonly VITE_SENTRY_DSN: string

  // Feature Flags
  readonly VITE_ENABLE_PWA: string
  readonly VITE_ENABLE_OFFLINE_MODE: string
  readonly VITE_ENABLE_DARK_MODE: string
  readonly VITE_ENABLE_2FA: string

  // Development
  readonly VITE_DEBUG_MODE: string
  readonly VITE_MOCK_API: string
  readonly VITE_SHOW_DEV_TOOLS: string

  // Application
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
