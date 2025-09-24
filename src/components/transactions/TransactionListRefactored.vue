<!--
  TransactionListRefactored - Modern Transaction List Component

  Refactored transaction list using new component architecture

  @author Fahed
-->

<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Transaction History</h2>
        <p class="text-gray-600">{{ transactions.length }} total transactions</p>
      </div>
      <div class="flex items-center space-x-3">
        <!-- Currency Toggle -->
        <button
          @click="toggleCurrency"
          class="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
        >
          <BaseIcon name="refresh" size="sm" color="gray" />
          <span class="text-sm font-medium text-gray-700">{{ currentCurrency }}</span>
        </button>

        <!-- Refresh Button -->
        <button
          @click="refreshTransactions"
          :disabled="loading"
          class="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 disabled:opacity-50"
        >
          <BaseIcon name="refresh" size="sm" color="gray" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>

    <!-- Transactions List -->
    <div class="space-y-4">
      <TransactionCard
        v-for="transaction in transactions"
        :key="transaction.id"
        :transaction="transaction"
        :current-user-id="user?.id"
        :show-details="false"
        @click="handleTransactionClick"
      />
    </div>

    <!-- Empty State -->
    <div v-if="transactions.length === 0 && !loading" class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <BaseIcon name="document" size="xl" color="gray" />
      </div>
      <h3 class="card-title mb-2">No transactions yet</h3>
      <p class="text-sm text-gray-600 mb-4">Start by sending money to another user</p>
      <BaseButton variant="primary" @click="$emit('start-transaction')"> Send Money </BaseButton>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"
      ></div>
      <p class="text-sm text-gray-600">Loading transactions...</p>
    </div>

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
import { useTransactionsStore } from '../../stores/transactions'
import { useCurrency } from '../../composables/useCurrency'
import { useNotifications } from '../../composables/useNotifications'
import type { Transaction } from '../../types'

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

// Components
import BaseButton from '../ui/BaseButton.vue'
import BaseIcon from '../ui/BaseIcon.vue'
import TransactionCard from './TransactionCard.vue'
import TransactionDetailsModal from './TransactionDetailsModal.vue'

// Composables
const transactionsStore = useTransactionsStore()
const { currentCurrency, toggleCurrency } = useCurrency()
const { error } = useNotifications()

// Modal state
const isModalOpen = ref(false)
const selectedTransaction = ref<DetailedTransaction | null>(null)
const modalError = ref<string | null>(null)

// Emits
defineEmits<{
  'start-transaction': []
}>()

// Computed
const transactions = computed(() => transactionsStore.transactions)
const loading = computed(() => transactionsStore.loading)
const user = computed(() => transactionsStore.user)

// Methods
const refreshTransactions = async () => {
  try {
    await transactionsStore.fetchTransactions()
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to refresh transactions'
    error('Refresh Failed', errorMessage)
  }
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

// Lifecycle
onMounted(async () => {
  // Always fetch user data and transactions on mount (fetchTransactions already includes user data)
  await refreshTransactions()

  // Check Pusher connection for real-time updates
  checkPusherConnection()
})

onUnmounted(() => {
  // Cleanup if needed
})

// Expose methods to parent component
defineExpose({
  refreshTransactions,
})

const checkPusherConnection = () => {
  // Check if Pusher is available and connected
  if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).pusher) {
    const pusher = (window as unknown as Record<string, unknown>).pusher as
      | { connection: { state: string } }
      | undefined
    if (pusher && pusher.connection.state === 'connected') {
      console.log('Pusher connected for real-time updates')
    }
  }
}
</script>
