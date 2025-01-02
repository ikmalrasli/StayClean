<template>
  <div class="bg-card rounded-2xl p-4 w-full shadow-card space-y-4">
      <h1 class="text-center text-primary text-xl font-bold">{{ title }}</h1>
      
    <div class="flex flex-row items-center justify-center">
      <i v-if="icon" :class="icon" class="text-3xl text-primary mr-2"></i>
      <p v-if="value" class="text-left text-primary text-3xl font-bold">
        <span v-if="unit=='Lv.'" class="text-sm text-secondary font-normal">{{ unit }}</span>
        {{ value }}
        <span v-if="unit!='Lv.'" class="text-sm text-secondary font-normal">{{ unit }}</span>
      </p>
      <p v-if="reason" class="text-secondary text-2xl font-bold">{{ reason }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Title'
  },
  value: {
    type: Number,
  },
  unit: {
    type: String,
  },
  reason: {
    type: String,
  },
  icon: {
    type: String,
  }
});
</script>
