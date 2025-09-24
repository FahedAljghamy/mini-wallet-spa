/**
 * API Optimization Composable
 *
 * Composable for optimizing API calls and caching
 *
 * @author Fahed
 */

import { ref, computed } from 'vue'

interface CacheItem<T> {
  data: T
  timestamp: number
  expiresAt: number
}

interface ApiOptions {
  cacheTime?: number // Cache time in milliseconds
  staleTime?: number // Stale time in milliseconds
  retryCount?: number // Number of retries
  retryDelay?: number // Delay between retries
}

export function useApiOptimization() {
  const cache = new Map<string, CacheItem<any>>()
  const pendingRequests = new Map<string, Promise<any>>()
  const requestCount = ref(0)
  const cacheHits = ref(0)
  const cacheMisses = ref(0)

  // Default options
  const defaultOptions: ApiOptions = {
    cacheTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 1 * 60 * 1000, // 1 minute
    retryCount: 3,
    retryDelay: 1000, // 1 second
  }

  // Generate cache key
  const generateCacheKey = (url: string, params?: Record<string, any>): string => {
    const sortedParams = params
      ? Object.keys(params)
          .sort()
          .reduce(
            (result, key) => {
              result[key] = params[key]
              return result
            },
            {} as Record<string, any>,
          )
      : {}

    return `${url}:${JSON.stringify(sortedParams)}`
  }

  // Check if cache is valid
  const isCacheValid = (item: CacheItem<any>): boolean => {
    return Date.now() < item.expiresAt
  }

  // Check if cache is stale
  const isCacheStale = (item: CacheItem<any>, staleTime: number): boolean => {
    return Date.now() - item.timestamp > staleTime
  }

  // Get from cache
  const getFromCache = <T>(key: string): T | null => {
    const item = cache.get(key)
    if (!item) {
      cacheMisses.value++
      return null
    }

    if (!isCacheValid(item)) {
      cache.delete(key)
      cacheMisses.value++
      return null
    }

    cacheHits.value++
    return item.data
  }

  // Set cache
  const setCache = <T>(key: string, data: T, cacheTime: number): void => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + cacheTime,
    })
  }

  // Clear cache
  const clearCache = (key?: string): void => {
    if (key) {
      cache.delete(key)
    } else {
      cache.clear()
    }
  }

  // Retry function
  const retry = async <T>(fn: () => Promise<T>, retryCount: number, delay: number): Promise<T> => {
    try {
      return await fn()
    } catch (error) {
      if (retryCount > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay))
        return retry(fn, retryCount - 1, delay * 2) // Exponential backoff
      }
      throw error
    }
  }

  // Optimized API call with caching and retry
  const optimizedApiCall = async <T>(
    apiCall: () => Promise<T>,
    url: string,
    params?: Record<string, any>,
    options: ApiOptions = {},
  ): Promise<T> => {
    const opts = { ...defaultOptions, ...options }
    const cacheKey = generateCacheKey(url, params)

    // Check cache first
    const cachedData = getFromCache<T>(cacheKey)
    if (cachedData) {
      return cachedData
    }

    // Check if request is already pending
    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey)!
    }

    // Make API call with retry
    const request = retry(apiCall, opts.retryCount!, opts.retryDelay!)
      .then((data) => {
        // Cache the result
        setCache(cacheKey, data, opts.cacheTime!)

        // Remove from pending requests
        pendingRequests.delete(cacheKey)

        requestCount.value++
        return data
      })
      .catch((error) => {
        // Remove from pending requests on error
        pendingRequests.delete(cacheKey)
        throw error
      })

    // Store pending request
    pendingRequests.set(cacheKey, request)

    return request
  }

  // Batch API calls
  const batchApiCalls = async <T>(apiCalls: Array<() => Promise<T>>): Promise<T[]> => {
    return Promise.all(apiCalls.map((call) => call()))
  }

  // Debounced API call
  const debouncedApiCall = <T>(
    apiCall: () => Promise<T>,
    delay: number = 300,
  ): (() => Promise<T>) => {
    let timeoutId: number
    const lastCall: Promise<T> | null = null

    return () => {
      return new Promise((resolve, reject) => {
        clearTimeout(timeoutId)

        timeoutId = setTimeout(async () => {
          try {
            const result = await apiCall()
            resolve(result)
          } catch (error) {
            reject(error)
          }
        }, delay)
      })
    }
  }

  // Throttled API call
  const throttledApiCall = <T>(
    apiCall: () => Promise<T>,
    delay: number = 1000,
  ): (() => Promise<T>) => {
    let lastCall = 0
    let lastResult: T | null = null

    return async () => {
      const now = Date.now()

      if (now - lastCall >= delay) {
        lastCall = now
        lastResult = await apiCall()
        return lastResult
      }

      return lastResult!
    }
  }

  // Cache statistics
  const cacheStats = computed(() => ({
    size: cache.size,
    hits: cacheHits.value,
    misses: cacheMisses.value,
    hitRate: (cacheHits.value / (cacheHits.value + cacheMisses.value)) * 100,
    requestCount: requestCount.value,
  }))

  // Cleanup expired cache entries
  const cleanupCache = (): void => {
    const now = Date.now()
    for (const [key, item] of cache.entries()) {
      if (now >= item.expiresAt) {
        cache.delete(key)
      }
    }
  }

  // Auto cleanup every 5 minutes
  setInterval(cleanupCache, 5 * 60 * 1000)

  return {
    optimizedApiCall,
    batchApiCalls,
    debouncedApiCall,
    throttledApiCall,
    clearCache,
    cacheStats,
    cleanupCache,
  }
}
