import { Flashcard } from '../models/Flashcard';
import { UserProfile } from '../models/UserProfile';
import { flashcardsMap } from './flashcardsMap';


const normalizeString = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
};

export class DataLoader {
  static async loadAllFlashcards(): Promise<Flashcard[]> {
    const allCards: Flashcard[] = [];

    for (const key in flashcardsMap) {
      const rawData = flashcardsMap[key];
      const data = rawData.cards || rawData; // Handle both structures
      if (Array.isArray(data)) {
        const cards = data.map((item: any) => this.mapToFlashcard(item));
        allCards.push(...cards);
      }
    }

    return allCards;
  }

  static async loadFilteredFlashcards(profile: UserProfile): Promise<Flashcard[]> {
    const allCards = await this.loadAllFlashcards();

    const filtered = allCards.filter((card) => {
      // 1. Check relationship stage
      const stageMatch = card.relationshipStage.length === 0 || 
                         card.relationshipStage.includes(profile.relationshipStage);
      
      // 2. Check relationship time
      const timeMatch = card.relationshipTime.length === 0 || 
                        card.relationshipTime.includes(profile.relationshipTime);

      return stageMatch && timeMatch;
    });

    // Fallback: If strict filtering returns empty, return all cards (randomized by FeedScreen later)
    return filtered.length > 0 ? filtered : allCards;
  }

  static async loadByCategory(category: string, profile: UserProfile): Promise<Flashcard[]> {
    // Optimization: If key matches map key, load directly
    let categoryCards: Flashcard[] = [];
    const targetCategory = category.toLowerCase();

    if (flashcardsMap[category]) {
        console.log(`[DataLoader] Found direct match for key: ${category}`);
        const data = flashcardsMap[category].cards || flashcardsMap[category];
        if (Array.isArray(data)) {
            console.log(`[DataLoader] Data is array of length: ${data.length}`);
            categoryCards = data.map((item: any) => this.mapToFlashcard(item));
        } else {
            console.log(`[DataLoader] Data is NOT array for key: ${category}`, data);
        }
    } else {
        console.log(`[DataLoader] NO direct match for key: ${category}. Trying fallback.`);
        // Fallback to searching all with fuzzy match
        const allCards = await this.loadAllFlashcards();
        const normalizedTarget = normalizeString(category);
        
        categoryCards = allCards.filter((card) => {
             const cardCat = normalizeString(card.category);
             const secondary = card.secondaryCategories ? card.secondaryCategories.map((c: string) => normalizeString(c)) : [];
             
             return cardCat.includes(normalizedTarget) || normalizedTarget.includes(cardCat) || secondary.some(c => c.includes(normalizedTarget));
        });
    }

    // Now filter by Profile
    const filtered = categoryCards.filter((card) => {
      const stageMatch = card.relationshipStage.length === 0 || 
                         card.relationshipStage.includes(profile.relationshipStage);
      const timeMatch = card.relationshipTime.length === 0 || 
                        card.relationshipTime.includes(profile.relationshipTime);
      return stageMatch && timeMatch;
    });

    // Fallback: If strict filtering removes everything, return all cards for the category
    // This ensures the user always sees something.
    return filtered.length > 0 ? filtered : categoryCards;
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