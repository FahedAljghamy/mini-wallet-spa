/**
 * Performance Monitor
 *
 * Utility for monitoring application performance
 *
 * @author Fahed
 */

interface PerformanceEntry {
  name: string
  startTime: number
  endTime?: number
  duration?: number
}

class PerformanceMonitor {
  private entries: Map<string, PerformanceEntry> = new Map()
  private observers: PerformanceObserver[] = []

  constructor() {
    this.setupObservers()
  }

  // Start timing
  start(name: string): void {
    this.entries.set(name, {
      name,
      startTime: performance.now(),
    })
  }

  // End timing
  end(name: string): number | null {
    const entry = this.entries.get(name)
    if (!entry) {
      console.warn(`Performance entry "${name}" not found`)
      return null
    }

    entry.endTime = performance.now()
    entry.duration = entry.endTime - entry.startTime

    console.log(`⏱️ ${name}: ${entry.duration.toFixed(2)}ms`)
    return entry.duration
  }

  // Measure function execution
  measure<T>(name: string, fn: () => T): T {
    this.start(name)
    const result = fn()
    this.end(name)
    return result
  }

  // Measure async function execution
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name)
    const result = await fn()
    this.end(name)
    return result
  }

  // Get all entries
  getEntries(): PerformanceEntry[] {
    return Array.from(this.entries.values())
  }

  // Clear all entries
  clear(): void {
    this.entries.clear()
  }

  // Setup performance observers
  private setupObservers(): void {
    if (typeof PerformanceObserver === 'undefined') {
      return
    }

    // Observe navigation timing
    try {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          console.log(`🧭 Navigation: ${entry.name} - ${entry.duration.toFixed(2)}ms`)
        })
      })
      navObserver.observe({ entryTypes: ['navigation'] })
      this.observers.push(navObserver)
    } catch (error) {
      console.warn('Navigation timing not supported')
    }

    // Observe resource timing
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.duration > 1000) {
            // Only log slow resources
            console.log(`📦 Resource: ${entry.name} - ${entry.duration.toFixed(2)}ms`)
          }
        })
      })
      resourceObserver.observe({ entryTypes: ['resource'] })
      this.observers.push(resourceObserver)
    } catch (error) {
      console.warn('Resource timing not supported')
    }

    // Observe paint timing
    try {
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          console.log(`🎨 Paint: ${entry.name} - ${entry.startTime.toFixed(2)}ms`)
        })
      })
      paintObserver.observe({ entryTypes: ['paint'] })
      this.observers.push(paintObserver)
    } catch (error) {
      console.warn('Paint timing not supported')
    }
  }

  // Get performance metrics
  getMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const paint = performance.getEntriesByType('paint')

    return {
      // Navigation timing
      domContentLoaded:
        navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
      loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
      firstByte: navigation?.responseStart - navigation?.requestStart,

      // Paint timing
      firstPaint: paint.find((entry) => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint:
        paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0,

      // Memory usage
      memory: (performance as any).memory
        ? {
            used: (performance as any).memory.usedJSHeapSize,
            total: (performance as any).memory.totalJSHeapSize,
            limit: (performance as any).memory.jsHeapSizeLimit,
          }
        : null,
    }
  }

  // Generate performance report
  generateReport(): string {
    const metrics = this.getMetrics()
    const entries = this.getEntries()

    let report = '📊 Performance Report\n'
    report += '='.repeat(50) + '\n\n'

    // Navigation metrics
    report += '🌐 Navigation Metrics:\n'
    report += `  DOM Content Loaded: ${metrics.domContentLoaded?.toFixed(2)}ms\n`
    report += `  Load Complete: ${metrics.loadComplete?.toFixed(2)}ms\n`
    report += `  First Byte: ${metrics.firstByte?.toFixed(2)}ms\n\n`

    // Paint metrics
    report += '🎨 Paint Metrics:\n'
    report += `  First Paint: ${metrics.firstPaint?.toFixed(2)}ms\n`
    report += `  First Contentful Paint: ${metrics.firstContentfulPaint?.toFixed(2)}ms\n\n`

    // Memory metrics
    if (metrics.memory) {
      report += '💾 Memory Usage:\n'
      report += `  Used: ${(metrics.memory.used / 1024 / 1024).toFixed(2)}MB\n`
      report += `  Total: ${(metrics.memory.total / 1024 / 1024).toFixed(2)}MB\n`
      report += `  Limit: ${(metrics.memory.limit / 1024 / 1024).toFixed(2)}MB\n\n`
    }

    // Custom entries
    if (entries.length > 0) {
      report += '⏱️ Custom Measurements:\n'
      entries.forEach((entry) => {
        if (entry.duration) {
          report += `  ${entry.name}: ${entry.duration.toFixed(2)}ms\n`
        }
      })
    }

    return report
  }

  // Cleanup
  destroy(): void {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers = []
    this.entries.clear()
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Export class for custom instances
export { PerformanceMonitor }
