/**
 * Notifications Composable
 *
 * Reusable logic for notification management
 *
 * @author Fahed
 */

import { ref } from 'vue'
import type { NotificationMessage } from '../types'

interface Notification extends NotificationMessage {
  id: string
  timestamp: number
}

export function useNotifications() {
  // State
  const notifications = ref<Notification[]>([])

  // Methods
  const generateId = (): string => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const addNotification = (notification: Omit<NotificationMessage, 'id' | 'timestamp'>): string => {
    const id = generateId()
    const newNotification: Notification = {
      id,
      timestamp: Date.now(),
      duration: 5000, // Default 5 seconds
      ...notification,
    }

    notifications.value.push(newNotification)

    // Auto remove after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }

  const removeNotification = (id: string): void => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAllNotifications = (): void => {
    notifications.value = []
  }

  // Convenience methods
  const success = (title: string, message: string, duration?: number): string => {
    return addNotification({
      type: 'success',
      title,
      message,
      duration,
    })
  }

  const error = (title: string, message: string, duration?: number): string => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: duration || 8000, // Errors stay longer
    })
  }

  const warning = (title: string, message: string, duration?: number): string => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration,
    })
  }

  const info = (title: string, message: string, duration?: number): string => {
    return addNotification({
      type: 'info',
      title,
      message,
      duration,
    })
  }

  // API response helpers
  const handleApiSuccess = (message: string, title: string = 'Success'): string => {
    return success(title, message)
  }

  const handleApiError = (errorData: unknown, title: string = 'Error'): string => {
    let message = 'An unexpected error occurred'

    if (errorData instanceof Error) {
      message = errorData.message
    } else if (typeof errorData === 'string') {
      message = errorData
    } else if (errorData && typeof errorData === 'object' && 'message' in errorData) {
      message = String(errorData.message)
    }

    return error(title, message)
  }

  return {
    // State
    notifications,

    // Methods
    addNotification,
    removeNotification,
    clearAllNotifications,

    // Convenience methods
    success,
    error,
    warning,
    info,

    // API helpers
    handleApiSuccess,
    handleApiError,
  }
}
