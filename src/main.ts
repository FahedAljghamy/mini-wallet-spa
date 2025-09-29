/**
 * Main Application Entry Point
 *
 * Configures Vue app with Pinia, Router, Axios, and Pusher
 *
 * @author Fahed
 */

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Pusher from 'pusher-js'

import App from './App.vue'
import router from './router'
import { useTransactionsStore } from './stores/transactions'
import { REALTIME_CONFIG, AUTH_CONFIG } from '@/config/env'

// Configure Pusher (disabled for now - using mock credentials)
let pusher: Pusher | null = null

// Only initialize Pusher if we have real credentials
if (
  REALTIME_CONFIG.PUSHER_APP_KEY &&
  REALTIME_CONFIG.PUSHER_APP_KEY !== 'your_pusher_app_key' &&
  REALTIME_CONFIG.PUSHER_APP_CLUSTER &&
  REALTIME_CONFIG.PUSHER_APP_CLUSTER !== 'your_pusher_cluster'
) {
  pusher = new Pusher(REALTIME_CONFIG.PUSHER_APP_KEY, {
    cluster: REALTIME_CONFIG.PUSHER_APP_CLUSTER,
    authEndpoint: `${import.meta.env.VITE_API_BASE_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(AUTH_CONFIG.JWT_STORAGE_KEY)}`,
      },
    },
    forceTLS: REALTIME_CONFIG.PUSHER_APP_ENCRYPTED,
  })
  console.log('Pusher initialized with real credentials')
} else {
  console.log(
    'Pusher disabled - using mock credentials. Set real Pusher credentials in .env to enable real-time features.',
  )
}

// Create Vue app
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize Pusher after store is available
app.mount('#app')

// Set up Pusher channel subscription after app is mounted (only if Pusher is initialized)
if (pusher) {
  const token = localStorage.getItem(AUTH_CONFIG.JWT_STORAGE_KEY)
  if (token) {
    // Get user ID from localStorage
    const userId = localStorage.getItem('user_id')

    if (userId) {
      const channel = pusher.subscribe(`private-transactions.${userId}`)

      channel.bind('transaction.created', (data: unknown) => {
        // Get the transactions store and handle the event
        const transactionsStore = useTransactionsStore()
        transactionsStore.handlePusherEvent(data as Record<string, unknown>)
      })

      // Handle connection events
      pusher.connection.bind('connected', () => {
        // Pusher connected successfully
      })

      pusher.connection.bind('error', (_error: unknown) => {
        // Handle Pusher connection error silently
      })
    }
  }
} else {
  // Pusher not initialized - real-time features disabled
}

// Auto-login: Check if user is already authenticated
const checkAuthStatus = async () => {
  const token = localStorage.getItem(AUTH_CONFIG.JWT_STORAGE_KEY)
  if (token) {
    try {
      // User is authenticated, fetch their data
      const transactionsStore = useTransactionsStore()
      await transactionsStore.fetchTransactions()
    } catch {
      // Token is invalid, clear it
      localStorage.removeItem(AUTH_CONFIG.JWT_STORAGE_KEY)
      localStorage.removeItem('user_id')
    }
  }
}

// Check auth status on app load
checkAuthStatus()

// Make Pusher available globally for debugging (only if initialized)
if (pusher) {
  ;(window as { pusher?: Pusher }).pusher = pusher
}
