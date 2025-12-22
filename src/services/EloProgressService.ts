import AsyncStorage from '@react-native-async-storage/async-storage';

const ELO_PROGRESS_KEY = 'elo_progress_data';

interface EloState {
  currentLevel: number; // 0-based index of unlocked articles
  lastCompletionDate: string | null;
}

interface AllElosProgress {
    [eloKey: string]: EloState;
}

export class EloProgressService {
  
  static async getProgress(eloKey: string): Promise<EloState> {
      const all = await this.getAllProgress();
      return all[eloKey] || { currentLevel: 0, lastCompletionDate: null };
  }

  static async getAllProgress(): Promise<AllElosProgress> {
      const json = await AsyncStorage.getItem(ELO_PROGRESS_KEY);
      return json ? JSON.parse(json) : {};
  }


  static async canAccessLesson(eloKey: string, lessonIndex: number): Promise<boolean> {
     const progress = await this.getProgress(eloKey);
     // Lesson is accessible if index <= currentLevel
     // But we also need to enforce the daily lock? 
     // "As próximas lições só ficam disponíveis no dia seguinte"
     // This implies users can see ALL past lessons, but only ONE NEW lesson per day.
     // So accessible if index <= progress.currentLevel.
     
     // Wait, if currentLevel is 5, I can access 0,1,2,3,4,5.
     // Can I access 6? No.
     // If I complete 5 today, currentLevel becomes 6.
     // But can I access 6 TODAY?
     // If I "completed" the lesson, it means I finished it.
     // If I finish lesson 5 today, I should wait for tomorrow for 6.
     // So, `currentLevel` is the HIGHEST COMPLETED? Or current OPEN?
     
     // Let's redefine: `unlockedLevel` (starts at 0).
     // Users can read `unlockedLevel`.
     // When they FINISH reading `unlockedLevel`, we mark as 'complete'.
     // IF they haven't completed any today, we increment `unlockedLevel` for TOMORROW? 
     // No, usually:
     // - Day 1: Access Level 0. Read it. Mark Done.
     // - Day 1: Access Level 1? NO. Locked.
     // - Day 2: Unlock Level 1.
     
     // Implementation:
     // Access Allow: index <= unlockedLevel.
     // When viewing index === unlockedLevel:
     //   We check `lastCompletionDate`. 
     //   If `lastCompletionDate == today`, it means we already finished a lesson (the previous one, presumably, to unlock this one? Or this one?)
     
     // Simpler model:
     // `completedCount`: number of lessons finished.
     // `lastCompletionDate`.
     // Available index = `completedCount`.
     // BUT, if `lastCompletionDate == today`, we CANNOT increment `completedCount` again.
     // So if I am at count 5 (lesson 5 pending). I read lesson 5. I click "Finish".
     // Update: completedCount = 6, date = today.
     // UI shows Lesson 6 as LOCKED ("Disponível amanhã").
     
     // So:
     // isLocked(index) => index > completedCount OR (index == completedCount && lastCompletionDate == today && completedCount > 0) ??
     // Actually usually the "next" one is shown but locked.
     
     return lessonIndex <= progress.currentLevel;
  }

  static async markLessonCompleted(eloKey: string, lessonIndex: number): Promise<void> {
      const all = await this.getAllProgress();
      const current = all[eloKey] || { currentLevel: 0, lastCompletionDate: null };

      // Verify we are completing the current level
      if (lessonIndex !== current.currentLevel) {
          // Maybe re-reading an old lesson? Do nothing.
          return;
      }
      
      const today = new Date().toISOString().split('T')[0];
      if (current.lastCompletionDate === today) {
         // Already advanced today
         return;
      }

      const nextLevel = current.currentLevel + 1;
      
      all[eloKey] = {
          currentLevel: nextLevel,
          lastCompletionDate: today
      };

      await AsyncStorage.setItem(ELO_PROGRESS_KEY, JSON.stringify(all));
  }
}
