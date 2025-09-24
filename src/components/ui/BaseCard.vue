<!--
  BaseCard - Reusable Card Component

  Professional card component with customizable styling

  @author Fahed
-->

<template>
  <div :class="cardClasses">
    <!-- Card Header -->
    <div v-if="title || subtitle || $slots.header" class="flex items-center justify-between mb-6">
      <div>
        <h3 v-if="title" class="card-title mb-2 text-truncate">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="card-subtitle text-truncate">
          {{ subtitle }}
        </p>
        <slot name="header" />
      </div>
      <div v-if="$slots.headerActions">
        <slot name="headerActions" />
      </div>
    </div>

    <!-- Card Content -->
    <div :class="contentClasses">
      <slot />
    </div>

    <!-- Card Footer -->
    <div v-if="$slots.footer" class="mt-6 pt-6 border-t border-gray-200">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  padding?: 'sm' | 'md' | 'lg'
  shadow?: boolean
  variant?: 'default' | 'elevated' | 'glass'
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  shadow: true,
  variant: 'default',
  rounded: '3xl',
})

// Computed Classes
const cardClasses = computed(() => {
  const baseClasses = ['transition-all', 'duration-300']

  // Rounded classes
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  }

  // Variant classes
  const variantClasses = {
    default: ['bg-white', 'border', 'border-gray-200'],
    elevated: ['bg-white', 'border', 'border-white/20', 'shadow-elevated'],
    glass: ['bg-white/70', 'backdrop-blur-sm', 'border', 'border-white/20'],
  }

  // Shadow classes
  const shadowClasses = props.shadow ? ['shadow-card'] : []

  // Hover effect
  const hoverClasses = ['hover:shadow-card-hover']

  return [
    ...baseClasses,
    roundedClasses[props.rounded],
    ...variantClasses[props.variant],
    ...shadowClasses,
    ...hoverClasses,
  ]
})

const contentClasses = computed(() => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return paddingClasses[props.padding]
})
</script>
