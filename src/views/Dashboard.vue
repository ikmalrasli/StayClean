<!-- src/views/Dashboard.vue -->
<template>
  <div class="flex flex-col h-dvh text-primary">
    <!-- Title Bar -->
    <Titlebar :title="pageTitles[currentPage]" @toggleTheme="toggleTheme" />

    <!-- Content -->
    <main class="flex-grow p-4 overflow-y-auto relative" style="scrollbar-width: none;">
      <component :is="currentPage" />
    </main>

    <!-- Navbar -->
    <Navbar :currentPage="currentPage" @navigate="navigate" />
  </div>
</template>

<script>
import Titlebar from '../components/Titlebar.vue';
import Navbar from '../components/Navbar.vue';
import Home from './pages/Home.vue';
import Stats from './pages/Stats.vue';
import Settings from './pages/Settings.vue';
import History from './pages/History.vue';
import { EventBus } from '../eventBus';

export default {
  components: { Titlebar, Navbar, Home, Stats, Settings, History },
  data() {
    return {
      currentPage: 'home', // Default page
      pageTitles: {
        home: 'Home',
        stats: 'Stats',
        settings: 'Settings',
        history: 'History',
      },
    };
  },
  mounted() {
    // Load saved theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.add(savedTheme);

    // Listen for navigate events from EventBus
    EventBus.on('navigateHistory', () => {
      this.currentPage = 'history';
    });
    EventBus.on('navigateStats', () => {
      this.currentPage = 'stats';
    });
  },
  methods: {
    navigate(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style scoped>
main {
  z-index: 1;
}
</style>

