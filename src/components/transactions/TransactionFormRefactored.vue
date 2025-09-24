<!--
  TransactionFormRefactored - Modern Transaction Form Component

  Refactored transaction form using new component architecture

  @author Fahed
-->

<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <div
        class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg"
      >
        <BaseIcon name="send" size="xl" color="white" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Send Money</h2>
      <p class="text-gray-600">Transfer funds securely to another user</p>
    </div>

    <!-- Validation Messages -->
    <div
      v-if="Object.keys(errors).length > 0"
      class="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl shadow-sm"
    >
      <div class="flex items-start space-x-3">
        <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <BaseIcon name="exclamation-triangle" size="sm" color="danger" />
        </div>
        <div class="flex-1">
          <div class="space-y-2">
            <div
              v-for="(error, field) in errors"
              :key="field"
              class="text-sm text-red-700 bg-white/60 px-3 py-2 rounded-lg border border-red-100"
            >
              {{ error }}
            </div>
          </div>
        </div>
        <button
          @click="errors = {}"
          class="p-1.5 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
          title="Close errors"
        >
          <BaseIcon name="close" size="sm" color="danger" />
        </button>
      </div>
    </div>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-sm"
    >
      <div class="flex items-start space-x-3">
        <div
          class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"
        >
          <BaseIcon name="check-circle" size="sm" color="success" />
        </div>
        <div class="flex-1">
          <p
            class="text-sm text-green-800 bg-white/60 px-3 py-2 rounded-lg border border-green-100"
          >
            {{ successMessage }}
          </p>
        </div>
        <button
          @click="successMessage = ''"
          class="p-1.5 hover:bg-green-100 rounded-full transition-colors flex-shrink-0"
          title="Close message"
        >
          <BaseIcon name="close" size="sm" color="success" />
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Receiver Email Dropdown -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Receiver Email <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <select
            v-model="form.receiver_email"
            class="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-white"
            :class="{ 'border-red-500': errors.receiver_email }"
            required
          >
            <option value="">Select a beneficiary or enter email</option>
            <optgroup label="My Beneficiaries">
              <option
                v-for="beneficiary in beneficiaries"
                :key="beneficiary.id"
                :value="beneficiary.beneficiary_user?.email || ''"
              >
                {{ beneficiary.nickname }} ({{ beneficiary.beneficiary_user?.name || 'Unknown' }})
              </option>
              <option v-if="beneficiaries.length === 0" disabled>
                No beneficiaries yet - Add some from the Beneficiaries page
              </option>
            </optgroup>
            <optgroup label="Quick Add">
              <option value="__manual__">Enter email manually</option>
            </optgroup>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <BaseIcon name="chevron-down" size="sm" color="gray" />
          </div>
        </div>

        <!-- Manual Email Input (shown when manual option is selected) -->
        <BaseInput
          v-if="form.receiver_email === '__manual__'"
          v-model="manualEmail"
          type="email"
          label="Email Address"
          placeholder="Enter receiver's email address"
          :error="errors.receiver_email"
        >
          <template #prefix>
            <BaseIcon name="mail" size="sm" color="gray" />
          </template>
        </BaseInput>

        <!-- Error Message -->
        <div
          v-if="errors.receiver_email"
          class="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <div class="flex items-start space-x-2">
            <BaseIcon
              name="exclamation-triangle"
              size="sm"
              color="danger"
              class="mt-0.5 flex-shrink-0"
            />
            <div class="flex-1">
              <p class="text-sm text-red-700">{{ errors.receiver_email }}</p>
              <p
                v-if="errors.receiver_email?.includes('unverified')"
                class="text-xs text-gray-600 mt-1 bg-white/60 px-2 py-1 rounded border border-gray-200"
              >
                💡 Tip: Ask the recipient to check their email and click the verification link
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Amount -->
      <BaseInput
        :model-value="form.amount?.toString() || ''"
        @update:model-value="
          (value: string | number) => {
            console.log('Amount changed:', value)
            form.amount = parseFloat(value.toString()) || 0
            calculateCommission()
          }
        "
        type="number"
        label="Amount"
        placeholder="0.00"
        :error="errors.amount"
        required
        step="0.01"
        min="0.01"
      >
        <template #prefix>
          <BaseIcon name="currency" size="sm" color="gray" />
        </template>
        <template #suffix>
          <span class="text-sm text-gray-600">{{ currentCurrency }}</span>
        </template>
      </BaseInput>

      <!-- Amount Error Message -->
      <div v-if="errors.amount" class="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-start space-x-2">
          <BaseIcon
            name="exclamation-triangle"
            size="sm"
            color="danger"
            class="mt-0.5 flex-shrink-0"
          />
          <p class="text-sm text-red-700">{{ errors.amount }}</p>
        </div>
      </div>

      <!-- Commission Fee (Auto-calculated) -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700"> Commission Fee (1.5%) </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BaseIcon name="calculator" size="sm" color="gray" />
          </div>
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span class="text-sm text-gray-600">{{ currentCurrency }}</span>
          </div>
          <input
            type="text"
            :value="formatCurrency(calculatedCommission)"
            readonly
            class="block w-full pl-10 pr-16 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <p class="text-sm text-gray-600">Automatically calculated at 1.5% of the amount</p>
      </div>

      <!-- Total Amount Display -->
      <div
        class="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-2xl border border-primary-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-700">Total Amount</p>
            <p class="text-sm text-gray-600">Amount + Commission Fee</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-primary-600">{{ formatCurrency(totalAmount) }}</p>
          </div>
        </div>
      </div>

      <!-- Currency Toggle -->
      <div class="flex items-center justify-center">
        <BaseButton variant="secondary" size="sm" @click="toggleCurrency">
          <BaseIcon name="refresh" size="sm" class="mr-2" />
          Switch to {{ nextCurrency }}
        </BaseButton>
      </div>

      <!-- Send Button -->
      <div class="space-y-4">
        <button
          type="submit"
          :disabled="!isFormValid || loading"
          class="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center space-x-3"
        >
          <BaseIcon name="send" size="md" color="white" />
          <span v-if="loading">Sending Transaction...</span>
          <span v-else-if="isFormValid">Send {{ formatCurrency(totalAmount) }} Now</span>
          <span v-else>Send Money</span>
        </button>

        <!-- Quick Send Options -->
        <div class="grid grid-cols-3 gap-3">
          <BaseButton variant="secondary" size="sm" @click="setQuickAmount(50)" class="text-xs">
            $50
          </BaseButton>
          <BaseButton variant="secondary" size="sm" @click="setQuickAmount(100)" class="text-xs">
            $100
          </BaseButton>
          <BaseButton variant="secondary" size="sm" @click="setQuickAmount(200)" class="text-xs">
            $200
          </BaseButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { useTransactionsStore } from '../../stores/transactions'
