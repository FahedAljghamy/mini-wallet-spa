<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center space-x-4">
        <div
          class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
        >
          <BaseIcon name="users" size="lg" color="white" />
        </div>
        <div>
          <h2 class="text-2xl font-bold gradient-text">My Beneficiaries</h2>
          <p class="text-sm text-gray-600">{{ beneficiaries.length }} beneficiaries in your list</p>
        </div>
      </div>

      <button
        @click="$emit('add-beneficiary')"
        class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
      >
        <BaseIcon name="plus" size="sm" color="white" />
        <span>Add New</span>
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <!-- Search Input -->
      <div class="flex-1">
        <BaseInput
          v-model="searchQuery"
          type="text"
          placeholder="Search beneficiaries..."
          :prefix-icon="'search'"
          class="w-full"
        />
      </div>

      <!-- Favorites Filter -->
      <button
        @click="toggleFavoritesFilter"
        class="px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
        :class="
          favoritesOnly
            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        "
      >
        <BaseIcon name="star" size="sm" :fill="favoritesOnly ? 'currentColor' : 'none'" />
        <span>{{ favoritesOnly ? 'Favorites Only' : 'All Beneficiaries' }}</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
      ></div>
      <p class="text-sm text-gray-600">Loading beneficiaries...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredBeneficiaries.length === 0" class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <BaseIcon name="users" size="xl" color="gray" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        {{ searchQuery ? 'No beneficiaries found' : 'No beneficiaries yet' }}
      </h3>
      <p class="text-sm text-gray-600 mb-6">
        {{
          searchQuery
            ? 'Try adjusting your search criteria'
            : 'Start by adding your first beneficiary to make sending money easier'
        }}
      </p>
      <button
        v-if="!searchQuery"
        @click="$emit('add-beneficiary')"
        class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
      >
        <BaseIcon name="plus" size="sm" color="white" />
        <span>Add Your First Beneficiary</span>
      </button>
    </div>

    <!-- Beneficiaries Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BeneficiaryCard
        v-for="beneficiary in filteredBeneficiaries"
        :key="beneficiary.id"
        :beneficiary="beneficiary"
        @edit="$emit('edit-beneficiary', beneficiary)"
        @quick-send="$emit('quick-send', beneficiary)"
      />
    </div>

    <!-- Load More Button (if pagination is needed) -->
    <div
      v-if="filteredBeneficiaries.length > 0 && filteredBeneficiaries.length % 20 === 0"
      class="text-center mt-8"
    >
      <button
        @click="$emit('load-more')"
        class="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200"
      >
        Load More Beneficiaries
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useBeneficiariesStore } from '@/stores/beneficiaries'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import BeneficiaryCard from './BeneficiaryCard.vue'
import type { Beneficiary } from '@/types'

// Emits
defineEmits<{
  'add-beneficiary': []
  'edit-beneficiary': [beneficiary: Beneficiary]
  'quick-send': [beneficiary: Beneficiary]
  'load-more': []
}>()

// Composables
const beneficiariesStore = useBeneficiariesStore()

// State
const searchQuery = ref('')

// Computed
const beneficiaries = computed(() => {
  console.log('🔄 Beneficiaries computed:', beneficiariesStore.beneficiaries)
  return beneficiariesStore.beneficiaries
})
const loading = computed(() => {
  console.log('🔄 Loading computed:', beneficiariesStore.loading)
  return beneficiariesStore.loading
})
const filteredBeneficiaries = computed(() => {
  console.log('🔄 Filtered beneficiaries computed:', beneficiariesStore.filteredBeneficiaries)
  return beneficiariesStore.filteredBeneficiaries
})
const favoritesOnly = computed(() => beneficiariesStore.favoritesOnly)

// Methods
const toggleFavoritesFilter = () => {
  beneficiariesStore.setFavoritesOnly(!favoritesOnly.value)
}

// Watch for search query changes
watch(searchQuery, (newQuery) => {
  beneficiariesStore.setSearchQuery(newQuery)
})

// Lifecycle
onMounted(() => {
  console.log('🚀 BeneficiaryList mounted - fetching beneficiaries...')
  beneficiariesStore.fetchBeneficiaries()
})
</script>
