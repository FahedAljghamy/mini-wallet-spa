<!--
  TransactionForm Component

  Form component for sending money to other users

  @author Fahed
-->

<template>
  <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-elevated border border-white/20">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Send Money</h2>
        <p class="text-gray-600">Transfer funds securely</p>
      </div>
      <div class="w-12 h-12 gradient-success rounded-2xl flex items-center justify-center">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Receiver Email -->
      <div>
        <label for="receiver_email" class="block text-sm font-medium text-gray-700 mb-3">
          Receiver Email
        </label>
        <div class="relative">
          <input
            id="receiver_email"
            v-model="form.receiver_email"
            type="email"
            required
            :class="[
              'w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300',
              getFieldError('receiver_email') ? 'border-red-500 ring-2 ring-red-200' : '',
            ]"
            placeholder="Enter receiver's email address"
            :disabled="loading"
            @input="clearFieldError('receiver_email')"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          </div>
        </div>
        <p
          v-if="getFieldError('receiver_email')"
          class="mt-2 text-sm text-red-600 flex items-center"
        >
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          {{ getFieldError('receiver_email') }}
        </p>
      </div>

      <!-- Amount -->
      <div>
        <label for="amount" class="block text-sm font-medium text-gray-700 mb-3">
          Amount ({{ currentCurrency }})
        </label>
        <div class="relative">
          <input
            id="amount"
            v-model.number="form.amount"
            type="number"
            step="0.01"
            min="0.01"
            max="100000"
            required
            :class="[
              'w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300',
              getFieldError('amount') ? 'border-red-500 ring-2 ring-red-200' : '',
            ]"
            placeholder="Enter amount (e.g., 100.00)"
            :disabled="loading"
            @input="onAmountChange"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
        </div>
        <p v-if="getFieldError('amount')" class="mt-2 text-sm text-red-600 flex items-center">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          {{ getFieldError('amount') }}
        </p>
      </div>

      <!-- Commission Fee (Auto-calculated) -->
      <div>
        <label for="commission_fee" class="block text-sm font-medium text-gray-700 mb-3">
          Commission Fee (1.5%) <span class="text-gray-500 text-sm">(Auto-calculated)</span>
        </label>
        <div class="relative">
          <input
            id="commission_fee"
            v-model.number="form.commission_fee"
            type="number"
            step="0.01"
            min="0"
            max="1000"
            readonly
            :class="[
              'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-600 cursor-not-allowed focus:outline-none',
              getFieldError('commission_fee') ? 'border-red-500 ring-2 ring-red-200' : '',
            ]"
            placeholder="0.00"
            :disabled="true"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg
              class="w-5 h-5 text-gray-400"
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
        <p
          v-if="getFieldError('commission_fee')"
          class="mt-2 text-sm text-red-600 flex items-center"
        >
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          {{ getFieldError('commission_fee') }}
        </p>
      </div>

      <!-- Total Amount Display -->
      <div
        v-if="form.amount && form.amount > 0"
        class="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-2xl border border-primary-200"
      >
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 font-medium">Amount:</span>
            <span class="font-semibold text-gray-900">{{ formatCurrency(form.amount) }}</span>
          </div>
          <div v-if="form.commission_fee > 0" class="flex justify-between items-center">
            <span class="text-gray-600 font-medium">Commission (1.5%):</span>
            <span class="font-semibold text-orange-600">{{
              formatCurrency(form.commission_fee)
            }}</span>
          </div>
          <div class="flex justify-between items-center pt-3 border-t border-primary-200">
            <span class="text-gray-900 font-bold text-lg">Total Amount:</span>
            <span class="text-primary-600 font-bold text-xl">{{
              formatCurrency(totalAmount)
            }}</span>
          </div>
        </div>
      </div>

      <!-- Currency Toggle -->
      <div class="flex items-center justify-between mb-6">
        <label class="block text-sm font-medium text-gray-700">Display Currency</label>
        <button
          @click="toggleCurrency"
          class="flex items-center space-x-2 bg-white/50 hover:bg-white/70 px-4 py-2 rounded-xl border border-gray-200 transition-all duration-300 hover:border-primary-300"
        >
          <span class="text-primary-600 font-semibold">{{ currentCurrency }}</span>
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        </button>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading || !isFormValid"
        class="w-full btn-primary text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-200"
      >
        <span v-if="loading" class="flex items-center justify-center">
          <svg
            class="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
          Sending Transaction...
        </span>
        <span v-else-if="isFormValid" class="flex items-center justify-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          Send {{ formatCurrency(totalAmount) }}
        </span>
        <span v-else class="flex items-center justify-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          Send Money
        </span>
      </button>
    </form>

    <!-- Success Message -->
    <div v-if="successMessage" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * TransactionForm Component Logic
 * Author: Fahed
 */

