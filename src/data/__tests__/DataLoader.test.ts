import { DataLoader } from '../DataLoader';
import { flashcardsMap } from '../flashcardsMap';
import { UserProfile } from '../../models/UserProfile';

// Mock the flashcards data
jest.mock('../flashcardsMap', () => ({
  flashcardsMap: {
    'casais': {
        cards: [
            { id: '1', categoria_principal: 'Casais', titulo_curto: 'T1', pergunta: 'P1', relationship_stage: ['namorando'], relationship_time: ['menos-de-6-meses'], needs: [], secondary_categories: [], nivel: 'leve', duracao_estimada: '1min', sensibilidade: 'ok' },
            { id: '2', categoria_principal: 'Casais', titulo_curto: 'T2', pergunta: 'P2', relationship_stage: ['casados'], relationship_time: ['mais-de-10-anos'], needs: [], secondary_categories: [], nivel: 'leve', duracao_estimada: '1min', sensibilidade: 'ok' }
        ]
    },
    'almas-gemeas': [
        { id: '3', categoria_principal: 'Almas Gêmeas', titulo_curto: 'T3', pergunta: 'P3', relationship_stage: ['namorando'], relationship_time: ['menos-de-6-meses'], needs: [], secondary_categories: [], nivel: 'leve', duracao_estimada: '1min', sensibilidade: 'ok' }
    ]
  }
}));

describe('DataLoader', () => {
  const mockProfile: UserProfile = {
    name: 'Test User',
    relationshipTime: 'menos-de-6-meses',
    relationshipStage: 'namorando',
    needs: [],
    notificationsEnabled: true
  };

  it('should load all flashcards correctly (handling both array and object structure)', async () => {
    const cards = await DataLoader.loadAllFlashcards();
    expect(cards.length).toBe(3); // 2 from Casais, 1 from Almas Gêmeas
  });

  it('should filter cards based on user profile', async () => {
    const cards = await DataLoader.loadFilteredFlashcards(mockProfile);
    // Should match card 1 (Casais) and card 3 (Almas Gêmeas)
    // Card 2 is 'casados'/'mais-de-10-anos', so should be filtered out
    expect(cards.length).toBe(2);
    expect(cards.map(c => c.id)).toEqual(expect.arrayContaining(['1', '3']));
  });

  it('should use fallback if strictly filtered list is empty inside loadFilteredFlashcards (Daily Feed logic)', async () => {
    const mismatchedProfile: UserProfile = { ...mockProfile, relationshipStage: 'divorciados' }; // No match
    const cards = await DataLoader.loadFilteredFlashcards(mismatchedProfile);
    
    // Fallback: If filter returns 0, it should return ALL cards.
    expect(cards.length).toBe(3);
  });

  it('should load by category with exact key match', async () => {
    const cards = await DataLoader.loadByCategory('almas-gemeas', mockProfile);
    expect(cards.length).toBe(1);
    expect(cards[0].id).toBe('3');
  });

  it('should load by category with robust/fuzzy key match (fallback)', async () => {
    // 'Almas Gêmeas' (with accents/caps) does NOT match key 'almas-gemeas' directly
    // It should trigger fallback search
    const cards = await DataLoader.loadByCategory('Almas Gêmeas', mockProfile);
    expect(cards.length).toBe(1);
    expect(cards[0].id).toBe('3');
  });

  it('should use fallback if filtered category cards are empty (Feed logic)', async () => {
     // User is 'namorando', but we ask for 'Casais'.
     // Card 1 matches 'namorando', Card 2 does not.
     // So normally it returns [Card 1].
     
     // Now let's try a profile that matches NOTHING in 'Casais'
     const mismatchedProfile: UserProfile = { ...mockProfile, relationshipStage: 'extraterrestre' };
     const cards = await DataLoader.loadByCategory('casais', mismatchedProfile);
     
     // Should fallback to returning ALL cards in that category
     expect(cards.length).toBe(2);
  });
});
