import { create } from 'zustand';

import { browserApiService } from '@/lib/browser';
import { STORAGE_KEYS } from '@/lib/constants';
import { storageService } from '@/lib/storage';

import { reorderColumnsByDrop } from './dragDrop';
import { rebuildLayout, updateFolderPositions } from './layout';
import type { DragItem, FolderColumnsType, FolderStateType } from './types';

interface BookmarksState {
    folderColumns: FolderColumnsType;
    folderState: FolderStateType;
    error: string | null;
    hasLoaded: boolean;
    isFolderStateHydrated: boolean;
}

interface BookmarksActions {
    loadBookmarks: (params: {
        topSitesNum: number;
        recentlyClosedNum: number;
        hiddenFolders: string[];
        forceReload?: boolean;
    }) => Promise<void>;
    toggleFolderExpanded: (folderId: string) => void;
    setFolderEmoji: (folderId: string, emoji: string) => void;
    dropFolder: (dragItem: DragItem, targetCol: number, targetIndex: number) => void;
    hydrateFolderState: () => Promise<void>;
}

let inflightLoad: Promise<void> | null = null;
// Monotonic load version: only the most recent load commits results; superseded loads are discarded.
let loadVersion = 0;
// Abort the previous in-flight load when a forceReload supersedes it.
let currentAbortController: AbortController | null = null;

export const useBookmarksStore = create<BookmarksState & BookmarksActions>((set, get) => ({
    folderColumns: [],
    folderState: {},
    error: null,
    hasLoaded: false,
    isFolderStateHydrated: false,

    hydrateFolderState: async () => {
        if (get().isFolderStateHydrated) return;
        try {
            const saved = await storageService.loadConfig<FolderStateType>(
                STORAGE_KEYS.FOLDER_STATE,
                {},
            );
            set({ folderState: saved, isFolderStateHydrated: true });
        } catch (error) {
            console.error('Failed to hydrate folder state:', error);
            set({ isFolderStateHydrated: true });
        }
    },

    loadBookmarks: async ({ topSitesNum, recentlyClosedNum, hiddenFolders, forceReload }) => {
        const myVersion = ++loadVersion;

        if (forceReload && currentAbortController) {
            currentAbortController.abort();
        }

        if (inflightLoad && !forceReload) {
            await inflightLoad;
            return;
        }

        const { hasLoaded, isFolderStateHydrated } = get();
        if (hasLoaded && !forceReload) return;
        if (!isFolderStateHydrated) {
            await get().hydrateFolderState();
        }

        const controller = new AbortController();
        currentAbortController = controller;

        const load = (async () => {
            try {
                if (myVersion === loadVersion) set({ error: null });
                const allFolders = await browserApiService.getAllFolders(
                    topSitesNum,
                    recentlyClosedNum,
                    controller.signal,
                );
                const displayFolders = allFolders.filter(
                    (folder) => !hiddenFolders.includes(folder.id),
                );
                const columns = rebuildLayout(displayFolders, get().folderState);
                if (myVersion === loadVersion) {
                    set({ folderColumns: columns, hasLoaded: true });
                }
            } catch (err) {
                if ((err as Error)?.name === 'AbortError') return;
                if (myVersion === loadVersion) {
                    set({
                        error: err instanceof Error ? err.message : 'load data failed',
                        hasLoaded: true,
                    });
                }
            }
        })();

        inflightLoad = load;
        try {
            await load;
        } finally {
            if (inflightLoad === load) {
                inflightLoad = null;
            }
            if (currentAbortController === controller) {
                currentAbortController = null;
            }
        }
    },

    toggleFolderExpanded: (folderId) => {
        set((state) => {
            const current = state.folderState[folderId] || {};
            return {
                folderState: {
                    ...state.folderState,
                    [folderId]: { ...current, isExpanded: !current.isExpanded },
                },
            };
        });
    },

    setFolderEmoji: (folderId, emoji) => {
        set((state) => {
            const current = state.folderState[folderId] || {};
            return {
                folderState: {
                    ...state.folderState,
                    [folderId]: { ...current, emoji },
                },
            };
        });
    },

    dropFolder: (dragItem, targetCol, targetIndex) => {
        const newColumns = reorderColumnsByDrop(
            get().folderColumns,
            dragItem,
            targetCol,
            targetIndex,
        );
        if (!newColumns) return;

        set((state) => ({
            folderColumns: newColumns,
            folderState: updateFolderPositions(newColumns, state.folderState),
        }));
    },
}));

let lastPersistedFolderState: FolderStateType | null = null;
useBookmarksStore.subscribe((state) => {
    if (!state.isFolderStateHydrated) return;
    if (state.folderState === lastPersistedFolderState) return;
    lastPersistedFolderState = state.folderState;
    storageService.saveConfig(STORAGE_KEYS.FOLDER_STATE, state.folderState).catch((error) => {
        console.error('Failed to save folder state:', error);
    });
});
