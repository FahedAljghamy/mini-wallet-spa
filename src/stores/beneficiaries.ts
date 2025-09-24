/**
 * Beneficiaries Store
 *
 * Pinia store for managing beneficiaries with CRUD operations
 *
 * @author Fahed
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { Beneficiary, BeneficiaryFormData, BeneficiaryStatistics } from '@/types'

export const useBeneficiariesStore = defineStore('beneficiaries', () => {
  // State
  const beneficiaries = ref<Beneficiary[]>([])
  const statistics = ref<BeneficiaryStatistics | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const validationErrors = ref<Record<string, string[]>>({})
  const searchQuery = ref<string>('')
  const favoritesOnly = ref<boolean>(false)

  // Getters
  const favoriteBeneficiaries = computed(() => {
    return beneficiaries.value.filter((b) => b.is_favorite)
  })

  const regularBeneficiaries = computed(() => {
    return beneficiaries.value.filter((b) => !b.is_favorite)
  })

  const filteredBeneficiaries = computed(() => {
    let filtered = beneficiaries.value

    if (favoritesOnly.value) {
      filtered = filtered.filter((b) => b.is_favorite)
    }

    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (b) =>
          b.nickname.toLowerCase().includes(query) ||
          b.beneficiary_user.name.toLowerCase().includes(query) ||
          b.beneficiary_user.email.toLowerCase().includes(query) ||
          (b.notes && b.notes.toLowerCase().includes(query)),
      )
    }

    return filtered
  })

  // Load cached data from localStorage
  const loadCachedData = () => {
    try {
      // Load beneficiaries
      const cachedBeneficiaries = localStorage.getItem('user_beneficiaries')
      if (cachedBeneficiaries) {
        beneficiaries.value = JSON.parse(cachedBeneficiaries)
      }

      // Load statistics
      const cachedStatistics = localStorage.getItem('user_beneficiaries_stats')
      if (cachedStatistics) {
        statistics.value = JSON.parse(cachedStatistics)
      }
    } catch (error) {
      console.warn('Failed to load cached beneficiaries data:', error)
      // Clear corrupted cache
      localStorage.removeItem('user_beneficiaries')
      localStorage.removeItem('user_beneficiaries_stats')
    }
  }

  // Actions
  const fetchBeneficiaries = async (params?: { search?: string; favorites_only?: boolean }) => {
    // Load cached data first for instant display
    loadCachedData()

    try {
      loading.value = true
      error.value = null

      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const queryParams = new URLSearchParams()
      if (params?.search) queryParams.append('search', params.search)
      if (params?.favorites_only) queryParams.append('favorites_only', 'true')

      console.log('🔍 Fetching beneficiaries from API...')
      console.log('🔑 Auth token:', token ? 'Present' : 'Missing')

      const response = await axios.get(
        `http://127.0.0.1:8000/api/beneficiaries?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )

      console.log('📡 API Response:', response.data)
      console.log('📊 Response structure:', {
        success: response.data.success,
        data: response.data.data,
        beneficiaries: response.data.data?.beneficiaries,
      })

      // Handle different response structures
      if (response.data.success) {
        // Try different possible response structures
        let beneficiariesData = []

        if (response.data.data?.beneficiaries) {
          beneficiariesData = response.data.data.beneficiaries
        } else if (response.data.data?.data) {
          beneficiariesData = response.data.data.data
        } else if (Array.isArray(response.data.data)) {
          beneficiariesData = response.data.data
        } else if (response.data.beneficiaries) {
          beneficiariesData = response.data.beneficiaries
        }

        // Transform the data to match our expected structure
        const transformedBeneficiaries = beneficiariesData.map(
          (beneficiary: Record<string, unknown>) => ({
            ...beneficiary,
            beneficiary_user:
              (beneficiary.beneficiary as Record<string, unknown>) ||
              (beneficiary.beneficiary_user as Record<string, unknown>),
          }),
        )

        beneficiaries.value = transformedBeneficiaries || []

        // Cache beneficiaries data in localStorage for instant display after refresh
        if (beneficiaries.value.length > 0) {
          localStorage.setItem('user_beneficiaries', JSON.stringify(beneficiaries.value))
        }

        console.log('✅ Beneficiaries loaded:', beneficiaries.value.length, 'items')
        console.log('📋 Beneficiaries data:', beneficiaries.value)
        console.log('🔄 Transformed data:', transformedBeneficiaries)
      } else {
        console.log('❌ API response success is false')
        console.log('📄 Full response:', response.data)
      }
    } catch (err: unknown) {
      console.log('❌ Error fetching beneficiaries:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch beneficiaries'
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { message?: string } } }
        console.log('📡 Error response:', axiosError.response)
        if (axiosError.response?.status === 401) {
          error.value = 'Authentication failed. Please login again.'
          localStorage.removeItem('auth_token')
          console.log('🔑 Auth token removed due to 401 error')
        } else {
          error.value = axiosError.response?.data?.message || errorMessage
          console.log('💥 API Error:', error.value)
        }
      } else {
        error.value = errorMessage
        console.log('💥 General Error:', errorMessage)
      }
    } finally {
      loading.value = false
    }
  }

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await axios.get('http://127.0.0.1:8000/api/beneficiaries/statistics', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      if (response.data.success) {
        statistics.value = response.data.data

        // Cache statistics data in localStorage for instant display after refresh
        if (statistics.value) {
          localStorage.setItem('user_beneficiaries_stats', JSON.stringify(statistics.value))
        }
      }
    } catch {
      // Silently handle errors for statistics
    }
  }

  const createBeneficiary = async (formData: BeneficiaryFormData) => {
    try {
      loading.value = true
      error.value = null
      validationErrors.value = {}

      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await axios.post('http://127.0.0.1:8000/api/beneficiaries', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (response.data.success) {
        beneficiaries.value.unshift(response.data.data)
        return { success: true, data: response.data.data }
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: Record<string, unknown> } }
        if (axiosError.response?.status === 422) {
          const errorData = axiosError.response.data
          if (errorData) {
            validationErrors.value = (errorData.errors as Record<string, string[]>) || {}
            throw new Error((errorData.message as string) || 'Validation failed')
          }
        } else if (axiosError.response?.status === 401) {
          error.value = 'Authentication failed. Please login again.'
          localStorage.removeItem('auth_token')
          throw new Error('Authentication failed')
        } else {
          const errorMessage =
            (axiosError.response?.data?.message as string) || 'Failed to create beneficiary'
          error.value = errorMessage
          throw new Error(errorMessage)
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create beneficiary'
        error.value = errorMessage
        throw new Error(errorMessage)
      }
    } finally {
      loading.value = false
    }
  }

  const updateBeneficiary = async (id: number, formData: Partial<BeneficiaryFormData>) => {
    try {
      loading.value = true
      error.value = null
      validationErrors.value = {}

      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await axios.put(`http://127.0.0.1:8000/api/beneficiaries/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (response.data.success) {
        const index = beneficiaries.value.findIndex((b) => b.id === id)
        if (index !== -1) {
          beneficiaries.value[index] = response.data.data
        }
        return { success: true, data: response.data.data }
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: Record<string, unknown> } }
        if (axiosError.response?.status === 422) {
          const errorData = axiosError.response.data
          if (errorData) {
            validationErrors.value = (errorData.errors as Record<string, string[]>) || {}
            throw new Error((errorData.message as string) || 'Validation failed')
          }
        } else if (axiosError.response?.status === 401) {
          error.value = 'Authentication failed. Please login again.'
          localStorage.removeItem('auth_token')
          throw new Error('Authentication failed')
        } else {
          const errorMessage =
            (axiosError.response?.data?.message as string) || 'Failed to update beneficiary'
          error.value = errorMessage
          throw new Error(errorMessage)
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update beneficiary'
        error.value = errorMessage
        throw new Error(errorMessage)
      }
    } finally {
      loading.value = false
    }
  }

  const deleteBeneficiary = async (id: number) => {
    try {
      loading.value = true
      error.value = null

      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await axios.delete(`http://127.0.0.1:8000/api/beneficiaries/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      if (response.data.success) {
        beneficiaries.value = beneficiaries.value.filter((b) => b.id !== id)
        return { success: true }
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: Record<string, unknown> } }
        if (axiosError.response?.status === 401) {
          error.value = 'Authentication failed. Please login again.'
          localStorage.removeItem('auth_token')
          throw new Error('Authentication failed')
        } else {
          const errorMessage =
            (axiosError.response?.data?.message as string) || 'Failed to delete beneficiary'
          error.value = errorMessage
          throw new Error(errorMessage)
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete beneficiary'
        error.value = errorMessage
        throw new Error(errorMessage)
      }
    } finally {
      loading.value = false
    }
  }

  const toggleFavorite = async (id: number) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await axios.patch(
        `http://127.0.0.1:8000/api/beneficiaries/${id}/toggle-favorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )

      if (response.data.success) {
        const index = beneficiaries.value.findIndex((b) => b.id === id)
        if (index !== -1) {
          beneficiaries.value[index] = response.data.data
        }
        return { success: true, data: response.data.data }
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: Record<string, unknown> } }
        if (axiosError.response?.status === 401) {
          error.value = 'Authentication failed. Please login again.'
          localStorage.removeItem('auth_token')
          throw new Error('Authentication failed')
        } else {
          const errorMessage =
            (axiosError.response?.data?.message as string) || 'Failed to toggle favorite'
          error.value = errorMessage
          throw new Error(errorMessage)
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to toggle favorite'
        error.value = errorMessage
        throw new Error(errorMessage)
      }
    }
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const setFavoritesOnly = (favoritesOnlyFlag: boolean) => {
    favoritesOnly.value = favoritesOnlyFlag
  }

  const clearError = () => {
    error.value = null
    localStorage.removeItem('user_beneficiaries')
    localStorage.removeItem('user_beneficiaries_stats')
  }

  const clearValidationErrors = () => {
    validationErrors.value = {}
    localStorage.removeItem('user_beneficiaries')
    localStorage.removeItem('user_beneficiaries_stats')
  }

  const clearAllErrors = () => {
    error.value = null
    validationErrors.value = {}
    localStorage.removeItem('user_beneficiaries')
    localStorage.removeItem('user_beneficiaries_stats')
  }

  return {
    // State
    beneficiaries,
    statistics,
    loading,
    error,
    validationErrors,
    searchQuery,
    favoritesOnly,

    // Getters
    favoriteBeneficiaries,
    regularBeneficiaries,
    filteredBeneficiaries,

    // Actions
    loadCachedData,
    fetchBeneficiaries,
    fetchStatistics,
    createBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    toggleFavorite,
    setSearchQuery,
    setFavoritesOnly,
    clearError,
    clearValidationErrors,
    clearAllErrors,
  }
})
