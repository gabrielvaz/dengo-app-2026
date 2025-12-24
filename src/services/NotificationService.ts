import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { UserProfile } from '../models/UserProfile';

const DAILY_NOTIFICATION_ID_KEY = 'dengo_daily_notification_id';
const DEFAULT_REMINDER_TIME = '20:00';

const getTimeParts = (time: string) => {
  const [hourStr, minuteStr] = time.split(':');
  const hour = Number(hourStr);
  const minute = Number(minuteStr);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  return { hour, minute };
};

export class NotificationService {
  static async configure(): Promise<void> {
    if (Platform.OS !== 'android') return;

    await Notifications.setNotificationChannelAsync('default', {
      name: 'Cosmo',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF7043',
    });
  }

  static async hasPermissions(): Promise<boolean> {
    const settings = await Notifications.getPermissionsAsync();
    return settings.status === 'granted';
  }

  static async requestPermissions(): Promise<boolean> {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.status === 'granted') return true;

    const request = await Notifications.requestPermissionsAsync();
    return request.status === 'granted';
  }

  static async cancelDailyReminder(): Promise<void> {
    const existingId = await AsyncStorage.getItem(DAILY_NOTIFICATION_ID_KEY);
    if (existingId) {
      await Notifications.cancelScheduledNotificationAsync(existingId);
      await AsyncStorage.removeItem(DAILY_NOTIFICATION_ID_KEY);
    }
  }

  static async scheduleDailyReminder(time: string): Promise<boolean> {
    const parsed = getTimeParts(time);
    if (!parsed) return false;

    await this.cancelDailyReminder();

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Cosmo',
        body: 'Seu ritual diario de conexao esta pronto.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: parsed.hour,
        minute: parsed.minute,
      },
    });

    await AsyncStorage.setItem(DAILY_NOTIFICATION_ID_KEY, notificationId);
    return true;
  }

  static async applySettings(options: {
    enabled: boolean;
    time?: string;
    requestPermission?: boolean;
  }): Promise<boolean> {
    if (!options.enabled) {
      await this.cancelDailyReminder();
      return true;
    }

    const targetTime = options.time || DEFAULT_REMINDER_TIME;
    const hasPermission = options.requestPermission
      ? await this.requestPermissions()
      : await this.hasPermissions();

    if (!hasPermission) {
      await this.cancelDailyReminder();
      return false;
    }

    return this.scheduleDailyReminder(targetTime);
  }

  static async syncFromProfile(profile: UserProfile): Promise<void> {
    const enabled = profile.notificationsEnabled ?? true;
    if (!enabled) {
      await this.cancelDailyReminder();
      return;
    }

    const hasPermission = await this.hasPermissions();
    if (!hasPermission) return;

    const time = profile.notificationTime || DEFAULT_REMINDER_TIME;
    await this.scheduleDailyReminder(time);
  }
}
