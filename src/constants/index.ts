/**
 * Application Constants
 *
 * Centralized constants for Mini Wallet SPA
 *
 * @author Fahed
 */

import { API_CONFIG, AUTH_CONFIG, LOCALE_CONFIG, APP_CONFIG } from '@/config/env'

// ===== API Configuration =====
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  WALLET: {
    BALANCE: '/wallet/balance',
    ADD_MONEY: '/wallet/add-money',
    STATISTICS: '/wallet/statistics',
  },
  TRANSACTIONS: {
    LIST: '/transactions',
    CREATE: '/transactions',
    DETAILS: '/transactions',
    STATISTICS: '/transactions/statistics',
  },
  BENEFICIARIES: {
    LIST: '/beneficiaries',
    CREATE: '/beneficiaries',
    UPDATE: '/beneficiaries',
    DELETE: '/beneficiaries',
    STATISTICS: '/beneficiaries/statistics',
    TOGGLE_FAVORITE: '/beneficiaries',
  },
} as const

// Re-export API config from env
export { API_CONFIG, AUTH_CONFIG, LOCALE_CONFIG, APP_CONFIG }

// ===== Currency Configuration =====
export const CURRENCIES = LOCALE_CONFIG.SUPPORTED_CURRENCIES as readonly string[]

export const EXCHANGE_RATES = {
  AED: 1,
  USD: 0.27,
  EUR: 0.25,
  GBP: 0.21,
} as const

export const CURRENCY_CODES = {
  AED: 'AED',
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
} as const

// ===== Application Configuration =====
export const APP_DEFAULTS = {
  CURRENCY: LOCALE_CONFIG.DEFAULT_CURRENCY,
  PAGINATION_SIZE: 15,
  NOTIFICATION_DURATION: 5000,
}

// ===== Form Validation Rules =====
export const VALIDATION_RULES = {
  EMAIL: {
    REQUIRED: true,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRED: true,
  },
  AMOUNT: {
    MIN: 0.01,
    MAX: 100000,
    COMMISSION_RATE: 0.015, // 1.5%
  },
  NAME: {
    MAX_LENGTH: 255,
    REQUIRED: true,
  },
} as const

// ===== Transaction Status Configuration =====
export const TRANSACTION_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const

export const STATUS_COLORS = {
  [TRANSACTION_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
  [TRANSACTION_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [TRANSACTION_STATUS.FAILED]: 'bg-red-100 text-red-800',
  [TRANSACTION_STATUS.CANCELLED]: 'bg-gray-100 text-gray-800',
} as const

// ===== Error Codes =====
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  INVALID_RECEIVER: 'INVALID_RECEIVER',
  UNVERIFIED_ACCOUNT: 'UNVERIFIED_ACCOUNT',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
} as const

// ===== UI Configuration =====
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  TOAST_DURATION: 5000,

  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
  },
} as const

// ===== Route Configuration =====
export const ROUTES = {
  HOME: '/',
  LOGIN: '/wallet-login',
  DASHBOARD: '/wallet-dashboard',
  TRANSACTIONS: '/transactions',
  BENEFICIARIES: '/beneficiaries',
  ABOUT: '/about',
} as const

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.TRANSACTIONS,
  ROUTES.BENEFICIARIES,
] as const

export const AUTH_ROUTES = [ROUTES.LOGIN] as const
