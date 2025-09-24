<!--
  AppHeader - Application Header Component

  Reusable header component with logo, navigation, and user info

  @author Fahed
-->

<template>
  <header class="bg-white/80 backdrop-blur-md border-b border-primary-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo Section -->
        <div class="flex items-center space-x-3">
          <router-link to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <BaseIcon name="wallet" size="lg" color="white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">{{ APP_CONFIG.NAME }}</h1>
              <p class="text-xs text-gray-500">{{ APP_CONFIG.DESCRIPTION }}</p>
            </div>
          </router-link>
        </div>

        <!-- Navigation (Desktop) -->
        <nav v-if="showNavigation" class="hidden md:flex items-center space-x-8">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200"
            :class="{ 'text-primary-600': $route.path === item.path }"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <!-- User Section -->
        <div v-if="isAuthenticated" class="flex items-center space-x-4">
          <!-- User Info -->
          <div class="flex items-center space-x-3">
            <!-- User Name -->
            <div class="hidden sm:block text-right min-w-0">
              <p
                class="text-sm font-semibold text-gray-900 name-truncate"
                :title="currentUser?.name || 'Loading...'"
              >
                {{ currentUser?.name || 'Loading...' }}
              </p>
            </div>

            <!-- User Avatar -->
            <div
              class="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
            >
              <BaseIcon
                v-if="userLoading"
                name="user"
                size="sm"
                color="white"
                class="animate-pulse"
              />
              <span v-else class="text-white font-bold text-sm">
                {{ userInitials }}
              </span>
            </div>
          </div>

          <!-- Logout Button -->
          <button
            @click="handleLogout"
            class="hidden sm:flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
            title="Logout"
          >
            <BaseIcon name="logout" size="sm" color="gray" />
            <span class="text-sm font-medium">Logout</span>
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <button
          v-if="showNavigation"
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
        >
          <BaseIcon name="menu" size="md" color="gray" />
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 py-4">
        <nav class="flex flex-col space-y-2">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            @click="closeMobileMenu"
            class="px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            :class="{ 'text-primary-600 bg-primary-50': $route.path === item.path }"
          >
            {{ item.label }}
          </router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuth } from '../../composables/useAuth'
import { useTransactionsStore } from '../../stores/transactions'
import { APP_CONFIG, ROUTES } from '../../constants'
import BaseIcon from '../ui/BaseIcon.vue'

interface Props {
  showNavigation?: boolean
  title?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  showNavigation: true,
  title: undefined,
  subtitle: undefined,
})

const emit = defineEmits<{
  logout: []
}>()

// Dependencies
const { user: authUser, isAuthenticated, logout } = useAuth()
const transactionsStore = useTransactionsStore()
const { userLoading } = storeToRefs(transactionsStore)

// Use user data from transactions store (more up-to-date)
const currentUser = computed(() => transactionsStore.user || authUser.value)
const userInitials = computed(() => {
  if (!currentUser.value?.name) return 'U'
  // Handle Arabic names properly
  const name = currentUser.value.name.trim()
  if (name.length === 0) return 'U'

  // Get first character of first word
  const firstChar = name.charAt(0)
  return firstChar.toUpperCase()
})

// State
const showMobileMenu = ref(false)

// Computed
const navigationItems = computed(() => [
  { path: ROUTES.DASHBOARD, label: 'Dashboard' },
  { path: ROUTES.TRANSACTIONS, label: 'Transactions' },
  { path: ROUTES.BENEFICIARIES, label: 'Beneficiaries' },
  { path: ROUTES.ABOUT, label: 'About' },
])

// Methods
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const handleLogout = async () => {
  emit('logout')
  await logout()
}

// Lifecycle
onMounted(async () => {
  // Load user data if authenticated but user data is not available
  if (isAuthenticated.value && !currentUser.value) {
    await transactionsStore.fetchUserData()
  }
})
</script>
