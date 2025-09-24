<!--
  TransactionCard - Individual Transaction Display Component

  Reusable card component for displaying individual transactions

  @author Fahed
-->

<template>
  <div
    @click="$emit('click', transaction)"
    class="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:bg-white/90 hover:-translate-y-1 cursor-pointer"
  >
    <div class="flex items-start sm:items-center justify-between gap-4">
      <!-- Left Section: Icon and Details -->
      <div class="flex items-start sm:items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
        <!-- Transaction Icon -->
        <div :class="transactionIconClasses">
          <BaseIcon :name="transactionIcon" size="lg" :color="transactionIconColor" />
        </div>

        <!-- Transaction Details -->
        <div class="min-w-0 flex-1">
          <p class="card-text mb-1">
            {{ transactionLabel }}
            <span class="font-semibold name-truncate">{{ counterpartyName }}</span>
          </p>
          <p class="text-sm text-gray-600">{{ formattedDate }}</p>
        </div>
      </div>

      <!-- Right Section: Amount and Status -->
      <div class="text-right min-w-0 flex-shrink-0 sm:flex-shrink-0">
        <!-- Amount -->
        <p :class="amountClasses" class="text-truncate">
          {{ transactionPrefix }}{{ formattedAmount }}
        </p>

        <!-- Status Badge -->
        <span :class="statusClasses" class="text-xs">
          {{ transaction.status_label }}
        </span>
      </div>
    </div>

    <!-- Additional Details (Optional) -->
    <div v-if="showDetails" class="mt-4 pt-4 border-t border-gray-200">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-gray-500">Transaction ID</p>
          <p class="font-mono text-gray-900">#{{ transaction.id }}</p>
        </div>
        <div>
          <p class="text-gray-500">Commission Fee</p>
          <p class="text-gray-900">{{ formatCurrency(transaction.commission_fee_raw || 0) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCurrency } from '../../composables/useCurrency'
import { STATUS_COLORS } from '../../constants'
import type { Transaction } from '../../types'
import BaseIcon from '../ui/BaseIcon.vue'

interface Props {
  transaction: Transaction
  currentUserId?: number
  showDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: false,
})

defineEmits<{
  click: [transaction: Transaction]
}>()

// Composables
const { formatCurrency } = useCurrency()

// Computed
const isSentTransaction = computed(() => {
  return props.currentUserId && props.transaction.sender.id === props.currentUserId
})

const transactionIcon = computed(() => {
  return isSentTransaction.value ? 'arrow-up' : 'arrow-down'
})

const transactionIconColor = computed(() => {
  return isSentTransaction.value ? 'danger' : 'success'
})

const transactionIconClasses = computed(() => {
  return [
    'w-12 h-12 rounded-xl flex items-center justify-center',
    isSentTransaction.value ? 'bg-red-100' : 'bg-green-100',
  ]
})

const transactionLabel = computed(() => {
  return isSentTransaction.value ? 'Sent to' : 'Received from'
})

const counterpartyName = computed(() => {
  return isSentTransaction.value ? props.transaction.receiver.name : props.transaction.sender.name
})

const transactionPrefix = computed(() => {
  return isSentTransaction.value ? '-' : '+'
})

const amountClasses = computed(() => {
  return ['font-bold text-lg', isSentTransaction.value ? 'text-red-600' : 'text-green-600']
})

const statusClasses = computed(() => {
  const status = props.transaction.status as keyof typeof STATUS_COLORS
  return [
    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
    STATUS_COLORS[status] || STATUS_COLORS.completed,
  ]
})

const formattedAmount = computed(() => {
  return formatCurrency(props.transaction.amount_raw || 0)
})

const formattedDate = computed(() => {
  const date = new Date(props.transaction.created_at)
  return date.toLocaleDateString('en-AE', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})
</script>
