class UserProfile {
  final String relationshipStage;
  final String relationshipTime;
  final List<String> needs;

  UserProfile({
    required this.relationshipStage,
    required this.relationshipTime,
    required this.needs,
  });

  Map<String, dynamic> toJson() {
    return {
      'relationshipStage': relationshipStage,
      'relationshipTime': relationshipTime,
      'needs': needs,
    };
  }

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      relationshipStage: json['relationshipStage'] as String,
      relationshipTime: json['relationshipTime'] as String,
      needs: List<String>.from(json['needs']),
    );
  }
}
