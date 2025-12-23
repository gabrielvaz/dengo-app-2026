import { ProfileService } from '../ProfileService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../../models/UserProfile';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('ProfileService', () => {
  const mockProfile: UserProfile = {
    name: 'Test',
    relationshipStage: 'namorando',
    relationshipTime: '1-ano',
    needs: ['comunicacao'],
    notificationsEnabled: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save profile correctly', async () => {
    await ProfileService.saveProfile(mockProfile);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user_profile', JSON.stringify(mockProfile));
  });

  it('should get profile correctly', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockProfile));
    const profile = await ProfileService.getProfile();
    expect(profile).toEqual(mockProfile);
  });

  it('should return null if no profile exists', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const profile = await ProfileService.getProfile();
    expect(profile).toBeNull();
  });

  it('should clear profile', async () => {
    await ProfileService.clearProfile();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user_profile');
  });
});
