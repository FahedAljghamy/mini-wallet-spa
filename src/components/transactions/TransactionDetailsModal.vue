<!--
  TransactionDetailsModal - Transaction Details Popup Modal

  Beautiful modal component for displaying detailed transaction information

  @author Fahed
-->

<template>
  <!-- Modal Backdrop -->
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click="handleBackdropClick">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"></div>

    <!-- Modal Container -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        ref="modalRef"
        class="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 scale-100"
        @click.stop
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <BaseIcon
                  :name="getStatusIcon(transaction?.status || '')"
                  size="lg"
                  color="white"
                />
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Transaction Details</h3>
                <p class="text-sm text-white/80">{{ transaction?.status_label }}</p>
              </div>
            </div>
            <button
              @click="$emit('close')"
              class="text-white hover:text-white/80 transition-colors duration-200 bg-white/10 hover:bg-white/20 rounded-xl p-2"
            >
              <BaseIcon name="x" size="lg" color="white" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6" v-if="transaction">
          <!-- Amount Section -->
          <div class="text-center">
            <div class="text-3xl font-bold text-gray-900 mb-2">
              {{ transaction.amount }}
            </div>
            <div class="text-sm text-gray-600">
              {{ transaction.total_amount }} total (includes {{ transaction.commission_fee }} fee)
            </div>
          </div>

          <!-- Transaction Info Cards -->
          <div class="space-y-4">
            <!-- Sender Card -->
            <div class="bg-gray-50 rounded-2xl p-4">
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BaseIcon name="user" size="sm" color="primary" />
                </div>
                <h4 class="font-semibold text-gray-900">Sender</h4>
              </div>
              <div class="pl-11 space-y-1">
                <p class="font-medium text-gray-900">{{ transaction.sender.name }}</p>
                <p class="text-sm text-gray-600">{{ transaction.sender.email }}</p>
              </div>
            </div>

            <!-- Receiver Card -->
            <div class="bg-gray-50 rounded-2xl p-4">
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                  <BaseIcon name="user" size="sm" color="success" />
                </div>
                <h4 class="font-semibold text-gray-900">Receiver</h4>
              </div>
              <div class="pl-11 space-y-1">
                <p class="font-medium text-gray-900">{{ transaction.receiver.name }}</p>
                <p class="text-sm text-gray-600">{{ transaction.receiver.email }}</p>
              </div>
            </div>
          </div>

          <!-- Transaction Details -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
            <h4 class="font-semibold text-gray-900 mb-4 flex items-center">
              <BaseIcon name="document-text" size="sm" color="primary" />
              <span class="ml-2">Transaction Information</span>
            </h4>

            <div class="space-y-3">
              <!-- Transaction ID -->
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Transaction ID</span>
                <span class="text-sm font-mono font-medium text-gray-900"
                  >#{{ transaction.id }}</span
                >
              </div>

              <!-- Status -->
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Status</span>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusBadgeClass(transaction.status)"
                >
                  {{ transaction.status_label }}
                </span>
              </div>

              <!-- Commission Fee -->
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Commission Fee</span>
                <span class="text-sm font-medium text-gray-900">{{
                  transaction.commission_fee
                }}</span>
              </div>

              <!-- Created Date -->
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Created</span>
                <span class="text-sm font-medium text-gray-900">{{
                  transaction.created_at_human
                }}</span>
              </div>

              <!-- Updated Date -->
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Last Updated</span>
                <span class="text-sm font-medium text-gray-900">{{
                  formatDate(transaction.updated_at)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else class="p-6 text-center">
          <div
            class="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"
          ></div>
          <p class="text-gray-600">Loading transaction details...</p>
        </div>

        <!-- Error State -->
        <div v-if="error" class="p-6 text-center">
          <div
            class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <BaseIcon name="exclamation-triangle" size="xl" color="danger" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Error Loading Transaction</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button
            @click="$emit('retry')"
            class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors duration-200"
          >
            <BaseIcon name="arrow-path" size="sm" color="white" />
            <span class="ml-2">Retry</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseIcon from '../ui/BaseIcon.vue'

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

interface Props {
  isOpen: boolean
  transaction: DetailedTransaction | null
  error: string | null
}

defineProps<Props>()

defineEmits<{
  close: []
  retry: []
}>()

const modalRef = ref<HTMLElement | null>(null)

// Handle backdrop click
const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    // Close modal when clicking backdrop
    // You can emit close event here if needed
  }
}

// Get status icon based on transaction status
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return 'check-circle'
    case 'pending':
      return 'clock'
    case 'failed':
      return 'x-circle'
    case 'cancelled':
      return 'x-mark'
    default:
      return 'document'
  }
}

// Get status badge class based on transaction status
const getStatusBadgeClass = (status: string) => {
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

// Format date for display
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
</script>

<style scoped>
/* Custom animations for modal */
@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes modal-leave {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

/* Apply animations */
.modal-enter-active {
  animation: modal-enter 0.3s ease-out;
}

.modal-leave-active {
  animation: modal-leave 0.2s ease-in;
}
</style>
