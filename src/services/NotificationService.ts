import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { UserProfile } from '../models/UserProfile';
import { NOTIFICATION_COPIES, NotificationTemplate } from '../data/NotificationCopies';
import { StreakService } from './StreakService';

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

  static async getDynamicContent(): Promise<NotificationTemplate> {
    const streakData = await StreakService.getStreakData();
    const count = streakData.currentStreak;
    const day = new Date().getDay(); // 0-6 (Sun-Sat)

    // 1. Milestone Check
    const milestones = NOTIFICATION_COPIES.milestones as Record<string, NotificationTemplate>;
    if (milestones[count.toString()]) {
        return milestones[count.toString()];
    }

    // 2. Specific Streak Phase
    if (count > 0 && count <= 10) {
        return NOTIFICATION_COPIES.streakIntro[count - 1] || NOTIFICATION_COPIES.streakIntro[0];
    }
    if (count > 10 && count <= 30) {
        const idx = (count - 11) % NOTIFICATION_COPIES.streakCore.length;
        return NOTIFICATION_COPIES.streakCore[idx];
    }

    // 3. Seasonal (Day of Week)
    if (day === 5) return NOTIFICATION_COPIES.seasonal.friday[Math.floor(Math.random() * NOTIFICATION_COPIES.seasonal.friday.length)];
    if (day === 6) return NOTIFICATION_COPIES.seasonal.saturday[Math.floor(Math.random() * NOTIFICATION_COPIES.seasonal.saturday.length)];
    if (day === 0) return NOTIFICATION_COPIES.seasonal.sunday[Math.floor(Math.random() * NOTIFICATION_COPIES.seasonal.sunday.length)];
    if (day === 3) return NOTIFICATION_COPIES.seasonal.wednesday[0];

    // 4. Low Streak / Retention
    if (count === 0) {
        return NOTIFICATION_COPIES.retention[Math.floor(Math.random() * 2) + 2]; // Index 2 or 3 (Saudade/Conexão)
    }

    // 5. Generic Fallback
    const randomIdx = Math.floor(Math.random() * NOTIFICATION_COPIES.generic.length);
    return NOTIFICATION_COPIES.generic[randomIdx];
  }

  static async scheduleDailyReminder(times: string | string[]): Promise<boolean> {
    const timeToSchedule = Array.isArray(times) ? (times[0] === 'smart' ? DEFAULT_REMINDER_TIME : times[0]) : times;
    const parsed = getTimeParts(timeToSchedule);
    if (!parsed) return false;

    await this.cancelDailyReminder();

    const content = await this.getDynamicContent();

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: content.title,
        body: content.body,
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
    time?: string | string[];
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
