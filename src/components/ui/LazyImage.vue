<!--
  LazyImage Component

  Lazy loading image component with intersection observer

  @author Fahed
-->

<template>
  <div class="relative overflow-hidden" :style="{ width: width, height: height }">
    <!-- Loading Placeholder -->
    <div
      v-if="!loaded && !error"
      class="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
      :class="placeholderClass"
    >
      <BaseIcon v-if="showIcon" name="photo" size="lg" color="gray" />
    </div>

    <!-- Error State -->
    <div
      v-if="error"
      class="absolute inset-0 bg-red-50 flex items-center justify-center"
      :class="errorClass"
    >
      <BaseIcon name="exclamation-triangle" size="lg" color="danger" />
    </div>

    <!-- Actual Image -->
    <img
      v-show="loaded && !error"
      :src="src"
      :alt="alt"
      :class="imageClass"
      @load="handleLoad"
      @error="handleError"
      loading="lazy"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import BaseIcon from './BaseIcon.vue'

interface Props {
  src: string
  alt?: string
  width?: string
  height?: string
  placeholderClass?: string
  errorClass?: string
  imageClass?: string
  showIcon?: boolean
  rootMargin?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  width: '100%',
  height: '200px',
  placeholderClass: '',
  errorClass: '',
  imageClass: 'w-full h-full object-cover',
  showIcon: true,
  rootMargin: '50px',
})

const loaded = ref(false)
const error = ref(false)
const observer = ref<IntersectionObserver | null>(null)

const handleLoad = () => {
  loaded.value = true
  error.value = false
}

const handleError = () => {
  error.value = true
  loaded.value = false
}

onMounted(() => {
  // Create intersection observer for lazy loading
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Image is now visible, start loading
          const img = entry.target as HTMLImageElement
          if (img.src !== props.src) {
            img.src = props.src
          }
          observer.value?.unobserve(img)
        }
      })
    },
    {
      rootMargin: props.rootMargin,
    },
  )

  // Start observing when component mounts
  const img = document.querySelector('img')
  if (img) {
    observer.value.observe(img)
  }
})

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>
