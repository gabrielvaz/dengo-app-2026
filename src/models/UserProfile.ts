export interface UserProfile {
  name?: string;
  birthday?: string;
  relationshipStage: string;
  relationshipTime: string;
  needs: string[];
  notificationTime?: string; // e.g. "20:00"
  notificationsEnabled?: boolean;
}
