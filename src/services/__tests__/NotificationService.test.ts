import { NotificationService } from '../NotificationService';
import * as Notifications from 'expo-notifications';
import { UserProfile } from '../../models/UserProfile';

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn().mockResolvedValue('new-id'),
  cancelScheduledNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  setNotificationHandler: jest.fn(),
  SchedulableTriggerInputTypes: {
    DAILY: 'daily',
  }
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  // Helper to simulate existing notification
  const mockExistingNotification = () => {
      (require('@react-native-async-storage/async-storage').getItem as jest.Mock).mockResolvedValue('existing-id');
  };

  it('should sync notifications from profile correctly', async () => {
    mockExistingNotification();
    const profile: UserProfile = {
      name: 'Test',
      relationshipStage: 'namorando',
      relationshipTime: '1-ano',
      needs: [],
      notificationTime: '20:30',
      notificationsEnabled: true
    };

    await NotificationService.syncFromProfile(profile);

    // Should cancel existing specific ID
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('existing-id');
    
    // Should schedule new
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: 'Cosmo',
          body: 'Seu ritual diario de conexao esta pronto.',
        }),
        trigger: {
          type: 'daily',
          hour: 20,
          minute: 30,
        }
      })
    );
  });

  it('should NOT schedule if notifications disabled', async () => {
    mockExistingNotification();
    const profile: UserProfile = {
      name: 'Test',
      relationshipStage: 'namorando',
      relationshipTime: '1-ano',
      needs: [],
      notificationTime: '20:30',
      notificationsEnabled: false
    };

    await NotificationService.syncFromProfile(profile);

    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('existing-id');
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('should default to 20:00 if no time provided', async () => {
    const profile: UserProfile = {
      name: 'Test',
      relationshipStage: 'namorando',
      relationshipTime: '1-ano',
      needs: [],
      // no notificationTime
      notificationsEnabled: true
    };

    await NotificationService.syncFromProfile(profile);

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
       expect.objectContaining({
         trigger: expect.objectContaining({
           hour: 20,
           minute: 0
         })
       })
    );
  });
});
