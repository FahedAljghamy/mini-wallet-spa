/**
 * Transactions Store
 *
 * Pinia store for managing wallet transactions and balance
 *
 * @author Fahed
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export interface Transaction {
  id: number
  amount: string
  commission_fee: string
  status: string
  sender: {
    id: number
    name: string
    email: string
  }
  receiver: {
    id: number
    name: string
    email: string
  }
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  name: string
  email: string
  balance: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export const useTransactionsStore = defineStore('transactions', () => {
  // State
  const balance = ref<string>('0.00')
  const transactions = ref<Transaction[]>([])
  const user = ref<User | null>(null)
  const loading = ref<boolean>(false)
  const userLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const validationErrors = ref<Record<string, string[]>>({})
  const formErrors = ref<Record<string, string>>({})

  // Getters
  const formattedBalance = computed(() => {
    return `$${balance.value}`
  })

  const recentTransactions = computed(() => {
    return transactions.value.slice(0, 5)
  })

  // Load cached data from localStorage
  const loadCachedData = () => {
    try {
      // Load user data
      const cachedUserData = localStorage.getItem('user_data')
      if (cachedUserData) {
        user.value = JSON.parse(cachedUserData)
      }

      // Load balance
      const cachedBalance = localStorage.getItem('user_balance')
      if (cachedBalance) {
        balance.value = cachedBalance
      }

      // Load transactions
      const cachedTransactions = localStorage.getItem('user_transactions')
      if (cachedTransactions) {
        transactions.value = JSON.parse(cachedTransactions)
      }
    } catch (error) {
      console.warn('Failed to load cached data:', error)
      // Clear corrupted cache
      localStorage.removeItem('user_data')
      localStorage.removeItem('user_balance')
      localStorage.removeItem('user_transactions')
    }
  }

  // Actions
  const fetchTransactions = async () => {
    // Load cached data first for instant display
    loadCachedData()

    // Rate limiting check
    const now = Date.now()
    if (now - lastApiCall < MIN_API_INTERVAL) {
      return // Skip this call to respect rate limiting
    }

    try {
      loading.value = true
      error.value = null
      lastApiCall = now

      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await axios.get('http://127.0.0.1:8000/api/transactions', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      if (response.data.success) {
        // Fix: The API returns transactions directly, not in a .data property
        transactions.value = response.data.data.transactions || []
        balance.value = response.data.data.current_balance || '0.00'
        user.value = response.data.data.user

        // Cache all data in localStorage for instant display after refresh
        if (user.value) {
          localStorage.setItem('user_data', JSON.stringify(user.value))
        }

        if (balance.value) {
          localStorage.setItem('user_balance', balance.value)
        }

        if (transactions.value.length > 0) {
          localStorage.setItem('user_transactions', JSON.stringify(transactions.value))
        }

        // Mock Pusher event for testing (when real Pusher is disabled)
        if (!(window as unknown as Record<string, unknown>).pusher) {
          mockPusherEvent({
            type: 'balance_updated',
            balance: response.data.data.current_balance,
          })
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions'
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { message?: string } } }
        if (axiosError.response?.status === 401) {
          error.value = 'Authentication failed. Please login again.'
          // Clear invalid token
          localStorage.removeItem('auth_token')
        } else {
          error.value = axiosError.response?.data?.message || errorMessage
        }
      } else {
        error.value = errorMessage
      }
    } finally {
      loading.value = false
    }
  }

  const fetchTransactionDetails = async (transactionId: number) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await axios.get(`http://127.0.0.1:8000/api/transactions/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch transaction details')
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch transaction details'
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { message?: string } } }
        if (axiosError.response?.status === 401) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_id')
          localStorage.removeItem('user_data')
          localStorage.removeItem('user_balance')
          localStorage.removeItem('user_transactions')
          throw new Error('Authentication failed')
        } else if (axiosError.response?.status === 404) {
          throw new Error('Transaction not found')
        } else {
          throw new Error(axiosError.response?.data?.message || errorMessage)
        }
      }
      throw new Error(errorMessage)
    }
  }

  const fetchUserData = async () => {
    // Load cached data first for instant display
    loadCachedData()

    // Don't fetch if user data is already available
    if (user.value) {
      return
    }

    // Rate limiting check
    const now = Date.now()
    if (now - lastApiCall < MIN_API_INTERVAL) {
      return // Skip this call to respect rate limiting
    }

    try {
      userLoading.value = true
      error.value = null
      lastApiCall = now

      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await axios.get('http://127.0.0.1:8000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      if (response.data.success) {
        user.value = response.data.data.user
        balance.value = response.data.data.balance || '0.00'

        // Cache user data and balance in localStorage for instant display after refresh
        if (user.value) {
          localStorage.setItem('user_data', JSON.stringify(user.value))
        }

        if (balance.value) {
          localStorage.setItem('user_balance', balance.value)
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data'
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { message?: string } } }
        if (axiosError.response?.status === 401) {
          error.value = 'Authentication failed. Please login again.'
          localStorage.removeItem('auth_token')
        } else {
          error.value = axiosError.response?.data?.message || errorMessage
        }
      } else {
        error.value = errorMessage
      }
    } finally {
      userLoading.value = false
    }
  }

  const sendTransaction = async (receiverEmail: string, amount: number, commissionFee?: number) => {
    try {
      loading.value = true
      error.value = null
      validationErrors.value = {}
      formErrors.value = {}

      // Client-side validation
      const clientValidation = validateTransactionForm(receiverEmail, amount, commissionFee)
      if (!clientValidation.isValid) {
        formErrors.value = clientValidation.errors
        throw new Error('Form validation failed')
      }

      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const requestData = {
        receiver_email: receiverEmail,
        amount: amount,
        commission_fee: commissionFee || 0,
      }

      console.log('🚀 Sending transaction request:', {
        url: 'http://127.0.0.1:8000/api/transactions',
        data: requestData,
        headers: {
          Authorization: `Bearer ${token ? 'Present' : 'Missing'}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      const response = await axios.post('http://127.0.0.1:8000/api/transactions', requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      console.log('✅ Transaction response:', response.data)

      if (response.data.success) {
        // Refresh all transactions and balance from API
        await fetchTransactions()

        // Mock Pusher event for testing (when real Pusher is disabled)
        if (!(window as unknown as Record<string, unknown>).pusher) {
          mockPusherEvent({
            type: 'transaction_created',
            transaction: response.data.data.transaction,
          })
        }

        return response.data
      }
    } catch (err: unknown) {
      console.log('❌ Transaction error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to send transaction'
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: Record<string, unknown> } }

        console.log('📡 Error response:', {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        })

        if (axiosError.response?.status === 422) {
          // Validation errors from server
          const errorData = axiosError.response.data as Record<string, unknown>
          console.log('🔍 422 Validation errors:', errorData)
          console.log('🔍 Error code:', errorData.error_code)
          console.log('🔍 Message:', errorData.message)

          if (errorData.error_code === 'UNVERIFIED_ACCOUNT') {
            error.value =
              'Cannot send money to unverified account. Please ask the recipient to verify their email first.'
            console.log('🚫 UNVERIFIED_ACCOUNT error handled')
          } else if (errorData.error_code === 'INSUFFICIENT_BALANCE') {
            error.value = 'Insufficient balance. Please check your account balance.'
            console.log('💰 INSUFFICIENT_BALANCE error handled')
          } else if (errorData.error_code === 'INVALID_RECEIVER') {
            error.value = 'Cannot send money to yourself.'
            console.log('🚫 INVALID_RECEIVER error handled')
          } else {
            validationErrors.value = (errorData.errors as Record<string, string[]>) || {}
            error.value = (errorData.message as string) || 'Validation failed'
            console.log('📋 Generic validation errors:', validationErrors.value)
          }
        } else {
          const responseData = axiosError.response?.data as Record<string, unknown> | undefined
          error.value = (responseData?.message as string) || errorMessage
        }
      } else {
        error.value = errorMessage
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  const handlePusherEvent = (data: Record<string, unknown>) => {
    try {
      if (data.type === 'transaction_created' && data.transaction) {
        const newTransaction = data.transaction as Transaction

        // Check if this transaction is already in our list
        const existingIndex = transactions.value.findIndex((t) => t.id === newTransaction.id)

        if (existingIndex === -1) {
          // Add new transaction to the beginning of the list
          transactions.value.unshift(newTransaction)

          // Update balance if this is a transaction involving the current user
          if (
            user.value &&
            (newTransaction.sender.id === user.value.id ||
              newTransaction.receiver.id === user.value.id)
          ) {
            // Use debounced refresh instead of direct fetch
            refreshData()
          }
        }
      } else if (data.type === 'balance_updated' && data.balance) {
        // Handle direct balance updates
        balance.value = data.balance as string

        // Use debounced refresh instead of direct fetch
        refreshData()
      } else if (data.type === 'user_updated' && data.user) {
        // Handle user data updates
        user.value = data.user as User

        // Use debounced refresh instead of direct fetch
        refreshData()
      }
    } catch (err) {
      console.error('Error handling Pusher event:', err)
    }
  }

  // Mock Pusher event handler for testing (when Pusher is disabled)
  const mockPusherEvent = (data: Record<string, unknown>) => {
    handlePusherEvent(data)
  }

  // Manual refresh method for balance and transactions
  // Rate limiting for API calls
  let refreshTimer: number | null = null
  let lastApiCall: number = 0
  const MIN_API_INTERVAL = 2000 // 2 seconds minimum between API calls

  const refreshData = async () => {
    const now = Date.now()

    // Check if enough time has passed since last API call
    if (now - lastApiCall < MIN_API_INTERVAL) {
      return // Skip this call to respect rate limiting
    }

    // Clear existing timer
    if (refreshTimer) {
      clearTimeout(refreshTimer)
    }

    // Debounce the refresh to prevent multiple calls
    refreshTimer = setTimeout(async () => {
      // Only refresh if not already loading and enough time has passed
      if (!loading.value && !userLoading.value) {
        lastApiCall = Date.now()

        // Fetch transactions first (this also fetches user data)
        await fetchTransactions().catch(() => {
          // Silently handle errors
        })

        // If user data is still not available, fetch it separately
        if (!user.value) {
          await fetchUserData().catch(() => {
            // Silently handle errors
          })
        }
      }
    }, 500) // 500ms debounce
  }

  const clearError = () => {
    error.value = null
    userLoading.value = false
    localStorage.removeItem('user_data')
    localStorage.removeItem('user_balance')
    localStorage.removeItem('user_transactions')
  }

  const clearValidationErrors = () => {
    validationErrors.value = {}
    formErrors.value = {}
    userLoading.value = false
    localStorage.removeItem('user_data')
    localStorage.removeItem('user_balance')
    localStorage.removeItem('user_transactions')
  }

  const clearAllErrors = () => {
    error.value = null
    validationErrors.value = {}
    formErrors.value = {}
    userLoading.value = false
    localStorage.removeItem('user_data')
    localStorage.removeItem('user_balance')
    localStorage.removeItem('user_transactions')
  }

  const reset = () => {
    balance.value = '0.00'
    transactions.value = []
    user.value = null
    loading.value = false
    userLoading.value = false
    error.value = null
    validationErrors.value = {}
    formErrors.value = {}
    localStorage.removeItem('user_data')
    localStorage.removeItem('user_balance')
    localStorage.removeItem('user_transactions')
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        // Call logout API
        await axios.post(
          'http://127.0.0.1:8000/api/auth/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        )
      }
    } catch (error) {
      console.error('Logout API error:', error)
      // Continue with logout even if API call fails
    } finally {
      // Clear local storage and reset state
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('user_data')
      localStorage.removeItem('user_balance')
      localStorage.removeItem('user_transactions')
      reset()
    }
  }

  const isAuthenticated = computed(() => {
    return !!localStorage.getItem('auth_token')
  })

  return {
    // State
    balance,
    transactions,
    user,
    loading,
    userLoading,
    error,
    validationErrors,
    formErrors,

    // Getters
    formattedBalance,
    recentTransactions,
    isAuthenticated,

    // Actions
    loadCachedData,
    fetchTransactions,
    fetchUserData,
    fetchTransactionDetails,
    sendTransaction,
    handlePusherEvent,
    mockPusherEvent,
    refreshData,
    clearError,
    clearValidationErrors,
    clearAllErrors,
    reset,
    logout,
  }
})

/**
 * Client-side validation for transaction form
 * Author: Fahed
 */
function validateTransactionForm(
  receiverEmail: string,
  amount: number,
  commissionFee?: number,
): {
  isValid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  // Email validation
  if (!receiverEmail) {
    errors.receiver_email = 'Receiver email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(receiverEmail)) {
    errors.receiver_email = 'Please enter a valid email address'
  }

  // Amount validation
  if (!amount || amount <= 0) {
    errors.amount = 'Amount must be greater than 0'
  } else if (amount < 0.01) {
    errors.amount = 'Minimum amount is $0.01'
  } else if (amount > 100000) {
    errors.amount = 'Maximum amount is $100,000'
  }

  // Commission fee validation
  if (commissionFee !== undefined && commissionFee !== null) {
    if (commissionFee < 0) {
      errors.commission_fee = 'Commission fee cannot be negative'
    } else if (commissionFee > 1000) {
      errors.commission_fee = 'Commission fee cannot exceed $1,000'
    }
  }

  // Check if total amount (amount + commission) is reasonable
  const totalAmount = amount + (commissionFee || 0)
  if (totalAmount > 101000) {
    errors.amount = 'Total amount (including commission) cannot exceed $101,000'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
