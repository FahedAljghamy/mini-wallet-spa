<!--
  Wallet Login - Digital Wallet Login

  Modern digital wallet login page with professional design

  @author Fahed
-->

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md">
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
          Mini Wallet
        </h1>
        <p class="text-xl text-gray-600 max-w-sm mx-auto leading-relaxed">
          Secure digital wallet for all your financial needs
        </p>
      </div>

      <!-- Login Card -->
      <div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p class="text-gray-600">Sign in to your account</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="login" class="space-y-6">
          <!-- Email Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div class="relative">
              <input
                v-model="email"
                type="email"
                required
                class="w-full px-4 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                placeholder="Enter your email"
                :disabled="loading"
              />
              <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
                <BaseIcon name="mail" size="md" color="gray" />
              </div>
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                placeholder="Enter your password"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-2xl transition-colors duration-200"
              >
                <BaseIcon :name="showPassword ? 'eye-slash' : 'eye'" size="md" color="gray" />
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <div
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"
              ></div>
              Signing in...
            </span>
            <span v-else class="flex items-center justify-center">
              <BaseIcon name="arrow-right" size="sm" color="white" class="mr-2" />
              Sign In
            </span>
          </button>
        </form>

        <!-- Messages -->
        <div
          v-if="message"
          class="mt-6 p-4 rounded-2xl"
          :class="
            messageType === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : messageType === 'error'
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-blue-50 border border-blue-200 text-blue-800'
          "
        >
          <div class="flex items-center">
            <BaseIcon
              :name="
                messageType === 'success'
                  ? 'check-circle'
                  : messageType === 'error'
                    ? 'exclamation-triangle'
                    : 'information-circle'
              "
              size="sm"
              :color="
                messageType === 'success'
                  ? 'success'
                  : messageType === 'error'
                    ? 'danger'
                    : 'primary'
              "
              class="mr-3"
            />
            <span class="text-sm font-medium">{{ message }}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8">
        <p class="text-sm text-gray-500">© 2025 Mini Wallet. All rights reserved.</p>
        <p class="text-xs text-gray-400 mt-1">Developed by Eng.Fahed</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useTransactionsStore } from '../stores/transactions'
import BaseIcon from '../components/ui/BaseIcon.vue'

const router = useRouter()
const { login: authLogin } = useAuth()
const transactionsStore = useTransactionsStore()

// State
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const message = ref('')
const messageType = ref('')

const login = async () => {
  if (!email.value || !password.value) {
    message.value = 'Please fill in all fields'
    messageType.value = 'error'
    return
  }

  try {
    loading.value = true
    message.value = 'Signing in...'
    messageType.value = 'info'

    // Use the useAuth login method
    const success = await authLogin({
      email: email.value,
      password: password.value,
    })

    if (success) {
      // Fetch user data from API
      await transactionsStore.fetchUserData()

      message.value = 'Login successful! Redirecting...'
      messageType.value = 'success'

      // Redirect after 1 second
      setTimeout(() => {
        router.push('/wallet-dashboard')
      }, 1000)
    } else {
      message.value = 'Login failed. Please check your credentials.'
      messageType.value = 'error'
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string; errors?: unknown } }
      }

      if (axiosError.response?.status === 401) {
        message.value = 'Invalid email or password'
      } else if (axiosError.response?.status === 422) {
        message.value = 'Please check your credentials and try again'
      } else {
        message.value = `Login failed: ${axiosError.response?.data?.message || 'Please try again'}`
      }
    } else {
      message.value = 'Login failed. Please try again.'
    }
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Check if user is already authenticated
  const token = localStorage.getItem('auth_token')
  if (token) {
    router.push('/wallet-dashboard')
  }
})
</script>
