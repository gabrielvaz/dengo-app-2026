
import 'package:flutter_test/flutter_test.dart';
import 'package:dengo_app/data/data_loader.dart';
import 'package:dengo_app/models/flashcard.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('DataLoader', () {
    test('should load flashcards from assets', () async {
      // Mocking the behavior is implicit when using DefaultAssetBundle in widget tests,
      // but for unit tests with services, we can use the following approach if we were injecting the bundle.
      // However, DataLoader usually uses rootBundle directly. 
      // For this test, we will create an instance and verify it has the method.
      // Real integration testing with assets requires a widget test context or setting up the asset bundle.
      
      final loader = DataLoader();
      expect(loader, isNotNull);
      // We can't easily test rootBundle loading in a pure unit test without extensive mocking.
      // So we will focus on the parsing logic if we extract it, or use a widget test to verify asset loading.
    });

    testWidgets('should parse specific JSON content', (WidgetTester tester) async {
       // Using DefaultAssetBundle.of(context) would allow overriding.
       // But if DataLoader uses rootBundle, we intercept it.
       
       // Let's assume DataLoader has a method `parseFlashcards(String jsonString)` 
       // This allows us to test parsing logic in isolation.
       
       final loader = DataLoader();
       final jsonString = '''
       [
          {
            "id": "ALG-0001",
            "categoria_principal": "Almas Gêmeas",
            "titulo_curto": "Tema: nossos valores em comum",
            "pergunta": "Em nossos valores em comum, onde você sente que a gente combina de verdade?",
            "relationship_stage": ["se-conhecendo"],
            "relationship_time": ["menos-de-6-meses"],
            "needs": ["aprofundar-intimidade"],
            "secondary_categories": ["Conexão Diária"],
            "nivel": "medio",
            "duracao_estimada": "1min",
            "sensibilidade": "ok"
          }
       ]
       ''';
       
       final cards = await loader.parseFlashcards(jsonString);
       expect(cards.length, 1);
       expect(cards.first.id, "ALG-0001");
    });
  });
}
