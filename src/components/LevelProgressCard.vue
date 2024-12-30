<!-- src/components/LevelProgressCard.vue -->
<template>
  <div class="bg-blue-500 rounded-xl p-4 w-full shadow-card">
    <div class="max-w-[240px] mx-auto">
      <!-- SVG Container with proper aspect ratio -->
      <div class="relative">
        <svg class="w-full" viewBox="0 0 200 120">
          <!-- Background arc -->
          <path
            d="M20 100a80 80 0 0 1 160 0"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            stroke-width="12"
            stroke-linecap="round"
          />
          <!-- Progress arc -->
          <path
            d="M20 100a80 80 0 0 1 160 0"
            fill="none"
            stroke="white"
            stroke-width="12"
            stroke-linecap="round"
            stroke-dasharray="251.2"
            :stroke-dashoffset="progressOffset"
            class="transition-all duration-1000 ease-out"
          />
        </svg>

        <!-- Level and EXP text -->
        <div class="absolute inset-x-0 bottom-4 flex flex-col items-center justify-center text-white">
          <!-- Level Text -->
          <div class="flex items-baseline justify-center gap-1 mb-1">
            <span class="text-sm font-medium opacity-90">Lv</span>
            <span class="text-5xl font-bold">{{ level }}</span>
          </div>
          <!-- EXP Text -->
          <div class="text-sm opacity-90">
            {{ currentExp }}/{{ maxExp }} EXP
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  level: {
    type: Number,
    required: true
  },
  currentExp: {
    type: Number,
    required: true
  },
  maxExp: {
    type: Number,
    required: true
  }
});

const progressOffset = computed(() => {
  const progress = props.currentExp / props.maxExp;
  // 251.2 is the total length of the arc path
  return 251.2 * (1 - progress);
});
</script>
