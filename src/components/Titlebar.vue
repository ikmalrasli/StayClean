<!-- src/components/Titlebar.vue -->
<template>
  <header class="w-full min-h-14 py-2 px-4 flex items-center relative">
    <button v-if="title === 'History'"
    class="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-primary hover-card rounded-full"
    @click="toStats">
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    <h1 class="text-lg font-bold text-primary absolute left-1/2 transform -translate-x-1/2">
      {{ title }}
    </h1>
    <button v-if="title === 'Stats'"
    class="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg text-primary hover-card rounded-full"
    @click="toHistory">
      <i class="fa-solid fa-clock-rotate-left"></i>
    </button>
  </header>
</template>

<script>
import { EventBus } from '../eventBus';

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    toHistory(){
      EventBus.emit('navigateHistory');
    },
    toStats(){
      EventBus.emit('navigateStats');
    }
  }
};
</script>

<style scoped>
header {
  z-index: 20;
}
</style>
