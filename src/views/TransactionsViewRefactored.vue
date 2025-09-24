<!--
  TransactionsViewRefactored - Modern Transactions Page with Reusable Components

  Refactored transactions page using new component architecture

  @author Fahed
-->

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header -->
    <AppHeader @logout="handleLogout" />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl mb-6 shadow-lg animate-float"
        >
          <BaseIcon name="wallet" size="xl" color="white" />
        </div>
        <h1
          class="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4"
        >
          Transaction Center
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Send money securely and track your transaction history with our advanced wallet system
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <!-- Balance Card -->
        <div
          class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Current Balance</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ formatCurrency(parseFloat(balance.toString().replace(/[^\d.-]/g, '')) || 0) }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center"
            >
              <BaseIcon name="wallet" size="lg" color="white" />
            </div>
          </div>
        </div>

        <!-- Total Transactions -->
        <div
          class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Total Transactions</p>
              <p class="text-2xl font-bold text-gray-900">{{ transactions.length }}</p>
            </div>
            <div
              class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center"
            >
              <BaseIcon name="document" size="lg" color="white" />
            </div>
          </div>
        </div>

        <!-- This Month -->
        <div
          class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">This Month</p>
              <p class="text-2xl font-bold text-gray-900">{{ thisMonthTransactions.length }}</p>
            </div>
            <div
              class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center"
            >
              <BaseIcon name="calendar" size="lg" color="white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Send Money Form - Takes 1 column -->
        <div class="xl:col-span-1">
          <div class="sticky top-8">
            <TransactionFormRefactored
              @transaction-success="handleTransactionSuccess"
              @refresh-transactions="handleRefreshTransactions"
            />
          </div>
        </div>

        <!-- Transaction List - Takes 2 columns -->
        <div class="xl:col-span-2">
          <TransactionListRefactored ref="transactionListRef" />
        </div>
      </div>
    </main>

    <!-- Notifications -->
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useNotifications } from '../composables/useNotifications'
import { useTransactionsStore } from '../stores/transactions'
import { useCurrency } from '../composables/useCurrency'

// Components
import AppHeader from '../components/layout/AppHeader.vue'
import BaseIcon from '../components/ui/BaseIcon.vue'
import NotificationContainer from '../components/ui/NotificationContainer.vue'
import TransactionFormRefactored from '../components/transactions/TransactionFormRefactored.vue'
import TransactionListRefactored from '../components/transactions/TransactionListRefactored.vue'

// Composables
const { logout } = useAuth()
const { success } = useNotifications()
const transactionsStore = useTransactionsStore()
const { formatCurrency } = useCurrency()

// Computed
const balance = computed(() => transactionsStore.balance)
const transactions = computed(() => transactionsStore.transactions)
const thisMonthTransactions = computed(() => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  return transactions.value.filter((transaction) => {
    const transactionDate = new Date(transaction.created_at)
    return transactionDate.getMonth() === thisMonth && transactionDate.getFullYear() === thisYear
  })
})

// Refs
const transactionListRef = ref()

// Methods
const handleLogout = async () => {
  await logout()
}

const handleTransactionSuccess = (message: string) => {
  success('Transaction Successful', message)
}

const handleRefreshTransactions = async () => {
  if (transactionListRef.value) {
    await transactionListRef.value.refreshTransactions()
  }
}

// Lifecycle
let refreshInterval: number | null = null

onMounted(async () => {
  // Load user data and transactions (fetchTransactions already includes user data)
  await transactionsStore.fetchTransactions()

  // Set up periodic refresh for real-time updates (every 5 minutes)
  refreshInterval = setInterval(async () => {
    try {
      await transactionsStore.refreshData()
    } catch {
      // Silently handle errors to avoid disrupting user experience
    }
  }, 300000) // 5 minutes
})

// Cleanup interval on unmount
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>
