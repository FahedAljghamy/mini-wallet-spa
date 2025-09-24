/**
 * Lazy Data Loading Composable
 *
 * Composable for lazy loading data with intersection observer
 *
 * @author Fahed
 */

import { ref, onMounted, onUnmounted, readonly, type Ref } from 'vue'

interface LazyDataOptions {
  rootMargin?: string
  threshold?: number
  immediate?: boolean
}

export function useLazyData<T>(loader: () => Promise<T>, options: LazyDataOptions = {}) {
  const { rootMargin = '100px', threshold = 0.1, immediate = false } = options

  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)
  const observer = ref<IntersectionObserver | null>(null)
  const target = ref<HTMLElement | null>(null)

  const loadData = async () => {
    if (loading.value || loaded.value) return

    try {
      loading.value = true
      error.value = null
      const result = await loader()
      data.value = result
      loaded.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load data'
    } finally {
      loading.value = false
    }
  }

  const setTarget = (element: HTMLElement | null) => {
    target.value = element

    if (element) {
      observer.value = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !loaded.value && !loading.value) {
              loadData()
            }
          })
        },
        {
          rootMargin,
          threshold,
        },
      )

      observer.value.observe(element)
    }
  }

  const refresh = () => {
    loaded.value = false
    data.value = null
    loadData()
  }

  onMounted(() => {
    if (immediate) {
      loadData()
    }
  })

  onUnmounted(() => {
    if (observer.value) {
      observer.value.disconnect()
    }
  })

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    loaded: readonly(loaded),
    setTarget,
    refresh,
    loadData,
  }
}

// Lazy loading for API data
export function useLazyApiData<T>(apiCall: () => Promise<T>, options: LazyDataOptions = {}) {
  return useLazyData(apiCall, options)
}

// Lazy loading for store data
export function useLazyStoreData<T>(storeAction: () => Promise<T>, options: LazyDataOptions = {}) {
  return useLazyData(storeAction, options)
}
