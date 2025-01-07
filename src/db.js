// src/db.js
import Dexie from 'dexie';

const db = new Dexie('stayclean_DB');

// Define the schema
db.version(1).stores({
  habit: 'id, name, dateStart, color, xpLevel, currentExp, maxExp, streak, battles, nextExpGainTime',
  exp: '++id, time, exp, type',
  trials: '++id, trial, level, exp, streak, dateEnded',
});

export default db;

export async function setHabit(name, dateStart, color) {
  try {
    // const nextExpGainTime = new Date(dateStart).getTime() + 24 * 60 * 60 * 1000; // First gain after 24 hours
    const nextExpGainTime = new Date(dateStart).getTime() + 60 * 1000; // First gain after 1 minute
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
    console.log('Habit deleted successfully!');
  } catch (error) {
    console.error('Failed to delete habit:', error);
  }
}