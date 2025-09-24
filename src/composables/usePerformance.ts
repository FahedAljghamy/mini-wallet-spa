/**
 * Performance Optimization Composable
 *
 * Composable for performance monitoring and optimization
 *
 * @author Fahed
 */

import { ref, onMounted, onUnmounted } from 'vue'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  networkRequests: number
}

export function usePerformance() {
  const metrics = ref<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkRequests: 0,
  })

  const startTime = ref<number>(0)
  const renderStartTime = ref<number>(0)

  // Start performance monitoring
  const startMonitoring = () => {
    startTime.value = performance.now()
  }

  // End performance monitoring
  const endMonitoring = () => {
    if (startTime.value) {
      metrics.value.loadTime = performance.now() - startTime.value
    }
  }

  // Start render monitoring
  const startRenderMonitoring = () => {
    renderStartTime.value = performance.now()
  }

  // End render monitoring
  const endRenderMonitoring = () => {
    if (renderStartTime.value) {
      metrics.value.renderTime = performance.now() - renderStartTime.value
    }
  }

  // Get memory usage
  const updateMemoryUsage = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      metrics.value.memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // MB
    }
  }

  // Debounce function for performance
  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number,
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: number
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }

  // Throttle function for performance
  const throttle = <T extends (...args: any[]) => any>(
    func: T,
    delay: number,
  ): ((...args: Parameters<T>) => void) => {
    let lastCall = 0
    return (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        func(...args)
      }
    }
  }

  // Lazy loading with intersection observer
  const useIntersectionObserver = (
    callback: (entries: IntersectionObserverEntry[]) => void,
    options: IntersectionObserverInit = {},
  ) => {
    const observer = ref<IntersectionObserver | null>(null)

    onMounted(() => {
      observer.value = new IntersectionObserver(callback, {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
      })
    })

    onUnmounted(() => {
      if (observer.value) {
        observer.value.disconnect()
      }
    })

    const observe = (element: Element) => {
      if (observer.value) {
        observer.value.observe(element)
      }
    }

    const unobserve = (element: Element) => {
      if (observer.value) {
        observer.value.unobserve(element)
      }
    }

    return { observe, unobserve }
  }

  // Virtual scrolling helper
  const useVirtualScrolling = (items: any[], itemHeight: number, containerHeight: number) => {
    const scrollTop = ref(0)
    const visibleItems = ref<any[]>([])

    const updateVisibleItems = () => {
      const start = Math.floor(scrollTop.value / itemHeight)
      const end = Math.min(start + Math.ceil(containerHeight / itemHeight) + 1, items.length)
      visibleItems.value = items.slice(start, end)
    }

    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement
      scrollTop.value = target.scrollTop
      updateVisibleItems()
    }

    onMounted(() => {
      updateVisibleItems()
    })

    return {
      visibleItems,
      handleScroll,
      totalHeight: items.length * itemHeight,
      offsetY: scrollTop.value - (scrollTop.value % itemHeight),
    }
  }

  // Image lazy loading
  const useLazyImage = (src: string, placeholder?: string) => {
    const loaded = ref(false)
    const error = ref(false)
    const imageRef = ref<HTMLImageElement | null>(null)

    const loadImage = () => {
      if (imageRef.value) {
        imageRef.value.src = src
      }
    }

    const handleLoad = () => {
      loaded.value = true
    }

    const handleError = () => {
      error.value = true
    }

    const { observe } = useIntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loaded.value && !error.value) {
        loadImage()
      }
    })

    onMounted(() => {
      if (imageRef.value) {
        observe(imageRef.value)
      }
    })

    return {
      loaded,
      error,
      imageRef,
      handleLoad,
      handleError,
      src: placeholder || '',
    }
  }

  // Performance monitoring
  onMounted(() => {
    updateMemoryUsage()

    // Monitor memory usage every 5 seconds
    const memoryInterval = setInterval(updateMemoryUsage, 5000)

    onUnmounted(() => {
      clearInterval(memoryInterval)
    })
  })

  return {
    metrics,
    startMonitoring,
    endMonitoring,
    startRenderMonitoring,
    endRenderMonitoring,
    updateMemoryUsage,
    debounce,
    throttle,
    useIntersectionObserver,
    useVirtualScrolling,
    useLazyImage,
  }
}
