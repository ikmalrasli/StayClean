// src/db.js
import Dexie from 'dexie';

const db = new Dexie('stayclean_DB');

// Define the schema
db.version(1).stores({
  habit: 'id, name, dateStart, color, streak, battlesWon, xpLevel, currentExp, maxExp',
  resets: '++id, reason, date, streakBeforeReset',
});

export default db;

export async function setHabit(name, dateStart, color) {
  try {
    await db.habit.put({
      id: 1,
      name,
      dateStart,
      color,
      streak: 0,
      battlesWon: 0,
      xpLevel: 1, // Start at level 1
      currentExp: 0, // No EXP initially
      maxExp: 100, // Set initial EXP required for Level 1
    });
    console.log('Habit created/updated successfully!');
  } catch (error) {
    console.error('Failed to create/update habit:', error);
  }
}

export async function addBattlesWon() {
  try {
    const habit = await db.habit.get(1);
    if (habit) {
      habit.battlesWon++;
      await db.habit.put(habit);
      console.log('current battles won:', habit.battlesWon);
    }
  } catch (error) {
    console.error('Failed to add battles won:', error);
  }
}

export async function deleteHabit() {
  try {
    await db.habit.delete(1);
    console.log('Habit deleted successfully!');
  } catch (error) {
    console.error('Failed to delete habit:', error);
  }
}

export async function updateProgress({ streakIncrement = 1, battlesWonIncrement = 1 }) {
  try {
    const habit = await db.habit.get(1);
    if (habit) {
      habit.streak += streakIncrement;
      habit.battlesWon += battlesWonIncrement;
      habit.xpLevel = calculateXP(habit.streak, habit.battlesWon); // Example XP formula
      await db.habit.put(habit);
      console.log('Progress updated:', habit);
    }
  } catch (error) {
    console.error('Failed to update progress:', error);
  }
}

export async function gainExp(expGained) {
  try {
    const habit = await db.habit.get(1);
    if (!habit) return;

    habit.currentExp += expGained;

    // Check for level-up
    while (habit.currentExp >= habit.maxExp) {
      habit.currentExp -= habit.maxExp; // Carry over extra EXP
      habit.xpLevel++; // Level up
      habit.maxExp = calculateMaxExp(habit.xpLevel); // Update maxExp for the next level
    }

    await db.habit.put(habit);
    console.log('EXP gained:', expGained, 'New stats:', habit);
    return habit; // Return updated habit
  } catch (error) {
    console.error('Failed to gain EXP:', error);
  }
}

// Formula for EXP required for next level
function calculateMaxExp(level) {
  return Math.floor(100 * Math.pow(1.2, level - 1)); // Example: Exponential growth
}


function calculateXP(streak, battlesWon) {
  return Math.floor(streak + battlesWon * 1.5); // Example formula
}

export async function resetStreak(reason) {
  try {
    const habit = await db.habit.get(1);
    if (habit) {
      const resetData = {
        reason,
        date: new Date().toISOString(),
        streakBeforeReset: habit.streak,
      };

      // Save reset details to the "resets" table
      await db.resets.add(resetData);

      // Reset habit stats
      habit.streak = 0;
      habit.battlesWon = 0;
      habit.xpLevel = 0;
      await db.habit.put(habit);

      console.log('Streak reset successfully:', resetData);
    }
  } catch (error) {
    console.error('Failed to reset streak:', error);
  }
}
