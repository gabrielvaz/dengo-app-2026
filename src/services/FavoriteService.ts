import AsyncStorage from '@react-native-async-storage/async-storage';
import { Flashcard } from '../models/Flashcard';

const FAVORITES_KEY = 'dengo_favorites';

export class FavoriteService {
  static async getFavorites(): Promise<Flashcard[]> {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error fetching favorites', e);
      return [];
    }
  }

  static async isFavorite(cardId: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.some(card => card.id === cardId);
  }

  static async toggleFavorite(card: Flashcard): Promise<boolean> {
    try {
      let favorites = await this.getFavorites();
      const isFav = favorites.some(f => f.id === card.id);
      
      if (isFav) {
        favorites = favorites.filter(f => f.id !== card.id);
      } else {
        favorites.push(card);
      }
      
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      return !isFav;
    } catch (e) {
      console.error('Error toggling favorite', e);
      return false;
    }
  }
}
