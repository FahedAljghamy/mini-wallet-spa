<!--
  Wallet Dashboard - Digital Wallet Interface

  Modern digital wallet dashboard with professional design

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
              <p class="text-xs text-gray-500">Digital Wallet</p>
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
      <!-- Balance Card -->
      <div class="mb-8">
        <div
          class="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-elevated border border-white/20"
        >
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Account Balance</h2>
              <p class="text-gray-600">Available funds</p>
            </div>
            <div class="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
                />
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div class="text-center">
            <div class="text-5xl font-bold text-gray-900 mb-2">{{ formattedBalance }}</div>
            <div class="flex items-center justify-center space-x-2">
              <p class="text-gray-600">{{ currentCurrency }}</p>
              <button
                @click="toggleCurrency"
                class="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Switch
              </button>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-3 gap-4 mt-8">
            <button
              @click="handleAddMoney"
              class="bg-white/50 hover:bg-white/70 rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105"
            >
              <div
                class="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-3"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <p class="text-sm font-medium text-gray-900">Add Money</p>
            </button>

            <button
              @click="handleSendMoney"
              class="bg-white/50 hover:bg-white/70 rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105"
            >
              <div
                class="w-12 h-12 gradient-success rounded-xl flex items-center justify-center mx-auto mb-3"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <p class="text-sm font-medium text-gray-900">Send Money</p>
            </button>

            <button
              @click="handleAnalytics"
              class="bg-white/50 hover:bg-white/70 rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105"
            >
              <div
                class="w-12 h-12 gradient-gold rounded-xl flex items-center justify-center mx-auto mb-3"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p class="text-sm font-medium text-gray-900">Analytics</p>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Total Transactions -->
        <div
          class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-white/20 card-hover"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Transactions</p>
              <p class="text-2xl font-bold text-gray-900">{{ transactions.length }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg
                class="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- This Month -->
        <div
          class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-white/20 card-hover"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">This Month</p>
              <p class="text-2xl font-bold text-gray-900">{{ thisMonthTransactions }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg
                class="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Success Rate -->
        <div
          class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-white/20 card-hover"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Success Rate</p>
              <p class="text-2xl font-bold text-gray-900">{{ successRate }}%</p>
            </div>
            <div class="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center">
              <svg
                class="w-6 h-6 text-gold-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div
        class="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-elevated border border-white/20"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Recent Transactions</h3>
          <button class="text-primary-600 hover:text-primary-700 font-medium">View All</button>
        </div>

        <div class="space-y-4">
          <div
            v-for="transaction in recentTransactions"
            :key="transaction.id"
            class="flex items-center justify-between p-4 bg-white/50 rounded-2xl hover:bg-white/70 transition-all duration-300"
          >
            <div class="flex items-center space-x-4">
              <div
                :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  isSentTransaction(transaction) ? 'bg-red-100' : 'bg-green-100',
                ]"
              >
                <svg
                  :class="[
                    'w-6 h-6',
                    isSentTransaction(transaction) ? 'text-red-600' : 'text-green-600',
                  ]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    v-if="isSentTransaction(transaction)"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v14m7-7H5"
                  />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">
                  {{ isSentTransaction(transaction) ? 'Sent to' : 'Received from' }}
                  {{
                    isSentTransaction(transaction)
                      ? transaction.receiver.name
                      : transaction.sender.name
                  }}
                </p>
                <p class="text-sm text-gray-500">{{ formatDate(transaction.created_at) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p
                :class="[
                  'font-bold text-lg',
                  isSentTransaction(transaction) ? 'text-red-600' : 'text-green-600',
                ]"
              >
                {{ isSentTransaction(transaction) ? '-' : '+'
                }}{{ formatCurrency(parseFloat(transaction.amount)) }}
              </p>
              <span
                :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  getStatusClass(transaction.status),
                ]"
              >
                {{ transaction.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * ADIB Dashboard Component Logic
 * Author: Fahed
 */

import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionsStore } from '@/stores/transactions'
import axios from 'axios'

const router = useRouter()

// Store
const transactionsStore = useTransactionsStore()

// Currency state
const currentCurrency = ref<'AED' | 'USD' | 'EUR' | 'GBP'>('AED')
const exchangeRates = ref<Record<string, number>>({
  AED: 1,
  USD: 0.27,
  EUR: 0.25,
  GBP: 0.21,
})

// Computed properties
const user = computed(() => transactionsStore.user)
const balance = computed(() => transactionsStore.balance)
const transactions = computed(() => transactionsStore.transactions)

const userInitials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
})

