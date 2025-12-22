export interface Flashcard {
  id: string;
  category: string; // From categoria_principal
  title: string;    // From titulo_curto
  question: string; // From pergunta
  relationshipStage: string[]; // From relationship_stage
  relationshipTime: string[];  // From relationship_time
  needs: string[];
  secondaryCategories: string[]; // From secondary_categories
  level: string; // From nivel
  estimatedDuration: string; // From duracao_estimada
  sensitivity: string; // From sensibilidade
}
