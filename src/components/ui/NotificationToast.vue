<!--
  NotificationToast - Toast Notification Component

  Reusable toast notification component for displaying messages

  @author Fahed
-->

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="notification"
      :class="toastClasses"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <!-- Icon -->
      <div class="flex-shrink-0">
        <BaseIcon :name="iconName" size="md" :color="iconColor" />
      </div>

      <!-- Content -->
      <div class="ml-3 w-0 flex-1">
        <p class="text-sm font-medium text-gray-900">
          {{ notification.title }}
        </p>
        <p class="mt-1 text-sm text-gray-500">
          {{ notification.message }}
        </p>
      </div>

      <!-- Close Button -->
      <div class="ml-4 flex-shrink-0 flex">
        <button
          @click="$emit('close')"
          class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <span class="sr-only">Close</span>
          <BaseIcon name="close" size="sm" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NotificationMessage } from '../../types'
import BaseIcon from './BaseIcon.vue'

interface Props {
  notification: NotificationMessage
}

const props = defineProps<Props>()

defineEmits<{
  close: []
}>()

// Computed
const toastClasses = computed(() => {
  const baseClasses = [
    'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
  ]

  const variantClasses = {
    success: 'border-l-4 border-green-400',
    error: 'border-l-4 border-red-400',
    warning: 'border-l-4 border-yellow-400',
    info: 'border-l-4 border-blue-400',
  }

  return [...baseClasses, variantClasses[props.notification.type]]
})

const iconName = computed(() => {
  const icons = {
    success: 'check-circle',
    error: 'x-circle',
    warning: 'exclamation-triangle',
    info: 'information-circle',
  }
  return icons[props.notification.type]
})

const iconColor = computed(
  (): 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'gray' | 'white' => {
    const colors = {
      success: 'success' as const,
      error: 'danger' as const,
      warning: 'warning' as const,
      info: 'primary' as const,
    }
    return colors[props.notification.type]
  },
)
</script>
