<!--
  WalletDashboardRefactored - Modern Dashboard with Reusable Components

  Refactored dashboard using new component architecture

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
          class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl mb-6 shadow-lg animate-float"
        >
          <BaseIcon name="wallet" size="xl" color="white" />
        </div>
        <h1
          class="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4"
        >
          Wallet Dashboard
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Manage your finances and track your transaction history with our secure wallet platform
        </p>
      </div>

      <!-- Balance Card -->
      <div class="mb-12">
        <BalanceCard :balance="balance" @add-money="handleAddMoney" @send-money="handleSendMoney" />
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <!-- Total Transactions -->
        <div
          class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Total Transactions</p>
              <p class="text-2xl font-bold text-gray-900">{{ transactions.length }}</p>
              <p class="text-xs text-gray-500 mt-1">All time</p>
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
              <p class="text-2xl font-bold text-gray-900">{{ thisMonthTransactions }}</p>
              <p class="text-xs text-gray-500 mt-1">Current month</p>
            </div>
            <div
              class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center"
            >
              <BaseIcon name="trending-up" size="lg" color="white" />
            </div>
          </div>
        </div>

        <!-- Success Rate -->
        <div
          class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Success Rate</p>
              <p class="text-2xl font-bold text-gray-900">{{ successRate }}%</p>
              <p class="text-xs text-gray-500 mt-1">Completed</p>
            </div>
            <div
              class="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center"
            >
              <BaseIcon name="check-circle" size="lg" color="white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Recent Transactions</h2>
            <p class="text-gray-600">
              {{ recentTransactions.length }} of {{ transactions.length }} transactions
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <!-- Refresh Button -->
            <button
              @click="refreshData"
              class="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
              title="Refresh data"
            >
              <BaseIcon name="refresh" size="sm" color="gray" />
            </button>

            <!-- View All Button -->
            <button
              @click="router.push('/transactions')"
              class="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span class="font-medium">View All</span>
              <BaseIcon name="arrow-right" size="sm" color="white" />
            </button>
          </div>
        </div>

        <!-- Transactions List -->
        <div class="space-y-4">
          <TransactionCard
            v-for="transaction in recentTransactions"
            :key="transaction.id"
            :transaction="transaction"
            :current-user-id="user?.id"
            @click="handleTransactionClick"
          />
        </div>

        <!-- Empty State -->
        <div v-if="transactions.length === 0" class="text-center py-12">
          <div
            class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <BaseIcon name="document" size="xl" color="gray" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
          <p class="text-gray-500 mb-4">Start by sending money to another user</p>
          <button
            @click="router.push('/transactions')"
            class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Send Money
          </button>
        </div>
      </div>

      <!-- Quick Beneficiaries Section -->
      <div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-4">
            <div
              class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center"
            >
              <BaseIcon name="users" size="lg" color="white" />
            </div>
            <div>
              <h2 class="text-2xl font-bold gradient-text">Quick Send</h2>
              <p class="text-sm text-gray-600">Send money to your favorite beneficiaries</p>
            </div>
          </div>
          <router-link
            to="/beneficiaries"
            class="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2"
          >
            <BaseIcon name="cog-6-tooth" size="sm" color="white" />
            <span>Manage</span>
          </router-link>
        </div>

        <!-- Favorite Beneficiaries Grid -->
        <div
          v-if="favoriteBeneficiaries.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div
            v-for="beneficiary in favoriteBeneficiaries.slice(0, 6)"
            :key="beneficiary.id"
            @click="handleQuickSend(beneficiary)"
            class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl hover:from-green-50 hover:to-emerald-100 cursor-pointer transition-all duration-200 border border-gray-200 hover:border-green-300 hover:shadow-md"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-lg"
              >
                {{ beneficiary.beneficiary_user?.name?.charAt(0)?.toUpperCase() || 'B' }}
              </div>
              <div class="min-w-0 flex-1">
                <h4 class="font-semibold text-gray-900 name-truncate">
                  {{ beneficiary.nickname }}
                </h4>
                <p class="text-sm text-gray-600 email-truncate">
                  {{ beneficiary.beneficiary_user?.name || 'Unknown' }}
                </p>
                <p class="text-xs text-gray-500 email-truncate">
                  {{ beneficiary.beneficiary_user?.email || 'No email' }}
                </p>
              </div>
              <BaseIcon name="paper-airplane" size="sm" color="gray" />
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div
            class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <BaseIcon name="users" size="xl" color="gray" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No favorite beneficiaries yet</h3>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">
            Add beneficiaries to your favorites for quick and easy money transfers
          </p>
          <router-link
            to="/beneficiaries"
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <BaseIcon name="plus" size="sm" color="white" />
            <span class="ml-2">Add Beneficiaries</span>
          </router-link>
        </div>
      </div>
    </main>

    <!-- Notifications -->
    <NotificationContainer />

    <!-- Transaction Details Modal -->
    <TransactionDetailsModal
      :is-open="isModalOpen"
      :transaction="selectedTransaction"
      :error="modalError"
      @close="closeModal"
      @retry="retryFetchTransaction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionsStore } from '../stores/transactions'
