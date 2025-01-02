<template>
  <div class="bg-card rounded-2xl p-4 shadow-card space-y-2x">
    <div class="flex justify-between items-center">
      <h1 class="text-left text-primary text-xl font-bold">Next Milestone</h1>
      <p class="text-left text-primary text-2xl font-bold">{{ days }}<span class="pl-1 text-sm text-secondary font-normal">Days</span></p>
    </div>
      
    <div class="relative h-3 bg-secondary rounded-full overflow-hidden">
      <div
        :class="color"
        class="absolute h-full left-0 top-0 rounded-full"
        :style="{ width: `${percent}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    default: 'bg-blue-500'
  },
  days: {
    type: Number,
    default: 30
  },
  percent: {
    type: Number,
    default: 60
  },
});
</script>
