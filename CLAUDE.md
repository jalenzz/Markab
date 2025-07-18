# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Markab is a Chrome extension that replaces the new tab page with an elegant bookmark display. It shows all bookmark folders in a multi-column layout with drag-and-drop reordering, animated emojis, and customizable settings.

## Key Architecture

### Core Components

- **Browser Extension**: Chrome extension using Manifest V3
- **React App**: Built with Vite, React 19, TypeScript
- **Chrome APIs**: Uses bookmarks, topSites, history, sessions, tabs, storage APIs
- **Drag & Drop**: react-dnd for folder reordering
- **State Management**: Custom hooks with Immer for immutable updates

### Data Flow

1. `browserApiService` fetches bookmarks, top sites, and recently closed tabs
2. `useBookmarks` hook manages folder state and layout
3. `columnLayoutService` handles intelligent column distribution
4. `storageService` persists user settings and folder positions

### Key Files

- `src/services/browserApi.ts:128` - Main data fetching logic
- `src/services/columnLayoutService.ts:126` - Layout algorithms
- `src/hooks/useBookmarks.ts:8` - Bookmark state management
- `src/types/index.ts:1` - TypeScript definitions
- `src/config.ts:35` - Default settings and configuration

## Development Commands

### Setup & Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Build with bundle analysis
bun run build:analyze
```

### Code Quality

```bash
# Run linting (ESLint + Stylelint)
bun run lint

# Auto-fix linting issues
bun run lint:fix

# Format code with Prettier
bun run format

# Type checking
bun run type-check
```

### Testing & Preview

```bash
# Preview production build
bun run preview
```

## Extension Structure

### Chrome Extension Files

- `manifest.config.ts` - Extension manifest (V3)
- `public/` - Extension assets (icons, favicon)
- `dist/` - Built extension files
- `release/` - Packaged extension ZIP files

### Key Services

- **browserApiService**: Chrome API wrapper for bookmarks, topSites, sessions
- **columnLayoutService**: Smart column distribution and position management
- **storageService**: Chrome storage persistence for settings and layout

### React Components

- **BookmarkGrid**: Main grid layout container
- **BookmarkFolder**: Individual folder with expandable bookmarks
- **SettingsPanel**: Configuration UI with controls
- **Drag/Drop**: react-dnd integration for folder reordering

## Configuration & Settings

### Settings Schema (`src/config.ts:35`)

- Theme: auto/light/dark
- Font family & size
- Max top sites & recent tabs count
- Layout lock toggle
- Link open behavior (current/new tab)
- Hidden folders management

### Storage Keys

- `folderState`: Folder positions, expand states, emojis
- `appSettings`: User preferences and configuration

## Development Notes

### Chrome Extension Development

- Extension runs as new tab override (`chrome_url_overrides.newtab`)
- Requires permissions: storage, bookmarks, topSites, history, sessions, favicon, tabs
- Uses dynamic favicon URLs for bookmark icons

### Layout Algorithm

- Smart column distribution based on folder count
- Preserves user drag-and-drop positions
- Handles empty columns and folder filtering
- Responsive grid with configurable column counts

### Performance Considerations

- Debounced state persistence
- Optimized re-renders with React hooks
- Bundle analysis available via `ANALYZE=true` flag
