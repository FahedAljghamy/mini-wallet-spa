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
import axios from 'axios'
import Pusher from 'pusher-js'

import App from './App.vue'
import router from './router'
import { useTransactionsStore } from './stores/transactions'

// Configure Axios
axios.defaults.baseURL = 'http://127.0.0.1:8000'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_id')
      window.location.href = '/wallet-login'
    }
    return Promise.reject(error)
  },
)

// Configure Pusher (disabled for now - using mock credentials)
let pusher: any = null

// Only initialize Pusher if we have real credentials
const pusherAppKey = import.meta.env.VITE_PUSHER_APP_KEY
const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER

if (
  pusherAppKey &&
  pusherAppKey !== 'your_pusher_app_key' &&
  pusherCluster &&
  pusherCluster !== 'your_pusher_cluster'
) {
  pusher = new Pusher(pusherAppKey, {
    cluster: pusherCluster,
    authEndpoint: 'http://127.0.0.1:8000/api/broadcasting/auth',
    auth: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    },
    forceTLS: true,
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
  const token = localStorage.getItem('auth_token')
  if (token) {
    // Get user ID from localStorage
    const userId = localStorage.getItem('user_id')

    if (userId) {
      const channel = pusher.subscribe(`private-transactions.${userId}`)

      channel.bind('transaction.created', (data: any) => {
        // Get the transactions store and handle the event
        const transactionsStore = useTransactionsStore()
        transactionsStore.handlePusherEvent(data)
      })

      // Handle connection events
      pusher.connection.bind('connected', () => {
        // Pusher connected successfully
      })

      pusher.connection.bind('error', (_error: any) => {
        // Handle Pusher connection error silently
      })
    }
  }
} else {
  // Pusher not initialized - real-time features disabled
}

// Auto-login: Check if user is already authenticated
const checkAuthStatus = async () => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      if (response.data.success) {
        // User is authenticated, fetch their data
        const transactionsStore = useTransactionsStore()
        await transactionsStore.fetchTransactions()
      }
    } catch {
      // Token is invalid, clear it
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_id')
    }
  }
}

// Check auth status on app load
checkAuthStatus()

// Make Pusher available globally for debugging (only if initialized)
if (pusher) {
  ;(window as any).pusher = pusher
}
