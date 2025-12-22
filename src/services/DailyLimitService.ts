import AsyncStorage from '@react-native-async-storage/async-storage';

const LIMIT_KEY_PREFIX = 'daily_limit_';

export class DailyLimitService {
  static readonly DAILY_LIMIT = 5;

  private static getTodayKey(category: string): string {
    const today = new Date().toISOString().split('T')[0];
    return `${LIMIT_KEY_PREFIX}${category}_${today}`;
  }

  static async getConsumedCount(category: string): Promise<number> {
    const key = this.getTodayKey(category);
    const countStr = await AsyncStorage.getItem(key);
    return countStr ? parseInt(countStr, 10) : 0;
  }

  static async incrementConsumed(category: string): Promise<number> {
    const key = this.getTodayKey(category);
    const current = await this.getConsumedCount(category);
    const next = current + 1;
    await AsyncStorage.setItem(key, next.toString());
    return next;
  }

  static async remaining(category: string): Promise<number> {
    const consumed = await this.getConsumedCount(category);
    return Math.max(0, this.DAILY_LIMIT - consumed);
  }

  static async isLimitReached(category: string): Promise<boolean> {
      const r = await this.remaining(category);
      return r <= 0;
  }
}
