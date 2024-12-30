<!-- src/components/Titlebar.vue -->
<template>
  <header class="w-full py-2 px-4 flex items-center justify-end relative">
    <h1 class="text-lg font-bold text-primary absolute left-1/2 transform -translate-x-1/2">
      {{ title }}
    </h1>
    <button @click="$emit('toggleTheme')" class="text-primary hover-card rounded-full p-2">
      🌙
    </button>
  </header>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  emits: ['toggleTheme'], // Emit to toggle light/dark mode
};
</script>

<style scoped>
header {
  z-index: 20;
}
</style>
