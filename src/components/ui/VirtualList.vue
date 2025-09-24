<!--
  VirtualList Component

  High-performance virtual scrolling list component

  @author Fahed
-->

<template>
  <div
    ref="containerRef"
    class="virtual-list-container"
    :style="{ height: containerHeight + 'px' }"
    @scroll="handleScroll"
  >
    <!-- Spacer for items above visible area -->
    <div :style="{ height: offsetY + 'px' }"></div>

    <!-- Visible items -->
    <div
      v-for="(item, index) in visibleItems"
      :key="getItemKey(item, startIndex + index)"
      class="virtual-list-item"
      :style="{ height: itemHeight + 'px' }"
    >
      <slot :item="item" :index="startIndex + index" :isVisible="true" />
    </div>

    <!-- Spacer for items below visible area -->
    <div :style="{ height: (totalItems - endIndex) * itemHeight + 'px' }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  items: any[]
  itemHeight: number
  containerHeight: number
  overscan?: number // Number of items to render outside visible area
  getItemKey?: (item: any, index: number) => string | number
}

const props = withDefaults(defineProps<Props>(), {
  overscan: 5,
  getItemKey: (item: any, index: number) => index,
})

const containerRef = ref<HTMLElement | null>(null)
const scrollTop = ref(0)

// Computed properties
const totalItems = computed(() => props.items.length)
const totalHeight = computed(() => totalItems.value * props.itemHeight)

const startIndex = computed(() => {
  const index = Math.floor(scrollTop.value / props.itemHeight)
  return Math.max(0, index - props.overscan)
})

const endIndex = computed(() => {
  const visibleCount = Math.ceil(props.containerHeight / props.itemHeight)
  const index = startIndex.value + visibleCount + props.overscan * 2
  return Math.min(totalItems.value, index)
})

const visibleItems = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value)
})

const offsetY = computed(() => {
  return startIndex.value * props.itemHeight
})

// Event handlers
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop
}

// Methods
const scrollToIndex = (index: number) => {
  if (containerRef.value) {
    const scrollTop = index * props.itemHeight
    containerRef.value.scrollTop = scrollTop
  }
}

const scrollToTop = () => {
  scrollToIndex(0)
}

const scrollToBottom = () => {
  scrollToIndex(totalItems.value - 1)
}

// Expose methods
defineExpose({
  scrollToIndex,
  scrollToTop,
  scrollToBottom,
  scrollTop: computed(() => scrollTop.value),
  totalHeight,
  visibleItems,
})
</script>

<style scoped>
.virtual-list-container {
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.virtual-list-item {
  position: relative;
  contain: layout style;
}

/* Optimize for mobile */
@media (max-width: 768px) {
  .virtual-list-container {
    -webkit-overflow-scrolling: touch;
  }
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  .virtual-list-container {
    scroll-behavior: auto;
  }
}
</style>
