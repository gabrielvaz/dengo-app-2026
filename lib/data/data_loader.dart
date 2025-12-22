import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:dengo_app/models/flashcard.dart';

class DataLoader {
  Future<List<Flashcard>> loadFlashcards() async {
    // This is a simplified loader that assumes all files are known.
    // In a real scenario with asset manifest, we could discover them.
    // For MVP, we list the categories we know.
    final categories = [
      'almas-gemeas',
      'casais',
      'conexao-diaria',
      'confianca',
      'crescimento',
      'desafios',
      'leve-e-divertido',
      'memorias',
      'modo-familia',
      'perguntas-profundas',
      'quentes',
      'romance',
      'voce-prefere',
    ];

    final List<Flashcard> allFlashcards = [];

    for (final category in categories) {
      try {
        final String jsonString = await rootBundle.loadString('flash-cards-data/$category.json');
        final List<Flashcard> categoryCards = await parseFlashcards(jsonString);
        allFlashcards.addAll(categoryCards);
      } catch (e) {
        // Log error or handle missing file
        print('Error loading $category: $e');
      }
    }

    return allFlashcards;
  }

  Future<List<Flashcard>> parseFlashcards(String jsonString) async {
    // Decode JSON in a separate isolate or just async if lightweight
    // Here we do it directly as the files aren't huge yet.
    final List<dynamic> jsonList = jsonDecode(jsonString);
    return jsonList.map((json) => Flashcard.fromJson(json)).toList();
  }
}
