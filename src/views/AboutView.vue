<!--
  AboutView - About Page

  Information about the Mini Wallet application

  @author Fahed
-->

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
    <!-- Header -->
    <AppHeader @logout="handleLogout" />

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BaseCard
        title="About Mini Wallet"
        subtitle="Digital Wallet Platform"
        variant="glass"
        class="mb-8"
      >
        <div class="prose prose-lg max-w-none">
          <p class="text-gray-600 mb-6">
            Mini Wallet is a modern digital wallet application that allows users to manage their
            finances, send and receive money, and track their transaction history in real-time.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Features -->
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Features</h3>
              <ul class="space-y-3">
                <li class="flex items-center">
                  <BaseIcon name="check-circle" size="sm" color="success" class="mr-3" />
                  <span class="text-gray-700">Secure money transfers</span>
                </li>
                <li class="flex items-center">
                  <BaseIcon name="check-circle" size="sm" color="success" class="mr-3" />
                  <span class="text-gray-700">Real-time transaction updates</span>
                </li>
                <li class="flex items-center">
                  <BaseIcon name="check-circle" size="sm" color="success" class="mr-3" />
                  <span class="text-gray-700">Transaction history tracking</span>
                </li>
                <li class="flex items-center">
                  <BaseIcon name="check-circle" size="sm" color="success" class="mr-3" />
                  <span class="text-gray-700">Professional dashboard</span>
                </li>
                <li class="flex items-center">
                  <BaseIcon name="check-circle" size="sm" color="success" class="mr-3" />
                  <span class="text-gray-700">Multiple currency support</span>
                </li>
              </ul>
            </div>

            <!-- Technology -->
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Technology</h3>
              <ul class="space-y-3">
                <li class="flex items-center">
                  <BaseIcon name="check-circle" size="sm" color="primary" class="mr-3" />
                  <span class="text-gray-700">Vue 3 with Composition API</span>
                </li>
                <li class="flex items-center">
                  <BaseIcon name="check-circle" size="sm" color="primary" class="mr-3" />
                  <span class="text-gray-700">Laravel 11 API backend</span>
                </li>
                <li class="flex items-center">
                  <BaseIcon name="check-circle" size="sm" color="primary" class="mr-3" />
                  <span class="text-gray-700">Real-time updates with Pusher</span>
                </li>
                <li class="flex items-center">
                  <BaseIcon name="check-circle" size="sm" color="primary" class="mr-3" />
                  <span class="text-gray-700">TailwindCSS for styling</span>
                </li>
                <li class="flex items-center">
                  <BaseIcon name="check-circle" size="sm" color="primary" class="mr-3" />
                  <span class="text-gray-700">Pinia for state management</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Author Info -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">Author</p>
                <p class="text-sm text-gray-500">Eng.Fahed</p>
              </div>
              <div class="flex items-center space-x-4">
                <BaseButton variant="primary" size="sm" @click="$router.push('/')">
                  Go to Dashboard
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </main>

    <!-- Notifications -->
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'

// Components
import AppHeader from '../components/layout/AppHeader.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseIcon from '../components/ui/BaseIcon.vue'
import NotificationContainer from '../components/ui/NotificationContainer.vue'

// Composables
const { logout } = useAuth()

// Methods
const handleLogout = async () => {
  await logout()
}
</script>

<!-- Icon Definitions -->
<script lang="ts">
const icons = {
  'check-circle': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
}
</script>
