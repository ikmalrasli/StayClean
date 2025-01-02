<template>
  <div class="p-4 rounded-2xl"
  :class="current ? 'bg-blue-500 text-white' : 'bg-card shadow-card'">
    <h3 class="text-left text-lg font-bold mb-2"
    :class="current ? 'text-white' : 'text-primary'">
      {{ current ? 'Current Trial' : title }}</h3>
    <div class="flex justify-between items-center">
      <span class="text-sm w-24 px-2  py-1 rounded-full"
      :class="current ? 'bg-white bg-opacity-20 text-white' : 'bg-secondary text-secondary'">{{ dateStart }}</span>
      <span class="flex-grow border-t mx-2"
      :class="current ? 'border-white border-opacity-20' : 'border-card'"></span>
      <span class="text-sm w-24 px-2 py-1 rounded-full"
      :class="current ? 'bg-white bg-opacity-20 text-white' : 'bg-secondary text-secondary'">{{ current ? 'Now' : dateEnd }}</span>
    </div>

    <div class="flex flex-col mt-2 text-left text-sm "
    :class="current ? 'text-white' : 'text-secondary'">
      <div class="flex flex-row items-center justify-between mx-2">
        <div>
          <i class="fa-solid fa-fire mr-2"></i>
          <span>{{ streak }} Days</span>
        </div>
        
        <div>
          <i class="fa-solid fa-fist-raised mr-2"></i>
          <span>{{ totalBattles }} Won</span>
        </div>

        <div>
          <i class="fa-solid fa-bolt mr-2"></i>
          <span>Lv. {{ highestLevel }}</span>
        </div>
      </div>      
      <!-- <span v-if="!current">Reset Reason: {{ resetReason }}</span> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Trial 1'
    },
    dateStart: {
      type: String,
      required: true,
      default: '12 Dec 2024'
    },
    dateEnd: {
      type: String,
      required: true,
      default: '1 Dec 2024'
    },
    streak: {
      type: Number,
      required: true,
      default: 31
    },
    totalBattles: {
      type: Number,
      required: true,
      default: 28
    },
    highestLevel: {
      type: Number,
      required: true,
      default: 1
    },
    resetReason: {
      type: String,
      required: false,
      default: 'Stress'
    },
    current:{
      type: Boolean,
      required: true,
      default: true
    }
  }
}
</script>

<style scoped>
/* span {
  transition: background-color 0.3s;
} */
</style>