# Track Spec: Streaks & Retention System

## 1. Overview
This track focuses on maximizing user retention and LTV (Lifetime Value) by transforming the daily flashcard ritual into a gamified habit. The goal is to create a "Growth Loop" where consistency is rewarded with new content, status (badges), and external triggers (WhatsApp/Push).

## 2. Functional Requirements

### 2.1 The Streak Logic (Daily Ritual)
- **Activation:** A streak day is counted when the user completes at least **1 flashcard swipe**.
- **Persistence:** Store `lastInteractionDate`, `currentStreak`, and `bestStreak` locally.
- **Rescue Mission (Recovery Loop):** 
  - If a streak is broken, the first access after the break offers a "Rescue Mission" (a special card from the "Reconnection" category).
  - Completing the rescue mission restores the streak.
  - Limit: Once every 7 days.

### 2.2 Progression & Rewards (Staking Loop)
- **Weekly Badges:** Unlock a new badge every 7 days of consecutive use.
- **Category Unlocks (Variable Reward):**
  - App starts with **4 core categories**.
  - 1 week streak (7 days): Unlock "Deep Questions".
  - 2 week streak (14 days): Unlock "Spicy/Hot" category.
  - 3 week streak (21 days): Unlock "Future Plans".
  - Continuous unlocks for every week of consistency.

### 2.3 Remanufactured Flows (External Hooks)
- **WhatsApp Share:** 
  - Button on each card to share text via WhatsApp to the partner.
  - Template: "Oi amor! Vi esse card no Dengo e lembrei de você: [Pergunta] — O que você acha? ❤️"
- **Contextual Push Notifications:**
  - **Fri 8PM:** Focus on "Romance/Intimacy".
  - **Sat 10AM:** Focus on "Fun/Adventure".
  - **Sun 7PM:** Focus on "Support/Future".
  - **Streak Reminder:** Daily at 9PM if the ritual hasn't been completed.

## 3. Technical Implementation
- **Data Model:** `UserStats` stored via `AsyncStorage`.
- **Notification Engine:** `expo-notifications` for local scheduling.
- **UI:** 
  - New "Journey" or "Streaks" tab in the bottom navigation.
  - Progress bar or badge display showing distance to next unlock.

## 4. Success Criteria
- Increase in Day 7 and Day 30 retention.
- Usage of the WhatsApp share feature.
- Activation of newly unlocked categories.
