<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-6">
          <div
            class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center animate-float"
          >
            <BaseIcon name="users" size="xl" color="white" />
          </div>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold gradient-text mb-4">Manage Beneficiaries</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Keep track of your frequent recipients and make sending money faster and easier
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <!-- Total Beneficiaries -->
        <div
          class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Beneficiaries</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ statistics?.total_beneficiaries || 0 }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center"
            >
              <BaseIcon name="users" size="lg" color="white" />
            </div>
          </div>
        </div>

        <!-- Favorite Beneficiaries -->
        <div
          class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Favorites</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ statistics?.favorite_beneficiaries || 0 }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center"
            >
              <BaseIcon name="star" size="lg" color="white" fill="currentColor" />
            </div>
          </div>
        </div>

        <!-- Recent Beneficiaries -->
        <div
          class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Added This Month</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ statistics?.recent_beneficiaries || 0 }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center"
            >
              <BaseIcon name="clock" size="lg" color="white" />
            </div>
          </div>
        </div>

        <!-- Regular Beneficiaries -->
        <div
          class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Regular</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ statistics?.regular_beneficiaries || 0 }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center"
            >
              <BaseIcon name="user" size="lg" color="white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div
        class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden"
      >
        <!-- Tab Headers -->
        <div class="flex border-b border-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id as 'list' | 'add' | 'edit'"
            class="flex-1 px-6 py-4 text-center font-medium transition-all duration-200 relative"
            :class="
              activeTab === tab.id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            "
          >
            <div class="flex items-center justify-center space-x-2">
              <BaseIcon :name="tab.icon" size="sm" />
              <span>{{ tab.name }}</span>
            </div>
            <div
              v-if="activeTab === tab.id"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"
            ></div>
          </button>
        </div>

        <!-- Tab Content -->
        <div class="p-8">
          <!-- Beneficiaries List Tab -->
          <div v-if="activeTab === 'list'">
            <LazyBeneficiaryList
              @add-beneficiary="activeTab = 'add'"
              @edit-beneficiary="handleEditBeneficiary"
              @quick-send="handleQuickSend"
              @load-more="handleLoadMore"
            />
          </div>

          <!-- Add Beneficiary Tab -->
          <div v-else-if="activeTab === 'add'">
            <LazyBeneficiaryForm @success="handleFormSuccess" @cancel="activeTab = 'list'" />
          </div>

          <!-- Edit Beneficiary Tab -->
          <div v-else-if="activeTab === 'edit' && editingBeneficiary">
            <LazyBeneficiaryForm
              :beneficiary="editingBeneficiary"
              :is-editing="true"
              @success="handleFormSuccess"
              @cancel="handleCancelEdit"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBeneficiariesStore } from '@/stores/beneficiaries'
import AppHeader from '@/components/layout/AppHeader.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import { LazyBeneficiaryList, LazyBeneficiaryForm } from '@/composables/useLazyStores'
import type { Beneficiary } from '@/types'

// Composables
const router = useRouter()
const beneficiariesStore = useBeneficiariesStore()

// State
const activeTab = ref<'list' | 'add' | 'edit'>('list')
const editingBeneficiary = ref<Beneficiary | null>(null)

// Tabs configuration
const tabs = [
  { id: 'list', name: 'All Beneficiaries', icon: 'users' },
  { id: 'add', name: 'Add New', icon: 'plus' },
]

// Computed
const statistics = computed(() => beneficiariesStore.statistics)

// Methods
const handleEditBeneficiary = (beneficiary: Beneficiary) => {
  editingBeneficiary.value = beneficiary
  activeTab.value = 'edit'
}

const handleCancelEdit = () => {
  editingBeneficiary.value = null
  activeTab.value = 'list'
}

const handleFormSuccess = () => {
  editingBeneficiary.value = null
  activeTab.value = 'list'
}

const handleQuickSend = (beneficiary: Beneficiary) => {
  // Navigate to transactions page with pre-filled beneficiary
  router.push({
    path: '/transactions',
    query: {
      beneficiary: beneficiary.beneficiary_user?.email || '',
      nickname: beneficiary.nickname,
    },
  })
}

const handleLoadMore = async () => {
  // Implement pagination if needed
  await beneficiariesStore.fetchBeneficiaries()
}

// Lifecycle
let refreshInterval: number | null = null

onMounted(async () => {
  console.log('🚀 BeneficiariesView mounted - fetching beneficiaries and statistics...')
  // Load beneficiaries and statistics
  await Promise.all([beneficiariesStore.fetchBeneficiaries(), beneficiariesStore.fetchStatistics()])

  // Set up periodic refresh (every 5 minutes)
  refreshInterval = setInterval(async () => {
    try {
      await beneficiariesStore.fetchBeneficiaries()
      await beneficiariesStore.fetchStatistics()
    } catch {
      // Silently handle errors
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
