class Flashcard {
  final String id;
  final String category;
  final String title;
  final String question;
  final List<String> relationshipStage;
  final List<String> relationshipTime;
  final List<String> needs;
  final List<String> secondaryCategories;
  final String level;
  final String estimatedDuration;
  final String sensitivity;

  Flashcard({
    required this.id,
    required this.category,
    required this.title,
    required this.question,
    required this.relationshipStage,
    required this.relationshipTime,
    required this.needs,
    required this.secondaryCategories,
    required this.level,
    required this.estimatedDuration,
    required this.sensitivity,
  });

  factory Flashcard.fromJson(Map<String, dynamic> json) {
    return Flashcard(
      id: json['id'] as String,
      category: json['categoria_principal'] as String,
      title: json['titulo_curto'] as String,
      question: json['pergunta'] as String,
      relationshipStage: List<String>.from(json['relationship_stage']),
      relationshipTime: List<String>.from(json['relationship_time']),
      needs: List<String>.from(json['needs']),
      secondaryCategories: List<String>.from(json['secondary_categories']),
      level: json['nivel'] as String,
      estimatedDuration: json['duracao_estimada'] as String,
      sensitivity: json['sensibilidade'] as String,
    );
  }
}