import { ref, computed, reactive } from 'vue'
import { useTransactionsStore } from '@/stores/transactions'

// Currency state
const currentCurrency = ref<'AED' | 'USD' | 'EUR' | 'GBP'>('AED')
const exchangeRates = ref<Record<string, number>>({
  AED: 1,
  USD: 0.27,
  EUR: 0.25,
  GBP: 0.21,
})

// Store
const transactionsStore = useTransactionsStore()

// Form data
const form = reactive({
  receiver_email: '',
  amount: null as number | null,
  commission_fee: 0,
})

// State
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Computed
const totalAmount = computed(() => {
  return (form.amount || 0) + form.commission_fee
})

const isFormValid = computed(() => {
  return (
    form.receiver_email &&
    form.receiver_email.includes('@') &&
    form.amount !== null &&
    form.amount !== undefined &&
    form.amount > 0 &&
    form.amount <= 100000 &&
    form.commission_fee >= 0 &&
    form.commission_fee <= 1000
  )
})

// Methods
const getFieldError = (field: string): string => {
  // Check server validation errors first
  if (transactionsStore.validationErrors[field]) {
    return transactionsStore.validationErrors[field][0]
  }
  // Check client-side form errors
  if (transactionsStore.formErrors[field]) {
    return transactionsStore.formErrors[field]
  }
  return ''
}

const clearFieldError = (field: string) => {
  // Clear specific field errors
  if (transactionsStore.validationErrors[field]) {
    delete transactionsStore.validationErrors[field]
  }
  if (transactionsStore.formErrors[field]) {
    delete transactionsStore.formErrors[field]
  }
}

const clearAllErrors = () => {
  successMessage.value = ''
  errorMessage.value = ''
  transactionsStore.clearAllErrors()
}

const onAmountChange = () => {
  clearFieldError('amount')
  // Auto-calculate commission (1.5%)
  if (form.amount && form.amount > 0) {
    form.commission_fee = Math.round(form.amount * 0.015 * 100) / 100
  } else {
    form.commission_fee = 0
  }
}

const validateForm = () => {
  if (!form.receiver_email) {
    errorMessage.value = 'Please enter receiver email'
    return false
  }
  if (!form.receiver_email.includes('@')) {
    errorMessage.value = 'Please enter a valid email address'
    return false
  }
  if (!form.amount || form.amount <= 0) {
    errorMessage.value = 'Please enter a valid amount'
    return false
  }
  if (form.amount > 100000) {
    errorMessage.value = 'Amount cannot exceed $100,000'
    return false
  }
  return true
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

const toggleCurrency = () => {
  const currencies: Array<'AED' | 'USD' | 'EUR' | 'GBP'> = ['AED', 'USD', 'EUR', 'GBP']
  const currentIndex = currencies.indexOf(currentCurrency.value)
  const nextIndex = (currentIndex + 1) % currencies.length
  currentCurrency.value = currencies[nextIndex]
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true
    clearAllErrors()

    await transactionsStore.sendTransaction(
      form.receiver_email,
      form.amount!,
      form.commission_fee || undefined,
    )

    successMessage.value = `Successfully sent $${form.amount!.toFixed(2)} to ${form.receiver_email}`

    // Reset form
    form.receiver_email = ''
    form.amount = null
    form.commission_fee = 0

    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error: unknown) {
    // Use the error message from the store if available
    errorMessage.value =
      transactionsStore.error ||
      (error instanceof Error ? error.message : 'Failed to send transaction')

    // Clear error message after 8 seconds (longer for better UX)
    setTimeout(() => {
      errorMessage.value = ''
    }, 8000)
  } finally {
    loading.value = false
  }
}
</script>
