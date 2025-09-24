<!--
  App.vue - Main Application Component

  Mini Wallet SPA - Vue 3 application for wallet management

  @author Fahed
-->

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NotificationContainer from './components/ui/NotificationContainer.vue'
</script>

<template>
  <div id="app">
    <!-- Main Content -->
    <RouterView />

    <!-- Global Notifications -->
    <NotificationContainer />
  </div>
</template>