import { useBeneficiariesStore } from '../stores/beneficiaries'
import { useNotifications } from '../composables/useNotifications'
import { useAuth } from '../composables/useAuth'
import type { Transaction } from '../types'

interface DetailedTransaction {
  id: number
  amount: string
  amount_raw?: number
  commission_fee: string
  commission_fee_raw?: number
  total_amount?: string
  total_amount_raw?: number
  status: string
  status_label: string
  sender: {
    id: number
    name: string
    email: string
  }
  receiver: {
    id: number
    name: string
    email: string
  }
  created_at: string
  updated_at: string
  created_at_human: string
}
import axios from 'axios'

// Components
import AppHeader from '../components/layout/AppHeader.vue'
import BalanceCard from '../components/wallet/BalanceCard.vue'
import TransactionCard from '../components/transactions/TransactionCard.vue'
import TransactionDetailsModal from '../components/transactions/TransactionDetailsModal.vue'
import BaseIcon from '../components/ui/BaseIcon.vue'
import NotificationContainer from '../components/ui/NotificationContainer.vue'

// Composables
const router = useRouter()
const { user: authUser, logout } = useAuth()
const { success, error } = useNotifications()

// Modal state
const isModalOpen = ref(false)
const selectedTransaction = ref<DetailedTransaction | null>(null)
const modalError = ref<string | null>(null)

// Stores
const transactionsStore = useTransactionsStore()
const beneficiariesStore = useBeneficiariesStore()

// Use user data from transactions store (more up-to-date)
const user = computed(() => transactionsStore.user || authUser.value)

// Computed
const balance = computed(() => transactionsStore.balance)
const transactions = computed(() => transactionsStore.transactions)

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

// Beneficiaries
const favoriteBeneficiaries = computed(() => beneficiariesStore.favoriteBeneficiaries)

// Methods
const handleAddMoney = () => {
  const amount = prompt('Enter amount to add (for testing):')
  if (amount && !isNaN(parseFloat(amount))) {
    addMoney(parseFloat(amount))
  }
}

const handleSendMoney = () => {
  router.push('/transactions')
}

const handleLogout = async () => {
  await logout()
}

// Modal handlers
const handleTransactionClick = async (transaction: Transaction) => {
  try {
    modalError.value = null
    isModalOpen.value = true

    // Fetch detailed transaction data
    const detailedTransaction = await transactionsStore.fetchTransactionDetails(transaction.id)
    selectedTransaction.value = detailedTransaction
  } catch (err) {
    modalError.value = err instanceof Error ? err.message : 'Failed to load transaction details'
  }
}

const closeModal = () => {
  isModalOpen.value = false
  selectedTransaction.value = null
  modalError.value = null
}

const retryFetchTransaction = async () => {
  if (selectedTransaction.value) {
    try {
      modalError.value = null
      const detailedTransaction = await transactionsStore.fetchTransactionDetails(
        selectedTransaction.value.id,
      )
      selectedTransaction.value = detailedTransaction
    } catch (err) {
      modalError.value = err instanceof Error ? err.message : 'Failed to load transaction details'
    }
  }
}

const refreshData = async () => {
  try {
    await transactionsStore.refreshData()
    success('Data Refreshed', 'Your data has been updated successfully')
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to refresh data'
    success('Refresh Failed', errorMessage)
  }
}

const addMoney = async (amount: number) => {
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      error('Authentication Error', 'Please login first')
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
      success('Success', `Successfully added ${amount} AED to your wallet!`)
      await transactionsStore.fetchTransactions()
    } else {
      error('Failed', 'Failed to add money: ' + response.data.message)
    }
  } catch (err) {
    console.error('Add money error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    const responseMessage = (err as { response?: { data?: { message?: string } } })?.response?.data
      ?.message
    error('Error', 'Error adding money: ' + (responseMessage || errorMessage))
  }
}

const handleQuickSend = (beneficiary: {
  beneficiary_user?: { email?: string }
  nickname: string
}) => {
  // Navigate to transactions page with pre-filled beneficiary
  router.push({
    path: '/transactions',
    query: {
      beneficiary: beneficiary.beneficiary_user?.email || '',
      nickname: beneficiary.nickname,
    },
  })
}

// Lifecycle
let refreshInterval: number | null = null

onMounted(async () => {
  // Always fetch user data, transactions, and beneficiaries on mount
  await Promise.all([
    transactionsStore.fetchTransactions(),
    beneficiariesStore.fetchBeneficiaries(),
  ])

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
