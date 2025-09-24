<!--
  NotificationContainer - Toast Notification Container

  Container component for managing and displaying toast notifications

  @author Fahed
-->

<template>
  <!-- Toast Container -->
  <div
    aria-live="assertive"
    class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
  >
    <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
      <NotificationToast
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
        @close="removeNotification(notification.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNotifications } from '../../composables/useNotifications'
import NotificationToast from './NotificationToast.vue'

// Composables
const { notifications, removeNotification } = useNotifications()
</script>
