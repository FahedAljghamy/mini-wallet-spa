/**
 * TypeScript Types and Interfaces
 *
 * Centralized type definitions for Mini Wallet SPA
 *
 * @author Fahed
 */

// ===== User Types =====
export interface User {
  id: number
  name: string
  email: string
  balance: string
  balance_raw: number
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface Beneficiary {
  id: number
  user_id: number
  beneficiary_user_id: number
  nickname: string
  notes?: string
  is_favorite: boolean
  created_at: string
  updated_at: string
  created_at_human?: string
  beneficiary_user: User
  // API might return 'beneficiary' instead of 'beneficiary_user'
  beneficiary?: User
}

export interface BeneficiaryFormData {
  beneficiary_email: string
  nickname: string
  notes?: string
  is_favorite: boolean
}

export interface BeneficiaryStatistics {
  total_beneficiaries: number
  favorite_beneficiaries: number
  recent_beneficiaries: number
  regular_beneficiaries: number
}

// ===== Transaction Types =====
export interface Transaction {
  id: number
  amount: string
  amount_raw?: number
  commission_fee: string
  commission_fee_raw?: number
  total_amount?: string
  total_amount_raw?: number
  status: TransactionStatus | string
  status_label?: string
  sender: TransactionUser
  receiver: TransactionUser
  created_at: string
  updated_at: string
  created_at_human?: string
}

export interface TransactionUser {
  id: number
  name: string
  email: string
}

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled'

// ===== API Response Types =====
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error_code?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

// ===== Form Types =====
export interface LoginForm {
  email: string
  password: string
}

export interface TransactionForm {
  receiver_email: string
  amount: number | null
  commission_fee: number
}

// ===== Currency Types =====
export type Currency = 'AED' | 'USD' | 'EUR' | 'GBP'

export interface ExchangeRates {
  AED: number
  USD: number
  EUR: number
  GBP: number
}

// ===== Component Props Types =====
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  disabled?: boolean
  error?: string
  required?: boolean
}

export interface CardProps {
  title?: string
  subtitle?: string
  padding?: 'sm' | 'md' | 'lg'
  shadow?: boolean
}

// ===== Store Types =====
export interface TransactionsState {
  balance: string
  transactions: Transaction[]
  user: User | null
  loading: boolean
  error: string | null
  validationErrors: Record<string, string[]>
  formErrors: Record<string, string>
}

// ===== Utility Types =====
export interface ValidationError {
  field: string
  message: string
}

export interface NotificationMessage {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}
