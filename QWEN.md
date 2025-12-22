# Dengo Application Context

## Project Overview

The Dengo application is a mobile app designed to strengthen emotional connections between couples through interactive flashcards. The app aims to create daily rituals of connection with short, intentional, and emotionally meaningful interactions.

### Key Information:
- **Project Name:** Dengo
- **Purpose:** Mobile app for strengthening emotional connections between couples
- **Current Implementation:** React Native/Expo (though documentation suggests initial plan was Flutter)
- **Target Platforms:** iOS-first, with Android support
- **Architecture:** Offline-first/local-only approach with JSON-based content storage

### Project Structure:
- `/conductor/` - Project management and documentation (product specs, workflow, tech stack, etc.)
- `/dengo/` - Main React Native/Expo application
- `/flash-cards-data/` - JSON files containing flashcard content organized by categories
- `/specs/` - Specifications and requirements

### Technology Stack (Actual Implementation):
- **Framework:** React Native with Expo
- **Language:** TypeScript
- **State Management:** Likely React hooks/context (to be implemented)
- **Build Tool:** Expo CLI
- **Data Storage:** Local JSON files for flashcard content, AsyncStorage for user data
- **Navigation:** React Navigation

Note: There's a discrepancy between the documented tech stack (which mentions Flutter) and the actual implementation (React Native/Expo).

## Building and Running

### Prerequisites:
- Node.js (recommended version can be inferred from package.json)
- Expo CLI or Expo Go app on mobile device

### Setup Commands:
```bash
cd dengo
npm install  # Install dependencies
```

### Development Commands:
```bash
# Start development server
npm start
# Or use Expo CLI directly
npx expo start

# For specific platforms
npm run android  # Launch on Android emulator/device
npm run ios      # Launch on iOS simulator/device  
npm run web      # Launch on web browser
```

### Project Workflow:
The project follows a specific workflow documented in `conductor/workflow.md` that emphasizes:
- Test-driven development (TDD)
- High code coverage (>80%)
- Strict task tracking in plan.md
- Git notes for task summaries
- Quality gates before completion

## Development Conventions

### Code Structure (Expected):
Based on the directory structure in `/dengo/src/`, the planned structure includes:
- `/app` - Main application screens and containers
- `/components` - Reusable UI components
- `/features` - Feature-specific code organized by domain
- `/navigation` - Navigation and routing logic
- `/storage` - Data persistence layer
- `/theme` - Styling and theming

### Flashcard Data Structure:
Located in `/flash-cards-data/`, contains JSON files with structured flashcard content:
- Each card has ID, category, question, relationship stage, timing parameters
- Organized by themes (Casais, Almas Gêmeas, Conexão Diária, etc.)
- Includes metadata like sensitivity level, duration, and relationship stage appropriateness

### Style Guidelines:
- TypeScript/JavaScript best practices
- React Native/Expo patterns
- Component-based architecture
- Accessibility considerations
- Mobile-first responsive design

### Testing Approach:
- Unit tests with >80% coverage requirement
- Test-driven development methodology
- Integration tests for user flows
- Mobile-specific testing (touch targets, performance, etc.)

## Current Status

Based on the `setup_state.json` file, the project is in early stages with `"last_successful_step": "3.3_initial_track_generated"`. The React Native app structure exists but appears to have minimal implementation beyond the basic Expo template (just App.tsx and index.ts with empty directories in src/).

The flashcard content is already prepared in JSON format in the `flash-cards-data` directory, suggesting content preparation happened before app development began.