const formattedBalance = computed(() => {
  // Handle empty or invalid balance
  const rawBalance = balance.value || '0.00'
  const amount = parseFloat(rawBalance)

  // If amount is NaN or invalid, default to 0
  const validAmount = isNaN(amount) ? 0 : amount
  const convertedAmount = validAmount * exchangeRates.value[currentCurrency.value]

  const currencyCodes: Record<string, string> = {
    AED: 'AED',
    USD: 'USD',
    EUR: 'EUR',
    GBP: 'GBP',
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCodes[currentCurrency.value],
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertedAmount)
})

const recentTransactions = computed(() => {
  return transactions.value.slice(0, 5)
})

const thisMonthTransactions = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  return transactions.value.filter((transaction) => {
    const transactionDate = new Date(transaction.created_at)
    return (
      transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
    )
  }).length
})

const successRate = computed(() => {
  if (transactions.value.length === 0) return 100
  const completed = transactions.value.filter((t) => t.status === 'completed').length
  return Math.round((completed / transactions.value.length) * 100)
})

// Methods
const isSentTransaction = (transaction: { sender: { id: number }; receiver: { id: number } }) => {
  return user.value && transaction.sender.id === user.value.id
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    case 'cancelled':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-AE', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatCurrency = (amount: number) => {
  // Handle invalid amounts
  const validAmount = isNaN(amount) ? 0 : amount
  const convertedAmount = validAmount * exchangeRates.value[currentCurrency.value]

  const currencyCodes: Record<string, string> = {
    AED: 'AED',
    USD: 'USD',
    EUR: 'EUR',
    GBP: 'GBP',
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCodes[currentCurrency.value],
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertedAmount)
}

// Button handlers
const handleAddMoney = () => {
  const amount = prompt('Enter amount to add (for testing):')
  if (amount && !isNaN(parseFloat(amount))) {
    addMoney(parseFloat(amount))
  }
}

const handleSendMoney = () => {
  router.push('/transactions')
}

const handleAnalytics = () => {
  alert('Analytics feature coming soon!')
}

const toggleCurrency = () => {
  const currencies: Array<'AED' | 'USD' | 'EUR' | 'GBP'> = ['AED', 'USD', 'EUR', 'GBP']
  const currentIndex = currencies.indexOf(currentCurrency.value)
  const nextIndex = (currentIndex + 1) % currencies.length
  currentCurrency.value = currencies[nextIndex]
}

const addMoney = async (amount: number) => {
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      alert('Please login first')
      return
    }

    const response = await axios.post(
      'http://127.0.0.1:8000/api/wallet/add-money',
      {
        amount: amount,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.data.success) {
      alert(`Successfully added ${amount} AED to your wallet!`)
      // Refresh transactions to update balance
      await transactionsStore.fetchTransactions()
    } else {
      alert('Failed to add money: ' + response.data.message)
    }
  } catch (error: unknown) {
    console.error('Add money error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const responseMessage = (error as { response?: { data?: { message?: string } } })?.response
      ?.data?.message
    alert('Error adding money: ' + (responseMessage || errorMessage))
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

  if (transactions.value.length === 0) {
    transactionsStore.fetchTransactions()
  }
})
</script>
