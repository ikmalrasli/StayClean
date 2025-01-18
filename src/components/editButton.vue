<!-- src/components/resetButton.vue -->
<template>
  <div class="relative">
    <button @click="toggleOptions">
      <i class="fa-solid fa-edit text-secondary"></i>
    </button>

    <Teleport to="body">
      <div v-if="showOptions" class="fixed z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-50" aria-hidden="true" @click="toggleOptions"></div>

        <div class="inline-block items-center transform rounded-lg">
          <div class="bg-card space-y-4 rounded-xl p-4">
            <!-- Title -->
            <h1 class="text-center text-xl font-bold text-primary">Edit Habit</h1>

            <!-- Habit Name -->
            <div class="border rounded-lg p-4">
              <input 
                v-model="habit.name"
                type="text"
                class="w-full bg-transparent text-lg placeholder-gray-500 focus:outline-none"
              />
            </div>

            <!-- Color -->
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Habit color</span>
              <input 
                v-model="habit.color"
                type="color"
                class="w-8 h-8 rounded-full overflow-hidden"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <button
                @click="toggleOptions"
                class="p-2 text-primary rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                @click="editBtn"
                class="p-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="!habit.name"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import db from '../db';
import { resetHabit } from '../db';
import { EventBus } from '../eventBus';

export default {
  data(){
    const now = new Date();
    return{
      showOptions: false,
      habit: null
    }
  },
  methods: {
    toggleOptions(){
      this.showOptions=!this.showOptions
    },
    editBtn(){
      db.habit.update(1, this.habit);
      this.showOptions=false
      EventBus.emit('navigateHome');
    }
  },
  async mounted() {
    this.habit = await db.habit.get(1);
  }
}
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