<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
    <!-- Header -->
    <div class="flex items-center space-x-4 mb-8">
      <div
        class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center"
      >
        <BaseIcon name="user-plus" size="lg" color="white" />
      </div>
      <div>
        <h2 class="text-2xl font-bold gradient-text">
          {{ isEditing ? 'Edit Beneficiary' : 'Add New Beneficiary' }}
        </h2>
        <p class="text-sm text-gray-600">
          {{ isEditing ? 'Update beneficiary information' : 'Add a new beneficiary to your list' }}
        </p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Beneficiary Email -->
      <div>
        <BaseInput
          v-model="form.beneficiary_email"
          type="email"
          label="Beneficiary Email"
          placeholder="Enter beneficiary's email address"
          :error="errors.beneficiary_email"
          required
          :disabled="loading"
        />
      </div>

      <!-- Nickname -->
      <div>
        <BaseInput
          v-model="form.nickname"
          type="text"
          label="Nickname"
          placeholder="Enter a nickname for this beneficiary"
          :error="errors.nickname"
          required
          :disabled="loading"
        />
      </div>

      <!-- Notes -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"> Notes (Optional) </label>
        <textarea
          v-model="form.notes"
          rows="3"
          placeholder="Add any notes about this beneficiary..."
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          :class="{ 'border-red-300 focus:ring-red-500': errors.notes }"
          :disabled="loading"
        ></textarea>
        <p v-if="errors.notes" class="mt-1 text-sm text-red-600">{{ errors.notes }}</p>
      </div>

      <!-- Favorite Toggle -->
      <div class="flex items-center space-x-3">
        <input
          id="is_favorite"
          v-model="form.is_favorite"
          type="checkbox"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          :disabled="loading"
        />
        <label for="is_favorite" class="text-sm font-medium text-gray-700">
          Mark as favorite
        </label>
      </div>

      <!-- Error Messages -->
      <div v-if="errors.general" class="p-4 bg-red-50 border border-red-200 rounded-xl">
        <div class="flex items-center space-x-2">
          <BaseIcon name="exclamation-triangle" size="sm" color="danger" />
          <p class="text-sm text-red-600">{{ errors.general }}</p>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-xl">
        <div class="flex items-center space-x-2">
          <BaseIcon name="check-circle" size="sm" color="success" />
          <p class="text-sm text-green-600">{{ successMessage }}</p>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex items-center justify-end space-x-4 pt-6">
        <button
          type="button"
          @click="handleCancel"
          :disabled="loading"
          class="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl font-medium transition-all duration-200"
        >
          Cancel
        </button>

        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
        >
          <div
            v-if="loading"
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></div>
          <BaseIcon v-else :name="isEditing ? 'check' : 'plus'" size="sm" color="white" />
          <span>{{
            loading ? 'Processing...' : isEditing ? 'Update Beneficiary' : 'Add Beneficiary'
          }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useBeneficiariesStore } from '@/stores/beneficiaries'
import { useNotifications } from '@/composables/useNotifications'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import type { Beneficiary, BeneficiaryFormData } from '@/types'

// Props
interface Props {
  beneficiary?: Beneficiary
  isEditing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  beneficiary: undefined,
  isEditing: false,
})

// Emits
const emit = defineEmits<{
  success: []
  cancel: []
}>()

// Composables
const beneficiariesStore = useBeneficiariesStore()
const { success, error } = useNotifications()

// State
const loading = ref(false)
const errors = ref<Record<string, string>>({})
const successMessage = ref('')

const form = ref<BeneficiaryFormData>({
  beneficiary_email: '',
  nickname: '',
  notes: '',
  is_favorite: false,
})

// Computed
const isFormValid = computed(() => {
  return (
    form.value.beneficiary_email.trim() !== '' &&
    form.value.nickname.trim() !== '' &&
    form.value.beneficiary_email.includes('@')
  )
})

// Watch for beneficiary changes (for editing)
watch(
  () => props.beneficiary,
  (newBeneficiary) => {
    if (newBeneficiary && props.isEditing) {
      form.value = {
        beneficiary_email: newBeneficiary.beneficiary_user?.email || '',
        nickname: newBeneficiary.nickname,
        notes: newBeneficiary.notes || '',
        is_favorite: newBeneficiary.is_favorite,
      }
    }
  },
  { immediate: true },
)

// Methods
const handleSubmit = async () => {
  if (!isFormValid.value) {
    return
  }

  try {
    loading.value = true
    errors.value = {}
    successMessage.value = ''

    if (props.isEditing && props.beneficiary) {
      // Update existing beneficiary
      await beneficiariesStore.updateBeneficiary(props.beneficiary.id, form.value)
      successMessage.value = 'Beneficiary updated successfully!'
      success('Success', 'Beneficiary updated successfully')
    } else {
      // Create new beneficiary
      await beneficiariesStore.createBeneficiary(form.value)
      successMessage.value = 'Beneficiary added successfully!'
      success('Success', 'Beneficiary added successfully')
    }

    // Clear form
    form.value = {
      beneficiary_email: '',
      nickname: '',
      notes: '',
      is_favorite: false,
    }

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)

    // Emit success event
    emit('success')
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'errors' in err) {
      errors.value = err.errors as Record<string, string>
    } else {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save beneficiary'
      errors.value = { general: errorMessage }
      error('Error', errorMessage)
    }
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  // Reset form
  form.value = {
    beneficiary_email: '',
    nickname: '',
    notes: '',
    is_favorite: false,
  }
  errors.value = {}
  successMessage.value = ''

  emit('cancel')
}
</script>
