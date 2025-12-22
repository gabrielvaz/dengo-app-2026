# Track Spec: Core Experience (Onboarding & Feed)

## 1. Overview
This track focuses on the foundational user journey of Dengo: setting up a relationship profile and engaging with the daily ritual of interactive flashcards.

## 2. Functional Requirements

### 2.1 User Onboarding (Profile Setup)
- **Profile Data Collection:**
  - Relationship Type (e.g., namorando, casados, noivados).
  - Time Together (e.g., menos-de-6-meses, 6-meses-a-2-anos, etc.).
  - User Interests/Needs (Selectable tags matching JSON `needs` field).
- **Data Persistence:** Save profile data locally using `shared_preferences`.
- **Visual Tone:** Elegant, intimate, and welcoming (as per product-guidelines.md).

### 2.2 Daily Flashcard Feed
- **Interface:** A focused, distraction-free view featuring one card at a time.
- **Interaction:** Swipe gesture to advance or skip cards.
- **Content Loading:**
  - Parse local JSON files from `@flash-cards-data/`.
  - Filter cards based on the saved user profile (`relationship_stage`, `relationship_time`, `needs`).
- **Ritual Logic:** Present a limited set of cards daily to prevent "binge" consumption and encourage conversation.

## 3. Technical Requirements
- **Framework:** Flutter (iOS-first).
- **State Management:** Provider or BLoC for profile and feed state.
- **Storage:** `shared_preferences` for profile; `rootBundle` for loading JSON assets.
- **UI Components:** Custom swipeable card widget with smooth transitions.

## 4. Success Criteria
- User can complete onboarding and have their profile saved.
- Feed loads cards that match the user's specific relationship profile.
- Swiping interaction is fluid and aligns with the "Elegant & Intimate" tone.