import { useBeneficiariesStore } from '../../stores/beneficiaries'
import { useCurrency } from '../../composables/useCurrency'
import { useNotifications } from '../../composables/useNotifications'
import type { TransactionForm } from '../../types'

// Components - Lazy Loading
import { defineAsyncComponent } from 'vue'

const BaseInput = defineAsyncComponent({
  loader: () => import('../ui/BaseInput.vue'),
  loadingComponent: {
    template: '<div class="animate-pulse bg-gray-200 h-12 rounded-xl"></div>',
  },
  delay: 200,
  timeout: 3000,
})

const BaseButton = defineAsyncComponent({
  loader: () => import('../ui/BaseButton.vue'),
  loadingComponent: {
    template: '<div class="animate-pulse bg-gray-200 h-10 rounded-xl"></div>',
  },
  delay: 200,
  timeout: 3000,
})

const BaseIcon = defineAsyncComponent({
  loader: () => import('../ui/BaseIcon.vue'),
  loadingComponent: {
    template: '<div class="animate-pulse bg-gray-200 w-6 h-6 rounded"></div>',
  },
  delay: 100,
  timeout: 3000,
})

// Composables
const transactionsStore = useTransactionsStore()
const beneficiariesStore = useBeneficiariesStore()
const { currentCurrency, availableCurrencies, formatCurrency, toggleCurrency } = useCurrency()
const { success } = useNotifications()

// Emits
const emit = defineEmits<{
  'transaction-success': [message: string]
  'refresh-transactions': []
}>()

