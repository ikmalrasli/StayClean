<!-- src/views/History.vue -->
<template>
  <div class="flex flex-col space-y-2">
    <!-- Render Current Trial -->
    <TrialCard
    :dateStart="formatDate(habit?.dateStart)"
    :streak="habit?.streak" 
    :totalBattles="habit?.battles" 
    :highestLevel="habit?.xpLevel" />

    <!-- Render TrialCard for each past trial -->
    <TrialCard
      v-for="(trial, index) in trials"
      :key="index"
      :title="`Trial ${trial.trial}`"
      :current="false"
      :dateStart="formatDate(trial.dateStarted)"
      :dateEnd="trial.dateEnded ? formatDate(trial.dateEnded) : null"
      :streak="trial.streak || 0"
      :totalBattles="trial.battles || 0"
      :highestLevel="trial.xpLevel || 0"
    />
  </div>
</template>

<script>
import TrialCard from '../../components/TrialCard.vue';
import db from '../../db';

export default {
  components: {
    TrialCard,
  },
  data() {
    return {
      trials: [], // To store trials data
      habit: null,
    };
  },
  methods: {
    async fetchTrials() {
      try {
        this.habit = await db.habit.get(1);
        // Fetch all trials from the database
        this.trials = await db.trials.toArray();
        // Sort trials by trial number in descending order
        this.trials.sort((a, b) => b.trial - a.trial);
      } catch (error) {
        console.error('Error fetching trials:', error);
      }
    },
    formatDate(date) {
      if (!date) return null;
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(date).toLocaleDateString("en-UK", options); // Formats as "12 Dec 2024"
    },
  },
  async created() {
    await this.fetchTrials(); // Fetch trials data when the component is created
    //await db.trials.clear(); // Clear all trials
  },
};
</script>
