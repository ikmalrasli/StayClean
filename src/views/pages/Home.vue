// src/views/pages/Home.vue
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
      <p class="text-3xl font-bold text-primary">{{ habit?.battles }} <span class="font-normal text-lg text-secondary">won</span></p>
    </div>

    <!-- Battle Button -->
    <button
      class="absolute bottom-0 right-4 bg-blue-500 hover:bg-blue-700 text-white h-16 w-16 rounded-full shadow-card"
      @click="gainExp">
      <i class="fa-solid fa-fist-raised"></i>
    </button>
  </div>
</template>

<script>
import Streak from '../../components/StreakCard.vue';
import LevelProgressCard from '../../components/LevelProgressCard.vue';
import db from '../../db';

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
    EXP_THRESHOLD(level) {
      return Math.floor(100 * Math.pow(1.2, level - 1));
    },
    async processDailyExp() {
      try {
        const habit = await db.habit.get(1);
        if (!habit || !habit.dateStart) return;

        const now = Date.now();
        const lastResetDate = new Date(habit.lastResetDate).toDateString(); // Get reset date as a string
        const today = new Date().toDateString();

        // If today matches the reset day, skip EXP processing
        if (lastResetDate && today === lastResetDate) {
          console.warn("EXP gain is disabled on the reset day.");
          return;
        }

        const nextExpGainTime = habit.nextExpGainTime
          ? new Date(habit.nextExpGainTime).getTime()
          : new Date(habit.dateStart).getTime() + 24 * 60 * 60 * 1000;

        let daysGained = 0;

        while (now >= nextExpGainTime + daysGained * 24 * 60 * 60 * 1000) {
          daysGained++;
        }

        if (daysGained > 0) {
          const expPerDay = 50;
          const expGained = expPerDay * daysGained;
          habit.currentExp += expGained;
          habit.streak += daysGained;
          habit.nextExpGainTime = nextExpGainTime + daysGained * 24 * 60 * 60 * 1000;

          // Check for level-up
          while (habit.currentExp >= habit.maxExp) {
            habit.currentExp -= habit.maxExp;
            habit.xpLevel++;
            habit.maxExp = this.EXP_THRESHOLD(habit.xpLevel);
          }

          await db.habit.put(habit);
          this.habit = habit;

          for (let i = 0; i < daysGained; i++) {
            await db.exp.add({
              time: nextExpGainTime + i * 24 * 60 * 60 * 1000,
              exp: expPerDay,
              type: "streak",
            });
          }
          console.log(`EXP gained: ${expGained} for ${daysGained} days.`);
          alert(`EXP gained: ${expGained} for ${daysGained} days.`);
        }
      } catch (error) {
        console.error("Failed to process daily EXP:", error);
      }
    },
    async gainExp() {
      const expGained = 30;
      try {
        const habit = await db.habit.get(1);
        if (!habit) return;

        const lastResetDate = new Date(habit.lastResetDate).toDateString(); // Get reset date as a string
        const today = new Date().toDateString();

        // If today matches the reset day, skip EXP gain
        if (lastResetDate && today === lastResetDate) {
          console.warn("EXP gain is disabled on the reset day.");
          return;
        }

        habit.currentExp += expGained;
        habit.battles++;

        // Check for level-up
        while (habit.currentExp >= habit.maxExp) {
          habit.currentExp -= habit.maxExp; // Carry over extra EXP
          habit.xpLevel++; // Level up
          habit.maxExp = this.EXP_THRESHOLD(habit.xpLevel); // Update maxExp for the next level
        }

        await db.habit.put(habit);
        this.habit = habit;
        await db.exp.add({
          time: Date.now(),
          exp: expGained,
          type: "battle",
        });
        console.log("Habit:", habit, "expRecords:", await db.exp.toArray());
        return habit; // Return updated habit
      } catch (error) {
        console.error("Failed to gain EXP:", error);
      }
    },
    async clearExp(){
      await db.exp.clear();
    }
  },
  async created() {
    try {
      await this.processDailyExp();
      this.habit = await db.habit.get(1);
      if (!this.habit) {
        this.$router.push('/onboarding/step1');
      }
    } catch (error) {
      console.error('Error fetching habit:', error);
    }
  },
};
</script>
