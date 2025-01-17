<!-- src/views/Stats.vue -->
<template>
  <div class="flex flex-col space-y-2">
    <h1 class="px-2 text-xl font-bold text-left">Overall Performance</h1>
    <!-- View selector -->
    <div class="bg-secondary grid grid-cols-3 gap-1 p-1 rounded-lg mb-2 flex">
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
    <StreakCalendar v-if="activeView === 'Calendar'" :activityData="activityData" class="h-96" />
    <div v-if="activeView === 'EXP Gained'" class="bg-card rounded-2xl p-4 shadow-card h-96">EXP Gained chart</div>
    <div v-if="activeView === 'Reset Reasons'" class="bg-card rounded-2xl p-4 shadow-card h-96">Reset Reasons chart</div>

    <NextMilestoneCard></NextMilestoneCard>

    <div class="grid grid-cols-2 gap-2">
      <MiniStatsCard
      :title="'Best Streak'"
      :value="bestStreak"  
      :unit="'Days'"
      :icon="'fa-solid fa-fire'" />
      <MiniStatsCard
      :title="'Highest Level'"
      :value="highestLevel"  
      :unit="'Lv.'"
      :icon="'fa-solid fa-bolt'" />
      <MiniStatsCard
      :title="'Most Battles'"
      :value="mostBattles"  
      :unit="'Won'"
      :icon="'fa-solid fa-fist-raised'" />
      <MiniStatsCard
      :title="'Common Reset Reason'"
      :reason="commonResetReason" />
    </div>
    <!-- <TrialCard
    :dateStart="'12 Dec 2024'" :dateEnd="'1 Dec 2024'" :streak="31" :totalBattles="28" :highestLevel="6" />
    <TrialCard
    :current="false"
    :dateStart="'1 Dec 2024'" :dateEnd="'12 Dec 2024'" :streak="12" :totalBattles="8" :highestLevel="4" /> -->
  </div>
</template>

<script>
import StreakCalendar from '../../components/CalendarCard.vue';
import TrialCard from '../../components/TrialCard.vue';
import NextMilestoneCard from '../../components/NextMilestoneCard.vue';
import MiniStatsCard from '../../components/MiniStatsCard.vue';
import db from '../../db';

export default {
  components: {
    StreakCalendar,
    TrialCard,
    NextMilestoneCard,
    MiniStatsCard
  },
  data() {
    return {
      views: ['EXP Gained', 'Calendar', 'Reset Reasons'], // Available views
      activeView: 'Calendar', // Default view
      activityData: [],
      bestStreak: 0,
      highestLevel: 0,
      mostBattles: 0,
      commonResetReason: "-",
    };
  },
  methods: {
    async fetchActivityData() { 
      const expRecords = await db.exp.toArray(); // Fetch all records from `exp` collection
      const trialRecords = await db.trials.toArray(); // Fetch all records from `trials` collection

      // Create a set of dates where `dateEnded` exists
      const datesWithEndedTrials = new Set(
        trialRecords
          .filter(trial => trial.dateEnded)
          .map(trial => new Date(trial.dateEnded).toISOString().split('T')[0]) // Format as YYYY-MM-DD
      );

      // Group by date and calculate levels
      const groupedData = expRecords.reduce((acc, record) => {
        const date = new Date(record.time).toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        if (!acc[date]) acc[date] = { date, totalExp: 0 };
        acc[date].totalExp += record.exp; // Sum up EXP
        return acc;
      }, {});

      // Convert to array and map totalExp to level
      this.activityData = Object.values(groupedData).map(({ date, totalExp }) => ({
        date,
        level: datesWithEndedTrials.has(date) 
          ? 0 // If the date has `dateEnded`, level is 0
          : this.mapExpToLevel(totalExp), // Otherwise, map EXP to level
      }));
    },
    mapExpToLevel(exp) {
      if (exp > 200) return 4;
      if (exp > 100) return 3;
      if (exp > 50) return 2;
      if (exp > 0) return 1;
      return 0;
    },
    async fetchStats() {
      try {
        const trials = await db.trials.toArray(); // Fetch all past trials
        const habit = await db.habit.get(1); // Fetch the current habit

        if (!habit) {
          console.error("No current habit found.");
          return;
        }

        if (trials.length === 0) {
          // No past trials, use current habit stats
          this.bestStreak = habit.streak || 0;
          this.highestLevel = habit.xpLevel || 0;
          this.mostBattles = habit.battles || 0;
          this.commonResetReason = "-";
        } else {
          // Compare current habit with past trials
          const allTrials = [...trials, {
            streak: habit.streak,
            xpLevel: habit.xpLevel,
            battles: habit.battles,
            reason: "-",
          }];
          this.bestStreak = Math.max(...allTrials.map((t) => t.streak || 0));
          this.highestLevel = Math.max(...allTrials.map((t) => t.xpLevel || 0));
          this.mostBattles = Math.max(...allTrials.map((t) => t.battles || 0));

          // Find the most common reset reason across all trials
          const resetReasons = trials
            .map((t) => t.reason)
            .filter((reason) => reason && reason !== "-");
          if (resetReasons.length > 0) {
            this.commonResetReason = this.findMostCommon(resetReasons);
          } else {
            this.commonResetReason = "-";
          }
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    },
    findMostCommon(array) {
      const frequency = array.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});
      return Object.keys(frequency).reduce((a, b) =>
        frequency[a] > frequency[b] ? a : b
      );
    },
  },
  async created() {
    try {
      await this.fetchActivityData();
      await this.fetchStats();
    } catch (error) {
      console.error('Error initializing Home.vue:', error);
    }
  },
};
</script>
