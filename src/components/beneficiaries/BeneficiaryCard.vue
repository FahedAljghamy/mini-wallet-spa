<template>
  <div
    class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
  >
    <!-- Header with Avatar and Actions -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-4">
        <!-- Avatar -->
        <div
          class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg"
        >
          {{ beneficiaryInitials }}
        </div>

        <!-- User Info -->
        <div class="min-w-0 flex-1">
          <h3
            class="text-lg font-semibold text-gray-900 name-truncate"
            :title="beneficiary.nickname"
          >
            {{ beneficiary.nickname }}
          </h3>
          <p
            class="text-sm text-gray-600 email-truncate"
            :title="beneficiary.beneficiary_user?.name"
          >
            {{ beneficiary.beneficiary_user?.name || 'Unknown' }}
          </p>
          <p
            class="text-xs text-gray-500 email-truncate"
            :title="beneficiary.beneficiary_user?.email"
          >
            {{ beneficiary.beneficiary_user?.email || 'No email' }}
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-2">
        <!-- Favorite Toggle -->
        <button
          @click="handleToggleFavorite"
          :disabled="loading"
          class="p-2 rounded-full transition-colors duration-200"
          :class="
            beneficiary.is_favorite
              ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50'
              : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
          "
        >
          <BaseIcon
            :name="beneficiary.is_favorite ? 'star' : 'star'"
            size="sm"
            :fill="beneficiary.is_favorite ? 'currentColor' : 'none'"
            :stroke="beneficiary.is_favorite ? 'none' : 'currentColor'"
          />
        </button>

        <!-- Edit Button -->
        <button
          @click="$emit('edit', beneficiary)"
          class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors duration-200"
        >
          <BaseIcon name="pencil" size="sm" />
        </button>

        <!-- Delete Button -->
        <button
          @click="handleDelete"
          :disabled="loading"
          class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
        >
          <BaseIcon name="trash" size="sm" />
        </button>
      </div>
    </div>

    <!-- Notes -->
    <div v-if="beneficiary.notes" class="mb-4">
      <p class="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
        {{ beneficiary.notes }}
      </p>
    </div>

    <!-- Footer with Date and Quick Actions -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
      <div class="text-xs text-gray-500">Added {{ formattedDate }}</div>

      <div class="flex items-center space-x-2">
        <!-- Quick Send Button -->
        <button
          @click="$emit('quick-send', beneficiary)"
          class="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-1"
        >
          <BaseIcon name="paper-airplane" size="xs" />
          <span>Send</span>
        </button>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center"
    >
      <div
        class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBeneficiariesStore } from '@/stores/beneficiaries'
import { useNotifications } from '@/composables/useNotifications'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import type { Beneficiary } from '@/types'

// Props
interface Props {
  beneficiary: Beneficiary
}

const props = defineProps<Props>()

// Emits
defineEmits<{
  edit: [beneficiary: Beneficiary]
  'quick-send': [beneficiary: Beneficiary]
}>()

// Composables
const beneficiariesStore = useBeneficiariesStore()
const { success, error } = useNotifications()

// State
const loading = ref(false)

// Computed
const beneficiaryInitials = computed(() => {
  const beneficiaryUser = props.beneficiary?.beneficiary_user
  if (!beneficiaryUser?.name) return 'B'
  const name = beneficiaryUser.name.trim()
  if (name.length === 0) return 'B'
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const formattedDate = computed(() => {
  const date = new Date(props.beneficiary.created_at)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
})

// Methods
const handleToggleFavorite = async () => {
  try {
    loading.value = true
    await beneficiariesStore.toggleFavorite(props.beneficiary.id)
    success(
      'Success',
      props.beneficiary.is_favorite ? 'Removed from favorites' : 'Added to favorites',
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to update favorite status'
    error('Error', errorMessage)
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!confirm(`Are you sure you want to delete ${props.beneficiary.nickname}?`)) {
    return
  }

  try {
    loading.value = true
    await beneficiariesStore.deleteBeneficiary(props.beneficiary.id)
    success('Success', 'Beneficiary deleted successfully')
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to delete beneficiary'
    error('Error', errorMessage)
  } finally {
    loading.value = false
  }
}
</script>
