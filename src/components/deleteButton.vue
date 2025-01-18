<!-- src/components/resetButton.vue -->
<template>
  <div class="relative">
    <button @click="toggleOptions">
    <i class="fa-solid fa-trash text-secondary"></i>
    </button>

    <Teleport to="body">
      <div v-if="showOptions" class="fixed z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-50" aria-hidden="true" @click="toggleOptions"></div>

        <div class="inline-block items-center transform rounded-lg">
          <div class="bg-card space-y-4 rounded-xl p-4">
            <!-- Title -->
            <h1 class="text-center text-xl font-bold text-primary">Delete Habit</h1>

            <p>Are you sure you want to delete this habit?</p>

            <div class="grid grid-cols-2 gap-4">
              <button
                @click="toggleOptions"
                class="p-2 text-primary rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                @click="deleteBtn"
                class="p-2 bg-red-500 text-white rounded-lg disabled:bg-gray-400 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { deleteHabit } from '../db';
import { EventBus } from '../eventBus';

export default {
  data(){
    return{
      showOptions: false,
    }
  },
  methods: {
    toggleOptions(){
      this.showOptions=!this.showOptions
    },
    deleteBtn(){
      deleteHabit();
      this.$router.push('/onboarding/step1');
    }
  }
}
</script>