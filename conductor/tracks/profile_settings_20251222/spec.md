# Track Spec: Profile & Settings

## 1. Overview
The Profile module serves as the control center for the user experience in Dengo. It allows users to personalize their journey by updating relationship details, managing interests/needs, and controlling their data. It is the tactical hub for the "User Preference" loop.

## 2. Functional Requirements

### 2.1 Profile Editing
- **Relationship Details:** 
  - Change Relationship Type (e.g., Namoro, Casamento).
  - Update "Time Together" (Duration).
- **Interests & Needs:** 
  - Manage a list of tags that reflect the couple's current focuses (e.g., "Melhorar Comunicação", "Mais Intimidade", "Sair da Rotina").
  - These tags should dynamically filter content in the "Feed" and "Elos" modules.

### 2.2 Preferences & Notifications
- **Notification Management:** 
  - Toggle for "Daily Ritual" reminders (Streaks).
  - Toggle for "Contextual Tips" (Elo suggestions).
  - Time selection for the daily reminder.

### 2.3 Data Management (The "Reset" Loop)
- **Clear Data:** 
  - A high-visibility button to delete all local progress.
  - **Action:** Clears `shared_preferences` (Streaks, Elos progress, Favorites, Onboarding data).
  - **Security:** Requires a confirmation dialog ("Are you sure? This cannot be undone").
- **App Version & Support:** 
  - Display current app version.
  - Links to Privacy Policy and Terms of Use.

## 3. UI/UX Requirements
- **Access:** A dedicated "Perfil" tab in the Bottom Navigation.
- **Visual Style:** Clean, organized in sections (Grouping related settings).
- **Interactions:** 
  - Use Modal Bottom Sheets for multi-choice selections (e.g., changing relationship type).
  - Toggle switches for notifications.
  - "Warning" style for the Clear Data action (Red text/background).

## 4. Technical Implementation
- **Data Model:** `UserSettings` object stored in `shared_preferences`.
- **Syncing:** When interests are updated, the `CardFeedController` and `ElosController` must be notified to refresh their filters.
- **Persistence Chaves:**
  - `profile_relationship_type`
  - `profile_time_together`
  - `profile_interests` (List<String>)
  - `settings_notifications_enabled` (Bool)

## 5. Success Criteria
- User can change their profile info and see matching content in the feed.
- "Clear Data" successfully resets the app to the first-run (onboarding) state.
- Notification settings effectively silence/enable local triggers.
