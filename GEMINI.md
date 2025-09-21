# GEMINI.md

## Project Overview

This project is a browser extension that replaces the new tab page with a customizable bookmark manager. It supports both Chrome and Firefox. It's designed to provide a clean and elegant way to display and organize bookmarks. The extension is built with React, TypeScript, and Vite, and it uses Tailwind CSS for styling.

The core functionality of the extension is to display a user's bookmarks in a grid layout. Users can customize the layout by dragging and dropping bookmark folders, and they can also expand and collapse folders to show or hide their contents. The extension also includes a search feature that allows users to quickly find bookmarks.

The extension's state is managed using React Hooks and the Context API. The `useBookmarks` hook is responsible for loading and managing the user's bookmarks, while the `useSettings` hook is responsible for managing the extension's settings. The extension's data is stored in the browser's local storage using the `storageService`.

## Building and Running

To build and run the project, you'll need to have `bun` installed.

**Development:**

To start the development server, run the following command. This will start a development server for the Chrome version of the extension.

```bash
bun run dev
```

**Building:**

The project can be built for both Chrome and Firefox. The following commands will generate a zip file for each browser in the `release` directory.

*   **Build for Chrome:**

    ```bash
    bun run build:chrome
    ```

*   **Build for Firefox:**

    ```bash
    bun run build:firefox
    ```

*   **Build for both:**

    ```bash
    bun run build
    ```

**Testing:**

The project does not have a dedicated test suite, but it does have a linting and type-checking process. To run the linter and type-checker, run the following commands:

```bash
bun run lint
bun run type-check
```

## Development Conventions

*   **Package Manager:** The project uses `bun` as the package manager.
*   **Code Style:** The project uses Prettier for code formatting and ESLint for linting.
*   **Component Structure:** The project's components are organized by feature in the `src/components` directory.
*   **State Management:** The project uses React Hooks and the Context API for state management.
*   **Browser APIs:** The project uses the `webextension-polyfill` library to interact with browser APIs. This allows the extension to work on both Chrome and Firefox using the `browser` namespace.
*   **Drag and Drop:** The project uses `react-dnd` for drag and drop functionality.