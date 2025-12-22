# Technology Stack

The Dengo application is built with a focus on simplicity, performance, and cross-platform accessibility using React Native and Expo.

## 1. Core Framework

- **Frontend Framework:** React Native
  - **Reasoning:** Allows for efficient cross-platform development with a rich ecosystem.
- **Platform:** Expo
  - **Reasoning:** Simplifies the development workflow, build process, and testing (via Expo Go).
- **Programming Language:** TypeScript
  - **Reasoning:** Provides type safety and better developer experience for larger applications.

## 2. Data Management & Backend

- **Architecture:** Offline-First / Local-Only
  - **Reasoning:** Ensures privacy and immediate responsiveness. The app functions independently on the user's device.
- **Content Storage (Flashcards):** Local JSON Files
  - **Location:** `@flash-cards-data/**` (Bundled as assets)
  - **Structure:** Flashcard content is organized into separate JSON files by category (e.g., `almas-gemeas.json`, `casais.json`).
  - **Mechanism:** The app loads these JSON files at runtime.
- **User Data Persistence:**
  - **Tool:** `AsyncStorage` (via `@react-native-async-storage/async-storage`)
  - **Scope:** Stores user profile data (relationship stage, time together, interests) and interaction history locally.

## 3. State Management

- **Pattern:** React Context API or Zustand
  - **Reasoning:** Simple and lightweight state management sufficient for the app's complexity.

## 4. Build & Deployment

- **Target Platform:** iOS (Primary), Android (Secondary)
- **CI/CD:** Expo Application Services (EAS) for build and deployment.