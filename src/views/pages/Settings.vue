<template>
  <div class="space-y-4">
    <div class="bg-card text-primary shadow-card rounded-2xl flex flex-row items-center px-6 py-4">
      <div class="w-4 h-4 bg-blue-500 rounded-full mr-4"></div>
      <div class="flex-grow">
        <div class="flex items-center justify-between">
          <h1 class="text-left text-primary text-xl font-bold">{{ habit?.name }}</h1>
          <button>
            <i class="fa-solid fa-edit text-secondary"></i>
          </button>
        </div>
        <h2 class="text-left text-sm text-secondary">Started on {{ formattedStartDate(habit) }}</h2>
      </div>
    </div>
    <div class="bg-card text-primary shadow-card rounded-2xl">
      <div class="relative flex items-center justify-between px-6 py-4 rounded-2xl">
        <div class="flex items-center space-x-4">
          <div class="fa-solid fa-circle-half-stroke text-lg"></div>
          <span>Theme</span>
        </div>
        <!-- Toggle Dark/Light -->
        <div :class="isDark ? 'bg-blue-950' : 'bg-yellow-200'" @click="toggleTheme" class="w-14 transition-all duration-500 h-8 flex items-center rounded-full cursor-pointer">
          <div :class="{ 
            'translate-x-7': isDark, 
            'bg-blue-400': isDark, 
            'bg-yellow-400': !isDark 
          }" 
          class="w-7 h-7 transition-all duration-500 transform rounded-full shadow-md justify-center items-center flex">
            <i v-if="isDark" class="text-xs text-white fa-solid fa-moon"></i>
            <i v-else class="text-xs text-white fa-solid fa-sun"></i>
          </div>
        </div>
        <!-- Divider Line -->
        <div class="absolute bottom-0 left-12 right-0 h-px bg-secondary "></div>
      </div>
      <div
        v-for="(item, index) in items1"
        :key="index"
        class="relative flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-secondary cursor-pointer"
      >
        <div class="flex items-center space-x-4">
          <div :class="item.iconClass" class="text-lg"></div>
          <span>{{ item.label }}</span>
        </div>
        <i class="text-secondary fa-solid fa-chevron-right"></i>
        <!-- Divider Line -->
        <div
          v-if="index < items1.length - 1"
          class="absolute bottom-0 left-12 right-0 h-px bg-secondary "
        ></div>
      </div>
    </div>
    <div class="bg-card text-primary shadow-card rounded-2xl">
      <div
        v-for="(item, index) in items2"
        :key="index"
        class="relative flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-secondary cursor-pointer"
      >
        <div class="flex items-center space-x-4">
          <div :class="item.iconClass" class="text-lg"></div>
          <span>{{ item.label }}</span>
        </div>
        <i class="text-secondary fa-solid fa-chevron-right"></i>
        <!-- Divider Line -->
        <div
          v-if="index < items2.length - 1"
          class="absolute bottom-0 left-12 right-0 h-px bg-secondary "
        ></div>
      </div>
    </div>
    <button class="w-full bg-red-500 hover:bg-red-700 text-white font-medium p-4 rounded-2xl"
    @click="deleteBtn">Reset Habit</button>
  </div>
</template>

<script>
import db from '../../db';
import { deleteHabit } from '../../db';

export default {
  data() {
    return {
      habit: null,
      isDark: null,
      items1: [
        {
          label: "Set Rewards",
          iconClass: "fa-solid fa-circle-check text-green-400",
        },
        {
          label: "Set Penalties",
          iconClass: "fa-solid fa-circle-xmark text-red-400",
        },
      ],
      items2: [
        {
          label: "Tell a Friend",
          iconClass: "fa-solid fa-share-from-square",
        },
        {
          label: "Send a Feedback",
          iconClass: "fa-solid fa-envelope",
        },
        {
          label: "About Us",
          iconClass: "fa-solid fa-address-card",
        },
      ],
    };
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark;
      const html = document.documentElement;
      const newTheme = html.classList.contains('dark') ? 'light' : 'dark';

      // Toggle theme classes
      html.classList.remove('light', 'dark');
      html.classList.add(newTheme);

      // Save the theme in localStorage
      localStorage.setItem('theme', newTheme);
    },
    deleteBtn() {
      deleteHabit();
      this.$router.push('/onboarding/step1');
    },
    formattedStartDate(habit) {
      if (habit?.dateStart) {
        const date = new Date(habit.dateStart);
        return new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).format(date);
      }
      return 'N/A';
    },
  },
  async created() {
    try {
      const habit = await db.habit.get(1);
      this.habit = habit;
      const html = document.documentElement;
      this.isDark = html.classList.contains('dark');
    } catch (error) {
      console.error('Error fetching habit:', error);
    }
  },
}
</script>
