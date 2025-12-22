import AsyncStorage from '@react-native-async-storage/async-storage';

const STREAK_KEY = 'dengo_streak_data';

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastInteractionDate: string | null; // YYYY-MM-DD
  rescueMissionAvailable: boolean;
  unlockedCategories: string[];
  totalCategorySetsCompleted: number;
}

export class StreakService {
  static async getStreakData(): Promise<StreakData> {
    const data = await AsyncStorage.getItem(STREAK_KEY);
    if (!data) {
      return {
        currentStreak: 0,
        bestStreak: 0,
        lastInteractionDate: null,
        rescueMissionAvailable: true,
        unlockedCategories: [
          'daily', 
          'almas-gemeas', 
          'casais', 
          'conexao-diaria', 
          'confianca', 
          'crescimento', 
          'desafios', 
          'leve-e-divertido', 
          'memorias', 
          'modo-familia', 
          'perguntas-profundas', 
          'quentes', 
          'romance', 
          'voce-prefere'
        ],
        totalCategorySetsCompleted: 0
      };
    }
    const parsed = JSON.parse(data);
    if (parsed.totalCategorySetsCompleted === undefined) {
        parsed.totalCategorySetsCompleted = 0;
    }
    return parsed;
  }

  static async recordInteraction(): Promise<StreakData> {
    const data = await this.getStreakData();
    const today = new Date().toISOString().split('T')[0];

    if (data.lastInteractionDate === today) {
      return data;
    }

    const lastDate = data.lastInteractionDate ? new Date(data.lastInteractionDate) : null;
    const todayDate = new Date(today);
    
    let newStreak = data.currentStreak;

    if (!lastDate) {
      newStreak = 1;
    } else {
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        // Streak broken
        newStreak = 1; // Or check for rescue mission in UI
      }
    }

      const updatedData: StreakData = {
      ...data,
      currentStreak: newStreak,
      bestStreak: Math.max(newStreak, data.bestStreak),
      lastInteractionDate: today,
    };
    
    // Ensure unlocking logic is persistent (though now all are default, we keep this for legacy safety)
    if (!updatedData.unlockedCategories.includes('perguntas-profundas')) {
         updatedData.unlockedCategories.push('perguntas-profundas');
    }
    if (!updatedData.unlockedCategories.includes('quentes')) {
         updatedData.unlockedCategories.push('quentes');
    }

    await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(updatedData));
    return updatedData;
  }

  static async incrementCategorySetsCompleted(): Promise<StreakData> {
      const data = await this.getStreakData();
      const updatedData = {
          ...data,
          totalCategorySetsCompleted: (data.totalCategorySetsCompleted || 0) + 1
      };
      await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(updatedData));
      return updatedData;
  }

  static async useRescueMission(): Promise<StreakData> {
    const data = await this.getStreakData();
    // This would be called after a broken streak to restore it
    // For now, simplified version
    return data;
  }
}
