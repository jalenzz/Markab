# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Markab is a Chrome Manifest V3 extension that replaces the new-tab page with a flat, multi-column bookmark grid. The app runs in the new-tab context (`chrome_url_overrides.newtab` in `manifest.config.ts`) and uses the `bookmarks`, `topSites`, `sessions`, `tabs`, `history`, `favicon`, `storage`, and `search` Chrome permissions. There is no backend; all state lives in `chrome.storage.local` (with `localStorage` fallback for `bun run dev` outside the extension host).

Package manager: **bun** (see `bun.lock`).

## Commands

```bash
bun install          # install dependencies
bun run dev          # vite dev server; load dist/ as unpacked extension to test in Chrome
bun run build        # tsc -b && vite build; also packs release/crx-markab-<version>.zip
bun run build:analyze # same + rollup-plugin-visualizer (writes dist/stats.html)
bun run preview      # preview built bundle
bun run type-check   # tsc --noEmit (strict, noUnusedLocals/Parameters)
bun run lint         # eslint . && stylelint "src/**/*.{css,scss,less}"
bun run lint:fix     # eslint --fix, stylelint --fix, then prettier --write .
bun run format       # prettier --write .
```

There is **no test framework** configured. Don't claim something is "verified" by running tests — verify with `bun run type-check && bun run lint` and by manually loading the unpacked `dist/` in Chrome.

ESLint enforces `simple-import-sort/imports` as an error — if you hand-edit imports, run `bun run lint:fix` before committing. Stylelint only runs on `.css/.scss/.less`; `.ts/.tsx` are explicitly ignored.

## Architecture

### Directory layout

- `src/features/<name>/` — self-contained domain. Each feature owns: `components/`, `hooks/`, `store.ts`, `types.ts`, plus domain logic files (e.g. `layout.ts`, `searchUtils.ts`, `schema.ts`, `dragDrop.ts`, `keyboardActions.ts`, `utils.ts`).
- `src/lib/` — React-agnostic infrastructure: `browser.ts` (Chrome API wrapper), `storage.ts` (the `storageService` singleton over `chrome.storage.local`), `constants.ts` (magic IDs like `TOPSITE_FOLDER_ID`).
- `src/shared/` — cross-feature UI primitives (`animations.ts`, generic hooks like `useModal`).
- `src/app/` — app-framework-level shells (currently just `ErrorBoundary`).

**Import paths**: relative (`./store`, `../types`) within the same feature; `@/...` alias (= `src/*`) when crossing feature/lib/shared boundaries. Cross-feature types are imported from the owning feature's `types.ts` — don't reintroduce a global `src/types/` directory.

### State management — single Zustand store per feature

Three stores: `useSettingsStore` (`features/settings/store.ts`), `useBookmarksStore` (`features/bookmarks/store.ts`), `useSearchStore` (`features/search/store.ts`).

**Critical rule**: a hook MUST NOT call another store's hook. When one feature needs another's data, read it synchronously inside an action via `useOtherStore.getState()`. See `useSearchStore.updateQuery` — it reads `useBookmarksStore.getState().folderColumns` and `useSettingsStore.getState().settings.searchEngines` inline. This pattern was introduced specifically to kill a stale-state bug where `useSearch()` and `BookmarkGrid` mounted independent copies of `useBookmarks()` and the search saw pre-drag data.

Components select directly: `useFooStore((s) => s.x)`. No hook adapter layer.

### Persistence pattern

Storage keys live in each store module (e.g. `FOLDER_STATE_KEY = 'folderState'`, `STORAGE_KEY = 'appSettings'`). Two pieces:

1. **Hydrate on startup** — either a top-level `useFooStore.getState().hydrate()` call (settings does this) or a `hydrate*` action invoked on demand (bookmarks). Components gate rendering on `isInitialized` / `isFolderStateHydrated`.
2. **Subscribe-to-write** — each store has a module-level `useFooStore.subscribe((state) => ...)` that diffs against a `lastPersisted*` reference and calls `storageService.saveConfig(...)`. Skipped until hydration completes to avoid clobbering saved data with defaults.

**Don't call `storageService` from components.** Add a field to a store, hydrate it, let the subscribe-write handle persistence.

### Data model nuances

- `getAllFolders` (in `lib/browser.ts`) merges three sources: real bookmark folders (recursive walk of `chrome.bookmarks.getTree`), a synthetic "Most Visited" folder from `chrome.topSites`, and a synthetic "Recently Closed" folder from `chrome.sessions`. The synthetic folders use IDs/prefixes from `lib/constants.ts` (`TOPSITE_FOLDER_ID`, `RECENT_FOLDER_ID`, etc.); guard for these when adding folder-aware logic.
- Recently-closed windows (multi-tab sessions) carry an `action` callback instead of a plain URL — opening them calls `chrome.sessions.restore`. Code that opens a bookmark must check `item.action` first (see `useSearchStore.openItem`).
- Layout state is two-layered: `folderColumns: FolderItem[][]` is the rendered 2D grid; `folderState: Record<id, { columnIndex, indexInColumn, isExpanded, emoji }>` is the persisted source-of-truth keyed by folder ID. `rebuildLayout` in `features/bookmarks/layout.ts` reconstructs columns from `folderState`, smart-distributing any folders that have no saved position.

### Build & extension specifics

- `@crxjs/vite-plugin` consumes `manifest.config.ts` and produces an MV3-compliant bundle in `dist/`. `vite-plugin-zip-pack` zips it into `release/`.
- Manual chunk splits in `vite.config.ts`: `pinyin` (pinyin-pro for CJK search matching), `emoji` (@emoji-mart), `motion` (framer/motion), `vendor` (everything else).
- The DnD provider lives at the App root (`react-dnd` + `HTML5Backend`) — drag interactions for folders are wired through `features/bookmarks/dragDrop.ts`.
- Tailwind 3.4 + a small `src/index.css` with CSS variables driven by `useSettingsEffects` (theme attribute, `--font-size-*`, `--font-family-primary`).

## Working with the codebase

- Keep new features inside an existing feature when possible. Spin up a new `src/features/<name>/` directory only when the capability is genuinely independent.
- New persistence: add field to store → hydrate it → subscribe-to-write. Don't break the pattern.
- New cross-feature reads: use `getState()` inside an action, not a hook inside a hook.
