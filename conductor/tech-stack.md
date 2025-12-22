# Technology Stack

The Dengo application is built with a focus on simplicity, performance, and offline-first capabilities, ensuring a seamless user experience without the need for complex backend infrastructure for the MVP.

## 1. Core Framework

- **Frontend Framework:** Flutter
  - **Reasoning:** Enables high-performance, cross-platform development (iOS-first) with a single codebase, providing a fluid and native-like feel.
- **Programming Language:** Dart
  - **Reasoning:** The native language of Flutter, optimized for UI development and fast execution.

## 2. Data Management & Backend

- **Architecture:** Offline-First / Local-Only
  - **Reasoning:** Ensures privacy and immediate responsiveness. The app functions independently on the user's device.
- **Content Storage (Flashcards):** Local JSON Files
  - **Location:** `@flash-cards-data/**`
  - **Structure:** Flashcard content is organized into separate JSON files by category (e.g., `almas-gemeas.json`, `casais.json`).
  - **Mechanism:** The app parses these JSON files at runtime to load content based on the user's profile and preferences.
- **User Data Persistence:**
  - **Tool:** `shared_preferences` (for simple flags/settings) or `sqflite` (if more complex relational data is needed later).
  - **Scope:** Stores user profile data (relationship stage, time together, interests) and interaction history locally.

## 3. State Management

- **Pattern:** BLoC (Business Logic Component) or Provider
  - **Reasoning:** Standard, robust patterns for managing the application state, particularly for handling the flow of flashcards and user profile updates.

## 4. Build & Deployment

- **Target Platform:** iOS (Primary), Android (Secondary)
- **CI/CD:** Basic local build scripts for the MVP phase.
