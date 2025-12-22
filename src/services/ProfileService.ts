import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../models/UserProfile';

const PROFILE_KEY = 'user_profile';

export class ProfileService {
  static async saveProfile(profile: UserProfile): Promise<void> {
    try {
      const jsonValue = JSON.stringify(profile);
      await AsyncStorage.setItem(PROFILE_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving profile', e);
      throw e;
    }
  }

  static async getProfile(): Promise<UserProfile | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(PROFILE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error reading profile', e);
      return null;
    }
  }

  static async clearProfile(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PROFILE_KEY);
    } catch (e) {
      console.error('Error clearing profile', e);
    }
  }
}
