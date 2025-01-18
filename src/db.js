// src/db.js
import Dexie from 'dexie';

const db = new Dexie('stayclean_DB');

// Define the schema
db.version(1).stores({
  habit: 'id, name, dateStart, color, xpLevel, currentExp, maxExp, streak, battles, nextExpGainTime',
  exp: '++id, time, exp, type',
  trials: '++id, trial, xpLevel, streak, battles, dateStarted, dateEnded, reason',
});

export default db;

export async function setHabit(name, dateStart, color) {
  try {
    const nextExpGainTime = new Date(dateStart).getTime() + 24 * 60 * 60 * 1000; // First gain after 24 hours
    await db.habit.put({
      id: 1,
      name,
      dateStart,
      color,
      xpLevel: 1,
      currentExp: 0,
      maxExp: 100,
      streak: 0,
      battles: 0,
      nextExpGainTime,
    });
    console.log('Habit created/updated successfully!');
  } catch (error) {
    console.error('Failed to create/update habit:', error);
  }
}

export async function deleteHabit() {
  try {
    await db.habit.delete(1);
    await db.exp.clear();
    await db.trials.clear();
    console.log('Habit deleted successfully!');
  } catch (error) {
    console.error('Failed to delete habit:', error);
  }
}

export async function resetHabit(dateEnded, reason) {
  const habit = await db.habit.get(1); // Get the current habit
  if (!habit) {
    console.error("No habit found to reset.");
    return;
  }

  try {
    if (!dateEnded || !reason) {
      console.error("Invalid dateEnded or reason.");
      return;
    }

    const trialCount = await db.trials.count();

    await db.trials.add({
      trial: trialCount + 1, 
      xpLevel: habit.xpLevel,
      streak: habit.streak,
      battles: habit.battles,
      dateStarted: habit.dateStart,
      dateEnded: dateEnded,
      reason: reason,
    });

    await db.habit.update(1, {
      dateStart: dateEnded,
      xpLevel: 1,
      currentExp: 0,
      maxExp: 100,
      streak: 0,
      battles: 0,
      lastResetDate: dateEnded
    });

    console.log("Habit successfully reset.");
  } catch (error) {
    console.error("Failed to reset habit:", error);
  }
}
