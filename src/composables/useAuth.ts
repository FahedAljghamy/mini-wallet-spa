/**
 * Authentication Composable
 *
 * Reusable logic for authentication management
 *
 * @author Fahed
 */

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api'
import { API_ENDPOINTS, AUTH_CONFIG } from '@/constants'
import type { User, LoginForm } from '@/types'

export function useAuth() {
  // Dependencies
  const router = useRouter()

  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value)

  const userInitials = computed(() => {
    if (!user.value?.name) return 'U'
    return user.value.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  })

  // Methods
  const getStoredToken = (): string | null => {
    return localStorage.getItem(AUTH_CONFIG.JWT_STORAGE_KEY)
  }

  const getStoredUserId = (): string | null => {
    return localStorage.getItem('user_id')
  }

  const storeAuthData = (authToken: string, userData: User): void => {
    localStorage.setItem(AUTH_CONFIG.JWT_STORAGE_KEY, authToken)
    localStorage.setItem('user_id', userData.id.toString())
    localStorage.setItem('user_data', JSON.stringify(userData))
    token.value = authToken
    user.value = userData
  }

  const clearAuthData = (): void => {
    localStorage.removeItem(AUTH_CONFIG.JWT_STORAGE_KEY)
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY)
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_data')
    token.value = null
    user.value = null
  }

  const loadUserFromStorage = (): void => {
    const storedToken = getStoredToken()
    if (storedToken) {
      token.value = storedToken

      // Load user data from localStorage if available
      const storedUserData = localStorage.getItem('user_data')
      if (storedUserData) {
        try {
          user.value = JSON.parse(storedUserData)
        } catch (error) {
          console.warn('Failed to parse stored user data:', error)
          localStorage.removeItem('user_data')
        }
      }
    }
  }

  const login = async (credentials: LoginForm): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      const response = (await apiService.post(API_ENDPOINTS.AUTH.LOGIN, credentials)) as {
        token: string
        user: User
      }

      storeAuthData(response.token, response.user)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (err) {
      console.warn('Logout API call failed:', err)
    } finally {
      clearAuthData()
      router.push('/wallet-login')
    }
  }

  const checkAuth = (): boolean => {
    const storedToken = getStoredToken()
    const storedUserId = getStoredUserId()

    if (storedToken && storedUserId) {
      token.value = storedToken

      // Load user data from localStorage if available
      const storedUserData = localStorage.getItem('user_data')
      if (storedUserData) {
        try {
          user.value = JSON.parse(storedUserData)
        } catch (error) {
          console.warn('Failed to parse stored user data:', error)
          localStorage.removeItem('user_data')
        }
      }

      return true
    }

    return false
  }

  const requireAuth = (): boolean => {
    if (!isAuthenticated.value) {
      router.push('/wallet-login')
      return false
    }
    return true
  }

  const redirectIfAuthenticated = (): void => {
    if (isAuthenticated.value) {
      router.push('/wallet-dashboard')
    }
  }

  // Initialize auth state
  checkAuth()

  return {
    // State
    user,
    token,
    loading,
    error,

    // Computed
    isAuthenticated,
    userInitials,

    // Methods
    login,
    logout,
    checkAuth,
    requireAuth,
    redirectIfAuthenticated,
    clearAuthData,
    loadUserFromStorage,
  }
}
