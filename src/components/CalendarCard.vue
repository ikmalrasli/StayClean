<!-- src/components/Calendar.vue -->
<template>
  <div class="bg-card rounded-2xl p-4 shadow-card">
    <!-- Calendar Header -->
    <div class="flex justify-between items-center px-2 mb-2">
      <h3 class="text-left text-primary text-xl font-bold">Calendar</h3>
      <select v-model="dateRange" class="bg-secondary px-2 py-1 rounded-lg">
        <option value="Month">Month</option>
        <option value="Year">Year</option>
      </select>
    </div>
    <div class="flex justify-between items-center mb-4">
      <button @click="changeMonth(-1)">
        <i class="fa-solid fa-chevron-left text-secondary"></i>
      </button>
      <span class="font-bold text-lg">{{ currentMonthName }} {{ currentYear }}</span>
      <button @click="changeMonth(1)">
        <i class="fa-solid fa-chevron-right text-secondary"></i>
      </button>
    </div>

    <!-- Calendar Grid -->
    <div class="w-full overflow-x-auto">
      <div class="flex justify-center">
        <!-- Days of the month -->
        <div class="grid grid-cols-7">
          <div class="flex text-sm font-bold text-secondary justify-center" v-for="(day, index) in daysOfWeek" :key="index">
            {{ day }}
          </div>
          <div
            v-for="(day, index) in calendarGrid"
            :key="index"
            class="w-8 h-8 m-1 rounded-lg bg-secondary text-secondary text-xs relative day"
            :class="getDayClass(day.level)"
            :title="`Date: ${day.date}, Level: ${day.level}`"
            @click="showDate = !showDate"
          >
            <transition name="fade">
              <span v-if="day.date && showDate" class="absolute bottom-1 left-1">
                {{ Number(day.date.split('-')[2]) }}
              </span>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Footer -->
    <div class="flex justify-between mt-4 text-secondary text-xs px-2">
      <span class="ml-1">No. of battles</span>
      <div class="flex items-center flex-row">
        <span class="mr-1">Less</span>
        <div class="flex space-x-0.5">
          <div class="day bg-secondary w-4 h-4 rounded-md"></div>
          <div class="day level-1 w-4 h-4 rounded-md"></div>
          <div class="day level-2 w-4 h-4 rounded-md"></div>
          <div class="day level-3 w-4 h-4 rounded-md"></div>
          <div class="day level-4 w-4 h-4 rounded-md"></div>
        </div>
        <span class="ml-1">More</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    activityData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dateRange: "Month",
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(), // 0 = January, 11 = December
      daysOfWeek: ["S", "M", "T", "W", "T", "F", "S"],
      showDate: false
    };
  },
  computed: {
    currentMonthName() {
      return new Date(this.currentYear, this.currentMonth).toLocaleString(
        "en-US",
        { month: "long" }
      );
    },
    calendarGrid() {
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate(); // Number of days in the current month
      const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay(); // Day of the week for the 1st day
      const grid = [];

      // Fill leading empty days (empty slots for the previous month)
      for (let i = 0; i < firstDayOfMonth; i++) {
        grid.push({ date: null, level: null });
      }

      // Fill actual days of the current month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(this.currentYear, this.currentMonth, day+1);
        const dateStr = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
        const activity = this.activityData.find((activity) => activity.date === dateStr);
        grid.push({
          date: dateStr,
          level: activity ? activity.level : 0, // Default level 0 if no activity
        });
      }

      // Fill trailing empty days (empty slots for the next month)
      const trailingDays = (7 - (grid.length % 7)) % 7; // Ensure the grid always has complete weeks
      for (let i = 0; i < trailingDays; i++) {
        grid.push({ date: null, level: null });
      }

      return grid;
    },
  },
  methods: {
    changeMonth(offset) {
      this.currentMonth += offset;

      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear -= 1;
      } else if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear += 1;
      }
    },
    getDayClass(level) {
      return level !== null ? `level-${level}` : "empty-day";
    },
  },
};
</script>

<style scoped>
.day {
  transition: background-color 0.3s;
}

.day.empty-day {
  background-color: transparent;
}

.light .day.level-1 {
  background-color: #93c5fd;
  color: #ffffff;
}

.light .day.level-2 {
  background-color: #3b82f6;
  color: #ffffff;
}

.light .day.level-3 {
  background-color: #1d4ed8;
  color: #ffffff;
}

.light .day.level-4 {
  background-color: #1e3a8a;
  color: #ffffff;
}

.dark .day.level-1 {
  background-color: #1e3a8a;
  color: #ffffff;
}

.dark .day.level-2 {
  background-color: #1d4ed8;
  color: #ffffff;
}

.dark .day.level-3 {
  background-color: #3b82f6;
  color: #ffffff;
}

.dark .day.level-4 {
  background-color: #93c5fd;
  color: #ffffff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
