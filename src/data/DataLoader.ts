import { Flashcard } from '../models/Flashcard';
import { UserProfile } from '../models/UserProfile';
import { flashcardsMap } from './flashcardsMap';

export class DataLoader {
  static async loadAllFlashcards(): Promise<Flashcard[]> {
    const allCards: Flashcard[] = [];

    for (const key in flashcardsMap) {
      const data = flashcardsMap[key];
      if (Array.isArray(data)) {
        const cards = data.map((item: any) => this.mapToFlashcard(item));
        allCards.push(...cards);
      }
    }

    return allCards;
  }

  static async loadFilteredFlashcards(profile: UserProfile): Promise<Flashcard[]> {
    const allCards = await this.loadAllFlashcards();

    return allCards.filter((card) => {
      // 1. Check relationship stage
      const stageMatch = card.relationshipStage.length === 0 || 
                         card.relationshipStage.includes(profile.relationshipStage);
      
      // 2. Check relationship time
      const timeMatch = card.relationshipTime.length === 0 || 
                        card.relationshipTime.includes(profile.relationshipTime);

      return stageMatch && timeMatch;
    });
  }

  static async loadByCategory(category: string, profile: UserProfile): Promise<Flashcard[]> {
    // Optimization: If key matches map key, load directly
    let categoryCards: Flashcard[] = [];
    const targetCategory = category.toLowerCase();

    if (flashcardsMap[category]) {
        const data = flashcardsMap[category].cards || flashcardsMap[category];
        if (Array.isArray(data)) {
            categoryCards = data.map((item: any) => this.mapToFlashcard(item));
        }
    } else {
        // Fallback to searching all (e.g. if 'category' is a label like 'Casais')
        const allCards = await this.loadAllFlashcards();
        categoryCards = allCards.filter((card) => {
             const cardCat = card.category.toLowerCase();
             const secondary = card.secondaryCategories ? card.secondaryCategories.map((c: string) => c.toLowerCase()) : [];
             return cardCat === targetCategory || secondary.includes(targetCategory);
        });
    }

    // Now filter by Profile
    return categoryCards.filter((card) => {
      const stageMatch = card.relationshipStage.length === 0 || 
                         card.relationshipStage.includes(profile.relationshipStage);
      const timeMatch = card.relationshipTime.length === 0 || 
                        card.relationshipTime.includes(profile.relationshipTime);
      return stageMatch && timeMatch;
    });
  }

  private static mapToFlashcard(json: any): Flashcard {
    return {
      id: json.id,
      category: json.categoria_principal,
      title: json.titulo_curto,
      question: json.pergunta,
      relationshipStage: json.relationship_stage || [],
      relationshipTime: json.relationship_time || [],
      needs: json.needs || [],
      secondaryCategories: json.secondary_categories || [],
      level: json.nivel,
      estimatedDuration: json.duracao_estimada,
      sensitivity: json.sensibilidade,
    };
  }
}