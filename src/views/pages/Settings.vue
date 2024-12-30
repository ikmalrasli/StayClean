<template>
  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  @click="deleteBtn">Delete Habit</button>
</template>

<script>
import { deleteHabit } from '../../db';

export default {
  methods: {
    deleteBtn() {
      deleteHabit();
      this.$router.push('/onboarding/step1');
    }
  }
}
</script>