import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_COMPLETION_KEY = 'ritual_last_completion';
const DAILY_LIMIT = 5;

export class RitualService {
  static get DAILY_LIMIT() {
    return DAILY_LIMIT;
  }

  static async hasCompletedToday(): Promise<boolean> {
    const lastDate = await AsyncStorage.getItem(LAST_COMPLETION_KEY);
    if (!lastDate) return false;

    const today = new Date().toISOString().split('T')[0];
    return lastDate === today;
  }

  static async markAsCompletedToday(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    await AsyncStorage.setItem(LAST_COMPLETION_KEY, today);
  }

  static async resetRitual(): Promise<void> {
    await AsyncStorage.removeItem(LAST_COMPLETION_KEY);
  }
}
