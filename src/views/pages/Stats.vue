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
      :value="28"  
      :unit="'Days'"
      :icon="'fa-solid fa-fire'" />
      <MiniStatsCard
      :title="'Highest Level'"
      :value="32"  
      :unit="'Lv.'"
      :icon="'fa-solid fa-bolt'" />
      <MiniStatsCard
      :title="'Most Battles'"
      :value="32"  
      :unit="'Won'"
      :icon="'fa-solid fa-fist-raised'" />
      <MiniStatsCard
      :title="'Common Reset Reason'"
      :reason="'Stress'" />
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
      activityData: [
        { date: "2024-12-26", level: 4 },
        { date: "2024-12-27", level: 1 },
        { date: "2024-12-28", level: 3 },
        { date: "2024-12-29", level: 2 },
        { date: "2024-12-30", level: 3 },
        { date: "2024-12-31", level: 4 },
        { date: "2025-01-01", level: 4 },
        { date: "2025-01-02", level: 1 },
        // Continue for the rest of the month
      ]
    };
  },
};
</script>
