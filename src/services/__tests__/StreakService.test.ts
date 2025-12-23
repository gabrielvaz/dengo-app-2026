import { StreakService, StreakData } from '../StreakService';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('StreakService', () => {
  const today = new Date().toISOString().split('T')[0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return default data if no streak data exists', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const data = await StreakService.getStreakData();
    expect(data.currentStreak).toBe(0);
    expect(data.bestStreak).toBe(0);
    expect(data.totalCategorySetsCompleted).toBe(0);
  });

  it('should increment streak if interaction is on consecutive day', async () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const initialData: StreakData = {
      currentStreak: 5,
      bestStreak: 5,
      lastInteractionDate: yesterday,
      rescueMissionAvailable: true,
      unlockedCategories: [],
      totalCategorySetsCompleted: 0
    };
    
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(initialData));
    
    const updated = await StreakService.recordInteraction();
    
    expect(updated.currentStreak).toBe(6);
    expect(updated.bestStreak).toBe(6);
    expect(updated.lastInteractionDate).toBe(today);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('should reset streak if interaction is missed by more than 1 day', async () => {
    const twoDaysAgo = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];
    const initialData: StreakData = {
      currentStreak: 5,
      bestStreak: 5,
      lastInteractionDate: twoDaysAgo,
      rescueMissionAvailable: true,
      unlockedCategories: [],
      totalCategorySetsCompleted: 0
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(initialData));

    const updated = await StreakService.recordInteraction();

    expect(updated.currentStreak).toBe(1); // Reset to 1 (today counts as 1)
    expect(updated.bestStreak).toBe(5); // Best maintained
  });

  it('should not increment if already interacted today', async () => {
    const initialData: StreakData = {
      currentStreak: 5,
      bestStreak: 5,
      lastInteractionDate: today,
      rescueMissionAvailable: true,
      unlockedCategories: [],
      totalCategorySetsCompleted: 0
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(initialData));

    const updated = await StreakService.recordInteraction();

    expect(updated.currentStreak).toBe(5); // Unchanged
  });
});
