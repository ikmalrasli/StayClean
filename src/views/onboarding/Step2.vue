<template>
  <div class="flex flex-col items-center justify-center h-screen space-y-4">
    <div class="bg-card shadow-card max-w-xs w-full p-16 rounded-lg space-y-4">
      <h2>Track your progress</h2>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      @click="$router.push('/onboarding/step3')">Next</button>
    </div>
  </div>
</template>