export interface UserProfile {
  name?: string;
  birthday?: string;
  relationshipStage: string;
  relationshipTime: string;
  needs: string[];
  notificationTime?: string[]; // e.g. ["smart", "20:00"]
  notificationsEnabled?: boolean;
  completedCategoryIds?: string[]; // Persistent history of completed categories
}
