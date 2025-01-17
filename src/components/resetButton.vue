<!-- src/components/resetButton.vue -->
<template>
  <div class="relative">
    <button class="w-full bg-red-500 hover:bg-red-700 text-white font-medium p-4 rounded-2xl"
    @click="toggleOptions">Reset Habit</button>

    <Teleport to="body">
      <div v-if="showOptions" class="fixed z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-50" aria-hidden="true" @click="toggleOptions"></div>

        <div class="inline-block items-center transform rounded-lg">
          <div class="bg-card space-y-4 rounded-xl p-4">
            <!-- Title -->
            <h1 class="text-center text-xl font-bold text-primary">Reset Habit</h1>

            <!-- Ended Date and Time -->
            <div class="flex space-x-2 items-center ">
              <span class="text-secondary">Ended on</span>
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

            <!-- Reason -->
            <div class="border rounded-lg p-4">
              <input 
                v-model="reason"
                type="text"
                placeholder="Reason for reset"
                class="w-full bg-transparent text-lg placeholder-gray-500 focus:outline-none"
              />
            </div>

            <div>
              <button
                @click="resetBtn"
                class="w-full py-2 bg-red-500 text-white rounded-lg disabled:bg-gray-400 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="!reason || selectedDate > new Date().toISOString().split('T')[0] || !selectedTime > new Date().toTimeString().slice(0, 5)"
              >
                Reset Habit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { resetHabit } from '../db';
import { EventBus } from '../eventBus';

export default {
  data(){
    const now = new Date();
    return{
      showOptions: false,
      selectedDate: now.toISOString().split('T')[0],
      selectedTime: now.toTimeString().slice(0, 5),
      reason:''
    }
  },
  methods: {
    toggleOptions(){
      this.showOptions=!this.showOptions
    },
    resetBtn(){
      const dateTime = new Date(`${this.selectedDate}T${this.selectedTime}`);
      resetHabit(dateTime.toISOString(), this.reason)
      this.showOptions=false
      EventBus.emit('navigateHome'); // Emit event via EventBus
    }
  }
}
</script>