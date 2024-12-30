<!-- src/components/StreakCard.vue -->
<template>
  <div class="bg-card rounded-2xl p-4 shadow-card">
    <!-- Title -->
    <h3 class="text-left text-primary text-xl font-bold mb-2">Streak</h3>

    <!-- Time Period Selector -->
    <div class="bg-secondary grid grid-cols-5 gap-1 p-1 rounded-lg mb-6 flex">
      <button
        v-for="view in views"
        :key="view"
        @click="activeView = view"
        :class="[
          'py-1.5 rounded-md text-sm font-medium transition-colors duration-200',
          activeView === view 
            ? 'bg-active text-primary shadow-sm' 
            : 'text-secondary hover:text-primary'
        ]"
      >
        {{ view }}
      </button>
    </div>

    <!-- Streak Data -->
    <div class="grid gap-4 text-center"
    :class="activeView === 'Hours' ? 'grid-cols-3' : 'grid-cols-4'">
      <div 
        v-for="(value, label) in displayedStreakData" 
        :key="label"
        class="text-center"
      >
        <span class="block text-3xl font-bold text-primary mb-1">{{ value }}</span>
        <span class="text-secondary text-sm">{{ label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    streakStart: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      views: ['Hours', 'Days', 'Weeks', 'Months', 'Years'], // Available views
      activeView: 'Hours', // Default view
      currentTime: Date.now(), // To trigger updates
    };
  },
  computed: {
    displayedStreakData() {
      const startDate = new Date(this.streakStart);
      const now = new Date(this.currentTime); // Use the current time
      const difference = Math.max(now - startDate, 0); // Difference in milliseconds

      const seconds = Math.floor(difference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30.44); // Approximation
      const years = Math.floor(days / 365.25); // Approximation

      // Hierarchical breakdowns for each view
      switch (this.activeView) {
        case 'Years':
          return {
            Years: years,
            Months: Math.floor((days % 365.25) / 30.44),
            Days: Math.floor((days % 365.25) % 30.44),
            Hours: hours % 24,
          };
        case 'Months':
          return {
            Months: months,
            Days: Math.floor(days % 30.44),
            Hours: hours % 24,
            Minutes: minutes % 60,
          };
        case 'Weeks':
          return {
            Weeks: weeks,
            Days: days % 7,
            Hours: hours % 24,
            Minutes: minutes % 60,
          };
        case 'Days':
          return {
            Days: days,
            Hours: hours % 24,
            Minutes: minutes % 60,
            Seconds: seconds % 60,
          };
        case 'Hours':
          return {
            Hours: hours,
            Minutes: minutes % 60,
            Seconds: seconds % 60,
          };
        default:
          return {};
      }
    },
  },
  mounted() {
    // Update `currentTime` every second
    this.interval = setInterval(() => {
      this.currentTime = Date.now();
    }, 1000);
  },
  beforeUnmount() {
    // Clear the interval when the component is destroyed
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
};
</script>

<style scoped>
/* Add additional styles for responsiveness and hover effects */
button {
  transition: background-color 0.2s;
}
</style>
