<!-- src/views/pages/Home.vue -->
<template>
  <div class="flex flex-col space-y-2">
    <!-- Habit Info -->
    <div class="text-left px-2">
      <h1 class="text-xl font-bold text-primary">{{ habit?.name || 'No Habit' }}</h1>
      <h2 class="text-sm text-secondary">Started on {{ formattedStartDate }}</h2>
    </div>

    <!-- Level Component -->
    <LevelProgressCard
      :level="habit?.xpLevel"
      :current-exp="habit?.currentExp"
      :max-exp="habit?.maxExp"
    />

    <!-- Streak Component -->
    <Streak :streakStart="habit?.dateStart" />

    <!-- Battle Component -->
    <div class="bg-card p-4 rounded-2xl shadow-card">
      <h3 class="text-left text-lg font-bold text-primary mb-2">Battles</h3>
      <p class="text-3xl font-bold text-primary">{{ habit?.battlesWon }} <span class="font-normal text-lg text-secondary">won</span></p>
    </div>

    <!-- Battle Button -->
    <button
    class="absolute bottom-0 right-4 bg-blue-500 hover:bg-blue-700 text-white h-16 w-16 rounded-full shadow-card"
    @click="battleBtn">
    <i class="fa-solid fa-fist-raised"></i>
  </button>
  </div>
</template>

<script>
import Streak from '../../components/StreakCard.vue';
import LevelProgressCard from '../../components/LevelProgressCard.vue';
import db from '../../db';
import { addBattlesWon, gainExp } from '../../db';

export default {
  components: { 
    Streak,
    LevelProgressCard,
   },
  data() {
    return {
      habit: null,
    };
  },
  computed: {
    formattedStartDate() {
      if (this.habit?.dateStart) {
        const date = new Date(this.habit.dateStart);
        return new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).format(date);
      }
      return 'N/A';
    },
  },
  methods: {
    async battleBtn() {
      try {
        await addBattlesWon(); // Increment battles won
        const expGained = 20; // Award EXP for each battle
        const updatedHabit = await gainExp(expGained); // Gain EXP
        this.habit = updatedHabit; // Update local habit data
      } catch (error) {
        console.error('Failed to handle battle button click:', error);
      }
    },
  },
  async created() {
    try {
      const habit = await db.habit.get(1);
      this.habit = habit;
    } catch (error) {
      console.error('Error fetching habit:', error);
    }
  },
  watch: {
    'habit.xpLevel'(newLevel, oldLevel) {
      if (newLevel > oldLevel) {
        alert(`Congratulations! You leveled up to Level ${newLevel}!`);
        // Optionally trigger animations, confetti, etc.
      }
    },
  },
};
</script>
