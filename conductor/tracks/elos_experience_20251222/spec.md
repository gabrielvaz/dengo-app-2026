# Track Spec: Elos (Educational & Progressive Content)

## 1. Overview
"Elos" is an informational area of the app featuring short articles (2 to 5 min) organized into 8 thematic categories (each category = one Elo). It uses a progressive unlock system to encourage micro-habits of connection. The system is offline-first, loading content from local JSON files.

## 2. Functional Requirements

### 2.1 Content Management (Offline-First)
- **Source:** Local JSON files in `/dicas-data/`.
- **Structure:** Each JSON represents one Elo containing metadata (`id`, `titulo`, `descricao_curta`, `para_quem`, `objetivo`, `ordem`) and a list of `artigos`.
- **Parsing:** Article content is structured in blocks (`tipo`, `titulo`, `conteudo`).

### 2.2 Navigation & UI (Three Screens)

#### Tela 1: Elos Home (Categories List)
- Display all 8 Elos as cards.
- **Card Content:** Title, short description, "Para quem", and progress bar (X/20 completed).
- **CTA:** "Continuar" (opens the next unread article) or "Começar" (if not started).
- **Ordering:** Follows `elo.ordem`. In-progress Elos first, then unstarted, then completed.

#### Tela 2: Elo Detail (Articles List)
- **Header:** Title, objective, and "Para quem".
- **Articles List:** Progressive list showing title, reading time, and status (unread/read).
- **Highlight:** "Next Recommended" article should be visually distinct.

#### Tela 3: Article Reader
- **Header:** Title, subtitle, and reading time chip.
- **Body:** Render blocks with proper hierarchy. No emojis in the text.
- **Mandatory Footer Sections:**
  - "O que você aprendeu" (list).
  - "Como exercitar" (list).
- **Actions:** 
  - Toggle "Read/Complete".
  - Toggle "Favorite" (Save).
  - Share (Text only: Title + Bullets from "What you learned" + 1 Exercise).

### 2.3 Progress & Persistence
- **Storage:** Use local storage (MVP: `SharedPreferences`) with prefix `elos_`.
- **Tracking:** 
  - `elos_read_<eloId>`: List of read article IDs.
  - `elos_last_<eloId>`: ID of the last opened article.
  - `elos_fav`: Global list of favorite article IDs.
- **Completion:** An Elo is "Completed" when all articles are marked as read.

## 3. Technical Requirements
- **Framework:** Flutter (iOS-first).
- **Assets:** Include `dicas-data/` in `pubspec.yaml`.
- **Sharing:** Use `share_plus` plugin.
- **Typography:** Scalable fonts (Dynamic Type) and high contrast.
- **Error Handling:** Graceful fallback if JSON parsing fails.

## 4. Implementation Prompt
The implementation should follow the detailed prompt provided in the request, ensuring clean architecture in `lib/features/elos/` and separation of data, models, state, and UI.
