
import 'package:flutter_test/flutter_test.dart';
import 'package:dengo_app/models/flashcard.dart';
import 'package:dengo_app/models/user_profile.dart';

void main() {
  group('Flashcard Model', () {
    test('should create a Flashcard from JSON', () {
      final json = {
        "id": "ALG-0001",
        "categoria_principal": "Almas Gêmeas",
        "titulo_curto": "Tema: nossos valores em comum",
        "pergunta": "Em nossos valores em comum, onde você sente que a gente combina de verdade?",
        "relationship_stage": ["se-conhecendo"],
        "relationship_time": ["menos-de-6-meses"],
        "needs": ["aprofundar-intimidade", "conhecer-melhor"],
        "secondary_categories": ["Conexão Diária"],
        "nivel": "medio",
        "duracao_estimada": "1min",
        "sensibilidade": "ok"
      };

      final flashcard = Flashcard.fromJson(json);

      expect(flashcard.id, "ALG-0001");
      expect(flashcard.category, "Almas Gêmeas");
      expect(flashcard.title, "Tema: nossos valores em comum");
      expect(flashcard.question, "Em nossos valores em comum, onde você sente que a gente combina de verdade?");
      expect(flashcard.relationshipStage, ["se-conhecendo"]);
      expect(flashcard.relationshipTime, ["menos-de-6-meses"]);
      expect(flashcard.needs, ["aprofundar-intimidade", "conhecer-melhor"]);
      expect(flashcard.secondaryCategories, ["Conexão Diária"]);
      expect(flashcard.level, "medio");
      expect(flashcard.estimatedDuration, "1min");
      expect(flashcard.sensitivity, "ok");
    });
  });

  group('UserProfile Model', () {
    test('should create a UserProfile', () {
      final profile = UserProfile(
        relationshipStage: 'namorando',
        relationshipTime: '6-meses-a-2-anos',
        needs: ['conhecer-melhor'],
      );

      expect(profile.relationshipStage, 'namorando');
      expect(profile.relationshipTime, '6-meses-a-2-anos');
      expect(profile.needs, ['conhecer-melhor']);
    });

    test('should be compatible with JSON', () {
       final profile = UserProfile(
        relationshipStage: 'casados',
        relationshipTime: '5-a-10-anos',
        needs: ['conexao-emocional'],
      );
      
      final json = profile.toJson();
      expect(json['relationshipStage'], 'casados');
      expect(json['relationshipTime'], '5-a-10-anos');
      expect(json['needs'], ['conexao-emocional']);

      final fromJson = UserProfile.fromJson(json);
      expect(fromJson.relationshipStage, profile.relationshipStage);
    });
  });
}
