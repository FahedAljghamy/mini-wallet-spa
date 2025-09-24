<!--
  BaseInput - Reusable Input Component

  Professional input component with validation and error states

  @author Fahed
-->

<template>
  <div class="space-y-2">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700"
      :class="{ 'text-red-600': error }"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Input Container -->
    <div class="relative">
      <!-- Prefix Icon -->
      <div
        v-if="$slots.prefix"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <slot name="prefix" />
      </div>

      <!-- Input Field -->
      <input
        :id="inputId"
        ref="inputRef"
        v-model="inputValue"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        :aria-describedby="error ? `${inputId}-error` : undefined"
        v-bind="$attrs"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Suffix Icon -->
      <div
        v-if="$slots.suffix"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <slot name="suffix" />
      </div>

      <!-- Password Toggle (for password inputs) -->
      <button
        v-if="type === 'password' && showPasswordToggle"
        type="button"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
        @click="togglePasswordVisibility"
      >
        <svg
          v-if="!showPassword"
          class="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <svg
          v-else
          class="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
          />
        </svg>
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" :id="`${inputId}-error`" class="flex items-center text-sm text-red-600">
      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      {{ error }}
    </div>

    <!-- Helper Text -->
    <p v-if="helperText && !error" class="text-sm text-gray-500">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, useSlots } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  disabled?: boolean
  error?: string
  required?: boolean
  label?: string
  helperText?: string
  showPasswordToggle?: boolean
  inputId?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  showPasswordToggle: true,
  inputId: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  input: [event: Event]
  blur: [event: Event]
  focus: [event: Event]
}>()

// Slots
const slots = useSlots()

// Refs
const inputRef = ref<HTMLInputElement>()
const showPassword = ref(false)

// Computed
const inputId = computed(() => props.inputId || `input-${Math.random().toString(36).substr(2, 9)}`)

const inputValue = computed({
  get: () => props.modelValue || '',
  set: (value) => emit('update:modelValue', value),
})

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const inputClasses = computed(() => {
  const baseClasses = [
    'block',
    'w-full',
    'px-4',
    'py-3',
    'border',
    'rounded-2xl',
    'shadow-sm',
    'transition-all',
    'duration-300',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-primary-500',
    'focus:border-transparent',
  ]

  // Padding adjustments for icons
  const paddingClasses = []
  if (props.type === 'password' && props.showPasswordToggle) {
    paddingClasses.push('pr-10')
  }
  if (slots.prefix) {
    paddingClasses.push('pl-10')
  }
  if (slots.suffix) {
    paddingClasses.push('pr-10')
  }

  // State classes
  const stateClasses = []
  if (props.error) {
    stateClasses.push('border-red-500', 'ring-2', 'ring-red-200')
  } else if (props.disabled) {
    stateClasses.push('bg-gray-50', 'text-gray-600', 'cursor-not-allowed')
  } else {
    stateClasses.push('bg-white/50', 'border-gray-200')
  }

  return [...baseClasses, ...paddingClasses, ...stateClasses]
})

// Methods
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const handleInput = (event: Event) => {
  emit('input', event)
}

const handleBlur = (event: Event) => {
  emit('blur', event)
}

const handleFocus = (event: Event) => {
  emit('focus', event)
}

// Expose methods for parent components
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select(),
})
</script>