// State
const loading = ref(false)
const errors = ref<Record<string, string>>({})
const successMessage = ref('')
const manualEmail = ref('')

const form = reactive<TransactionForm>({
  receiver_email: '',
  amount: 0,
  commission_fee: 0,
})

// Computed
const isFormValid = computed(() => {
  const email = form.receiver_email === '__manual__' ? manualEmail.value : form.receiver_email
  const valid = email && email.includes('@') && form.amount && form.amount > 0
  console.log('Form validation:', {
    email: email,
    amount: form.amount,
    valid: valid,
  })
  return valid
})

const calculatedCommission = computed(() => {
  const amount = form.amount || 0
  return amount * 0.015 // 1.5% commission
})

const totalAmount = computed(() => {
  const amount = form.amount || 0
  const commission = calculatedCommission.value
  return amount + commission
})

const nextCurrency = computed(() => {
  const currencies = availableCurrencies.value
  const currentIndex = currencies.indexOf(currentCurrency.value)
  const nextIndex = (currentIndex + 1) % currencies.length
  return currencies[nextIndex]
})

const beneficiaries = computed(() => beneficiariesStore.beneficiaries)

// Methods
const calculateCommission = () => {
  // Commission is automatically calculated in computed property
  // This method is called when amount changes
}

const setQuickAmount = (amount: number) => {
  form.amount = amount
  calculateCommission()
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    return
  }

  try {
    loading.value = true
    errors.value = {}
    successMessage.value = ''

    const email = form.receiver_email === '__manual__' ? manualEmail.value : form.receiver_email

    await transactionsStore.sendTransaction(email, form.amount || 0, calculatedCommission.value)

    // Success
    const message = `Successfully sent ${formatCurrency(form.amount || 0)} to ${email}`
    successMessage.value = message
    success('Transaction Successful', message)
    emit('transaction-success', message)
    emit('refresh-transactions')

    // Reset form
    form.receiver_email = ''
    manualEmail.value = ''
    form.amount = 0
    form.commission_fee = 0

    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (err: unknown) {
    console.error('Transaction error:', err)

    // Check if the store has validation errors
    if (
      transactionsStore.validationErrors &&
      Object.keys(transactionsStore.validationErrors).length > 0
    ) {
      console.log('📋 Using store validation errors:', transactionsStore.validationErrors)
      // Convert string[] to string for display
      const convertedErrors: Record<string, string> = {}
      Object.entries(transactionsStore.validationErrors).forEach(([key, value]) => {
        convertedErrors[key] = Array.isArray(value) ? value[0] : value
      })
      errors.value = convertedErrors
    } else if (err && typeof err === 'object' && 'response' in err) {
      // Handle API validation errors directly
      const axiosError = err as { response?: { data?: Record<string, unknown> } }
      const responseData = axiosError.response?.data

      console.log('📡 Form error response:', responseData)

      // Check for specific error codes
      if (responseData?.error_code === 'UNVERIFIED_ACCOUNT') {
        errors.value = {
          receiver_email:
            'Cannot send money to unverified account. Please ask the recipient to verify their email first.',
        }
      } else if (responseData?.error_code === 'INSUFFICIENT_BALANCE') {
        errors.value = {
          amount: 'Insufficient balance. Please check your account balance.',
        }
      } else if (responseData?.error_code === 'INVALID_RECEIVER') {
        errors.value = {
          receiver_email: 'Cannot send money to yourself.',
        }
      } else if (responseData?.errors) {
        errors.value = responseData.errors as Record<string, string>
      } else if (responseData?.message) {
        errors.value = { general: responseData.message as string }
      } else {
        errors.value = { general: 'Failed to send transaction' }
      }
    } else {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send transaction'
      errors.value = { general: errorMessage }
    }
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Load beneficiaries for dropdown
  await beneficiariesStore.fetchBeneficiaries()

  // Check for pre-filled beneficiary from query parameters (Quick Send)
  const urlParams = new URLSearchParams(window.location.search)
  const preFilledBeneficiary = urlParams.get('beneficiary')
  if (preFilledBeneficiary) {
    form.receiver_email = preFilledBeneficiary
  }

  // Check Pusher connection for real-time updates
  checkPusherConnection()
})

onUnmounted(() => {
  // Cleanup if needed
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
