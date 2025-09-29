/**
 * Unified API Service
 *
 * Centralized API management with environment-based configuration
 *
 * @author Fahed
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { API_CONFIG, AUTH_CONFIG, DEV_CONFIG } from '@/config/env'
import type { ApiResponse } from '@/types'

/**
 * API Error Class
 * Author: Fahed
 */
export class ApiError extends Error {
  public status: number
  public code?: string
  public errors?: Record<string, string[]>

  constructor(message: string, status: number, code?: string, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.errors = errors
  }
}

/**
 * API Service Class
 * Author: Fahed
 */
class ApiService {
  private instance: AxiosInstance
  private retryCount = 0
  private maxRetries = API_CONFIG.RETRY_ATTEMPTS

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  /**
   * Setup request and response interceptors
   * Author: Fahed
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Log request in development
        if (DEV_CONFIG.DEBUG_MODE) {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
          })
        }

        return config
      },
      (error) => {
        console.error('Request interceptor error:', error)
        return Promise.reject(error)
      },
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        // Log response in development
        if (DEV_CONFIG.DEBUG_MODE) {
          console.log(
            `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
            {
              status: response.status,
              data: response.data,
            },
          )
        }

        return response
      },
      async (error) => {
        const originalRequest = error.config

        // Log error in development
        if (DEV_CONFIG.DEBUG_MODE) {
          console.error(
            `❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
            {
              status: error.response?.status,
              data: error.response?.data,
              message: error.message,
            },
          )
        }

        // Handle 401 errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          this.clearAuthData()
          window.location.href = '/wallet-login'
          return Promise.reject(error)
        }

        // Handle retry logic
        if (this.shouldRetry(error) && this.retryCount < this.maxRetries) {
          this.retryCount++
          await this.delay(API_CONFIG.RETRY_DELAY * this.retryCount)
          return this.instance(originalRequest)
        }

        // Reset retry count on success
        this.retryCount = 0

        return Promise.reject(this.transformError(error))
      },
    )
  }

  /**
   * Check if request should be retried
   * Author: Fahed
   */
  private shouldRetry(error: unknown): boolean {
    const err = error as { response?: { status?: number }; code?: string }
    return (
      !err.response ||
      (err.response.status && err.response.status >= 500) ||
      err.code === 'NETWORK_ERROR' ||
      err.code === 'TIMEOUT'
    )
  }

  /**
   * Delay function for retry
   * Author: Fahed
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Transform axios error to ApiError
   * Author: Fahed
   */
  private transformError(error: unknown): ApiError {
    const err = error as {
      response?: {
        status?: number
        data?: { message?: string; error_code?: string; errors?: Record<string, string[]> }
      }
      request?: unknown
      message?: string
    }

    if (err.response) {
      const { status, data } = err.response
      return new ApiError(
        data?.message || err.message || 'API request failed',
        status || 0,
        data?.error_code,
        data?.errors,
      )
    }

    if (err.request) {
      return new ApiError('Network error - please check your connection', 0)
    }

    return new ApiError(err.message || 'Unknown error occurred', 0)
  }

  /**
   * Get authentication token
   * Author: Fahed
   */
  private getAuthToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.JWT_STORAGE_KEY)
  }

  /**
   * Clear authentication data
   * Author: Fahed
   */
  private clearAuthData(): void {
    localStorage.removeItem(AUTH_CONFIG.JWT_STORAGE_KEY)
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY)
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_data')
    localStorage.removeItem('user_balance')
    localStorage.removeItem('user_transactions')
    localStorage.removeItem('user_beneficiaries')
    localStorage.removeItem('user_beneficiaries_stats')
  }

  /**
   * Generic GET request
   * Author: Fahed
   */
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<ApiResponse<T>>(url, config)
    return this.handleResponse(response)
  }

  /**
   * Generic POST request
   * Author: Fahed
   */
  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config)
    return this.handleResponse(response)
  }

  /**
   * Generic PUT request
   * Author: Fahed
   */
  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config)
    return this.handleResponse(response)
  }

  /**
   * Generic PATCH request
   * Author: Fahed
   */
  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config)
    return this.handleResponse(response)
  }

  /**
   * Generic DELETE request
   * Author: Fahed
   */
  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config)
    return this.handleResponse(response)
  }

  /**
   * Handle API response
   * Author: Fahed
   */
  private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
    const { data } = response

    if (data.success) {
      return data.data as T
    }

    throw new ApiError(
      data.message || 'API request failed',
      response.status,
      data.error_code,
      data.errors,
    )
  }

  /**
   * Upload file
   * Author: Fahed
   */
  async upload<T = unknown>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.instance.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })

    return this.handleResponse(response)
  }

  /**
   * Download file
   * Author: Fahed
   */
  async download(url: string, filename?: string): Promise<void> {
    const response = await this.instance.get(url, {
      responseType: 'blob',
    })

    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }

  /**
   * Batch requests
   * Author: Fahed
   */
  async batch<T = unknown>(requests: Array<() => Promise<T>>): Promise<T[]> {
    return Promise.all(requests.map((request) => request()))
  }

  /**
   * Get instance for custom requests
   * Author: Fahed
   */
  getInstance(): AxiosInstance {
    return this.instance
  }
}

// Export singleton instance
export const apiService = new ApiService()

// Export class for testing
export { ApiService }
