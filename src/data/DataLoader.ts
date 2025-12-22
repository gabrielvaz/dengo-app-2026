import { Flashcard } from '../models/Flashcard';
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
