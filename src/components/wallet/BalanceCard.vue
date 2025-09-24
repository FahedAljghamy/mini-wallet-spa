<!--
  BalanceCard - Wallet Balance Display Component

  Reusable component for displaying wallet balance with currency conversion

  @author Fahed
-->

<template>
  <div
    class="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 rounded-3xl shadow-xl p-8 text-white"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div
        class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"
      ></div>
      <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
      <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full"></div>
    </div>

    <!-- Content -->
    <div class="relative">
      <!-- Balance Amount -->
      <div class="text-center mb-6">
        <div class="text-4xl sm:text-5xl font-bold text-white mb-2 text-truncate">
          {{ formattedBalance }}
        </div>

        <!-- Currency Toggle -->
        <div class="flex items-center justify-center space-x-2">
          <p class="text-sm font-medium text-white/80">{{ currentCurrency }}</p>
          <button
            @click="toggleCurrency"
            class="text-white/90 hover:text-white text-sm font-medium transition-colors duration-200 underline"
          >
            Switch
          </button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Add Money -->
        <button
          @click="$emit('add-money')"
          class="bg-white/20 hover:bg-white/30 rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105 backdrop-blur-sm"
        >
          <div
            class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3"
          >
            <BaseIcon name="plus" size="lg" color="white" />
          </div>
          <p class="text-sm font-medium text-white">Add Money</p>
        </button>

        <!-- Send Money -->
        <button
          @click="$emit('send-money')"
          class="bg-white/20 hover:bg-white/30 rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105 backdrop-blur-sm"
        >
          <div
            class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3"
          >
            <BaseIcon name="send" size="lg" color="white" />
          </div>
          <p class="text-sm font-medium text-white">Send Money</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCurrency } from '../../composables/useCurrency'
import BaseIcon from '../ui/BaseIcon.vue'

interface Props {
  balance: string | number
  initialCurrency?: 'AED' | 'USD' | 'EUR' | 'GBP'
}

const props = withDefaults(defineProps<Props>(), {
  initialCurrency: 'AED',
})

defineEmits<{
  'add-money': []
  'send-money': []
}>()

// Composables
const { currentCurrency, formatCurrency, toggleCurrency } = useCurrency(props.initialCurrency)

// Computed
const formattedBalance = computed(() => {
  // Handle empty or invalid balance
  const rawBalance = props.balance || '0.00'
  let amount: number

  if (typeof rawBalance === 'string') {
    // Remove any currency symbols and commas
    const cleanString = rawBalance.replace(/[^\d.-]/g, '')
    amount = parseFloat(cleanString) || 0
  } else {
    amount = rawBalance || 0
  }

  // Ensure it's a valid number
  const validAmount = isNaN(amount) ? 0 : amount

  return formatCurrency(validAmount, true) // Enable currency conversion
})
</script>
