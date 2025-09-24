<!--
  TransactionsView - Modern Digital Wallet Transactions

  Main transactions page with modern design and real-time updates

  @author Fahed
-->

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md border-b border-primary-100 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Mini Wallet</h1>
              <p class="text-xs text-gray-500">Transactions</p>
            </div>
          </div>

          <!-- User Info -->
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ user?.name || 'Welcome' }}</p>
              <p class="text-xs text-gray-500">{{ user?.email || 'user@example.com' }}</p>
            </div>
            <div
              class="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center"
            >
              <span class="text-white font-semibold text-sm">{{ userInitials }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div
          class="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-elevated border border-white/20"
        >
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Wallet Transactions</h1>
              <p class="text-gray-600">Manage your wallet and send money securely</p>
            </div>
            <div class="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
          </div>

          <!-- Real-time Status -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  :class="['w-3 h-3 rounded-full', pusherConnected ? 'bg-green-400' : 'bg-red-400']"
                ></div>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Real-time Updates</p>
                <p class="text-sm text-gray-500">
                  {{ pusherConnected ? 'Connected' : 'Disconnected' }}
                </p>
              </div>
            </div>
            <div class="text-sm text-gray-500">Last updated: {{ lastUpdated }}</div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Transaction Form -->
        <div class="order-2 lg:order-1">
          <TransactionForm />
        </div>

        <!-- Transaction List -->
        <div class="order-1 lg:order-2">
          <TransactionList />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * TransactionsView Component Logic
 * Author: Fahed
 */

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionsStore } from '@/stores/transactions'
import TransactionForm from '@/components/TransactionForm.vue'
import TransactionList from '@/components/TransactionList.vue'

const router = useRouter()
const transactionsStore = useTransactionsStore()

// State
const pusherConnected = ref(false)
const lastUpdated = ref('')

// Computed properties
const user = computed(() => transactionsStore.user)

const userInitials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
})

// Methods
const updateLastUpdated = () => {
  lastUpdated.value = new Date().toLocaleTimeString()
}

const checkPusherConnection = () => {
  const pusher = (window as unknown as Record<string, unknown>).pusher as
    | { connection: { state: string } }
    | undefined
  if (pusher) {
    pusherConnected.value = pusher.connection.state === 'connected'
  }
}

// Lifecycle
onMounted(() => {
  // Check if user is authenticated
  const token = localStorage.getItem('auth_token')
  if (!token) {
    router.push('/wallet-login')
    return
  }

  updateLastUpdated()
  checkPusherConnection()

  // Update connection status every 5 seconds
  const interval = setInterval(() => {
    checkPusherConnection()
    updateLastUpdated()
  }, 5000)

  // Cleanup interval on unmount
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>
