<!--
  TransactionList Component

  Component for displaying user transactions and balance

  @author Fahed
-->

<template>
  <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-elevated border border-white/20">
    <!-- Balance Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Wallet Balance</h2>
          <p class="text-gray-600">Available funds</p>
        </div>
        <div class="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
            />
          </svg>
        </div>
      </div>

      <div
        class="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-elevated"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-primary-100 text-sm font-medium">Available Balance</p>
            <p class="text-4xl font-bold mt-1">{{ formattedBalance }}</p>
          </div>
          <div class="text-primary-100">
            <svg class="w-16 h-16 opacity-80" fill="currentColor" viewBox="0 0 20 20">
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
      </div>
    </div>

    <!-- User Info -->
    <div v-if="user" class="mb-8 p-6 bg-white/50 rounded-2xl border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg
          class="w-5 h-5 mr-2 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        Account Information
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex items-center">
          <div
            class="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-3"
          >
            <span class="text-white font-semibold text-sm">{{
              user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
            }}</span>
          </div>
          <div>
            <p class="font-medium text-gray-900">{{ user.name }}</p>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Transactions Section -->
    <div>
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <h3 class="text-xl font-bold text-gray-900 mr-3">Recent Transactions</h3>
          <span
            class="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            {{ transactions.length }}
          </span>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="toggleCurrency"
            class="flex items-center space-x-2 bg-white/50 hover:bg-white/70 px-3 py-2 rounded-xl border border-gray-200 transition-all duration-300 hover:border-primary-300"
          >
            <span class="text-primary-600 font-semibold text-sm">{{ currentCurrency }}</span>
            <svg
              class="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </button>
          <button
            @click="refreshTransactions"
            :disabled="loading"
            class="flex items-center space-x-2 bg-primary-50 hover:bg-primary-100 px-3 py-2 rounded-xl border border-primary-200 transition-all duration-300 disabled:opacity-50"
          >
            <svg
              v-if="loading"
              class="animate-spin h-4 w-4 text-primary-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg
              v-else
              class="h-4 w-4 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span class="text-primary-600 font-medium text-sm">Refresh</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && transactions.length === 0" class="text-center py-8">
        <svg
          class="animate-spin h-8 w-8 text-primary-600 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="text-gray-500">Loading transactions...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="transactions.length === 0" class="text-center py-8">
        <svg
          class="h-12 w-12 text-gray-400 mx-auto mb-4"
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
        <p class="text-gray-500">No transactions yet</p>
        <p class="text-gray-400 text-sm">Your transaction history will appear here</p>
      </div>

      <!-- Transactions List -->
      <div v-else class="space-y-4">
        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          class="bg-white/50 border border-gray-200 rounded-2xl p-6 hover:shadow-card transition-all duration-300 hover:bg-white/70 card-hover"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <!-- Transaction Type and Amount -->
              <div class="flex items-center mb-4">
                <div
                  :class="[
                    'w-12 h-12 rounded-2xl flex items-center justify-center mr-4',
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
                <div class="flex-1">
                  <p class="font-semibold text-gray-900 text-lg">
                    {{ isSentTransaction(transaction) ? 'Sent to' : 'Received from' }}
                    {{
                      isSentTransaction(transaction)
                        ? transaction.receiver.name
                        : transaction.sender.name
                    }}
                  </p>
                  <p class="text-sm text-gray-500 mt-1">
                    {{
                      isSentTransaction(transaction)
                        ? transaction.receiver.email
                        : transaction.sender.email
                    }}
                  </p>
                </div>
              </div>

              <!-- Amount and Status -->
              <div class="flex items-center justify-between mt-4">
                <div>
                  <p
                    :class="[
                      'text-2xl font-bold',
                      isSentTransaction(transaction) ? 'text-red-600' : 'text-green-600',
                    ]"
                  >
                    {{ isSentTransaction(transaction) ? '-' : '+'
                    }}{{ formatCurrency(parseFloat(transaction.amount)) }}
                  </p>
                  <p
                    v-if="parseFloat(transaction.commission_fee) > 0"
                    class="text-sm text-gray-500 mt-1"
                  >
                    Commission: {{ formatCurrency(parseFloat(transaction.commission_fee)) }}
                  </p>
                </div>
                <div class="text-right">
                  <span
                    :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                      getStatusClass(transaction.status),
                    ]"
                  >
                    {{ transaction.status }}
                  </span>
                  <p class="text-sm text-gray-500 mt-2">
                    {{ formatDate(transaction.created_at) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="flex-1">
            <p class="text-sm font-medium text-red-800">{{ error }}</p>
            <button
              @click="clearError"
              class="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * TransactionList Component Logic
 * Author: Fahed
 */

import { computed, onMounted, ref } from 'vue'
import { useTransactionsStore } from '@/stores/transactions'

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
const balance = computed(() => transactionsStore.balance)
const transactions = computed(() => transactionsStore.transactions)
const user = computed(() => transactionsStore.user)
const loading = computed(() => transactionsStore.loading)
const error = computed(() => transactionsStore.error)

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
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
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

const refreshTransactions = async () => {
  await transactionsStore.fetchTransactions()
}

const clearError = () => {
  transactionsStore.clearError()
}

const toggleCurrency = () => {
  const currencies: Array<'AED' | 'USD' | 'EUR' | 'GBP'> = ['AED', 'USD', 'EUR', 'GBP']
  const currentIndex = currencies.indexOf(currentCurrency.value)
  const nextIndex = (currentIndex + 1) % currencies.length
  currentCurrency.value = currencies[nextIndex]
}

// Lifecycle
onMounted(() => {
  if (transactions.value.length === 0) {
    refreshTransactions()
  }
})
</script>
