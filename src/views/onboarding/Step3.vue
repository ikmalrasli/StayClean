<template>
  <div class="flex h-screen p-4 justify-center items-center">
    <!-- Habit Form -->
    <div class="bg-card shadow-card space-y-4 rounded-xl p-4">
      <div class="border rounded-lg p-4">
        <input 
          v-model="habitName"
          type="text"
          placeholder="e.g. No smoking"
          class="w-full bg-transparent text-lg placeholder-gray-500 focus:outline-none"
        />
      </div>

      <div class="flex items-center space-x-2">
        <span class="text-gray-400">Started on</span>
        <div class="flex space-x-2">
          <input 
            type="date"
            v-model="selectedDate"
            class="w-36 px-3 py-1 rounded-lg bg-secondary text-primary focus:outline-none cursor-pointer"
          />
          <input 
            type="time"
            v-model="selectedTime"
            class="px-3 py-1 rounded-lg bg-secondary text-primary focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-gray-400">Pick a color</span>
        <input 
          v-model="habitColor"
          type="color"
          class="w-8 h-8 rounded-full overflow-hidden"
        />
      </div>

      <div>
        <button
          @click="saveHabit"
          class="w-full py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="!habitName"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { setHabit } from '../../db';

export default {
  data() {
    const now = new Date();
    return {
      habitName: '',
      habitColor: '#3b82f6', // Default to pink/coral color
      selectedDate: now.toISOString().split('T')[0], // Current date
      selectedTime: now.toTimeString().slice(0, 5), // Current time (HH:mm)
    };
  },
  computed: {
    formattedDate() {
      const date = new Date(`${this.selectedDate}T${this.selectedTime}`);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    },
    formattedTime() {
      const date = new Date(`${this.selectedDate}T${this.selectedTime}`);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    },
    isValid() {
      return this.habitName.trim().length > 0;
    },
  },
  methods: {
    async saveHabit() {
      if (!this.isValid) return;

      try {
        const dateTime = new Date(`${this.selectedDate}T${this.selectedTime}`);
        await setHabit(this.habitName, dateTime.toISOString(), this.habitColor);
        this.$router.push('/');
      } catch (error) {
        console.error('Error creating habit:', error);
      }
    },
  },
};
</script>

<style scoped>
input[type="color"] {
  -webkit-appearance: none;
  border: none;
  padding: 0;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 50%;
}
</style>