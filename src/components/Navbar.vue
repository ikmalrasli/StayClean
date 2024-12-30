<!-- src/components/Navbar.vue -->
<template>
  <nav class="w-full flex items-center grid grid-cols-3 py-4">
    <!-- Home Button -->
    <button
      :class="buttonClasses('home')"
      @click="$emit('navigate', 'home')"
    >
      <i class="fa-solid fa-home text-xl"></i>
      <span class="text-sm">Home</span>
    </button>

    <!-- Stats Button -->
    <button
      :class="buttonClasses('stats')"
      @click="$emit('navigate', 'stats')"
    >
      <i class="fa-solid fa-pie-chart text-xl"></i>
      <span class="text-sm">Stats</span>
    </button>

    <!-- Settings Button -->
    <button
      :class="buttonClasses('settings')"
      @click="$emit('navigate', 'settings')"
    >
      <i class="fa-solid fa-cog text-xl"></i>
      <span class="text-sm">Settings</span>
    </button>
  </nav>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: String,
      required: true,
    },
  },
  methods: {
    buttonClasses(page) {
      return [
        'py-1 flex flex-col items-center transition-colors duration-300',
        this.currentPage === page ? 'text-blue-500' : 'text-secondary',
      ].join(' ');
    },
  },
};
</script>

<style scoped>
nav {
  z-index: 20;
}
</style>