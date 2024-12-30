import { createRouter, createWebHistory } from 'vue-router';
import Onboarding from './views/Onboarding.vue';
import Dashboard from './views/Dashboard.vue';
import Step1 from './views/onboarding/Step1.vue';
import Step2 from './views/onboarding/Step2.vue';
import Step3 from './views/onboarding/Step3.vue';
import db from './db'; // Path to your IndexedDB setup

const routes = [
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: Onboarding,
    children: [
      { path: 'step1', name: 'Step1', component: Step1 },
      { path: 'step2', name: 'Step2', component: Step2 },
      { path: 'step3', name: 'Step3', component: Step3 },
    ],
  },
  {
    path: '/',
    alias: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard to Check Habit
router.beforeEach(async (to, from, next) => {
  try {
    const habit = await db.habit.get(1); // Check if the habit exists in the database
    if (habit && to.path.startsWith('/onboarding')) {
      // If habit exists and trying to access onboarding, redirect to dashboard
      return next('/');
    }
    if (!habit && (to.path === '/' || to.path === '/dashboard')) {
      // If no habit exists and trying to access dashboard, redirect to onboarding
      return next('/onboarding/step1');
    }
  } catch (error) {
    console.error('Error checking habit:', error);
  }
  next(); // Proceed to the route as normal if no conditions are met
});

export default router;
