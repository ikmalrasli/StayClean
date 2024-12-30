<!-- src/views/Dashboard.vue -->
<template>
  <div class="flex flex-col h-screen text-primary">
    <!-- Title Bar -->
    <Titlebar :title="pageTitles[currentPage]" @toggleTheme="toggleTheme" />

    <!-- Content -->
    <main class="flex-grow p-4 overflow-y-auto relative">
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

export default {
  components: { Titlebar, Navbar, Home, Stats, Settings },
  data() {
    return {
      currentPage: 'home', // Default page
      pageTitles: {
        home: 'Home',
        stats: 'Stats',
        settings: 'Settings',
      },
    };
  },
  mounted() {
    // Load saved theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.add(savedTheme);
  },
  methods: {
    navigate(page) {
      this.currentPage = page;
    },
    toggleTheme() {
      const html = document.documentElement;
      const newTheme = html.classList.contains('dark') ? 'light' : 'dark';

      // Toggle theme classes
      html.classList.remove('light', 'dark');
      html.classList.add(newTheme);

      // Save the theme in localStorage
      localStorage.setItem('theme', newTheme);
    },
  },
};
</script>

<style scoped>
main {
  z-index: 1;
}
</style>

