import { create } from 'zustand';

import { browserApiService } from '@/lib/browser';
import { storageService } from '@/lib/storage';

import { reorderColumnsByDrop } from './dragDrop';
import { rebuildLayout, updateFolderPositions } from './layout';
import type { DragItem, FolderColumnsType, FolderStateType } from './types';

const FOLDER_STATE_KEY = 'folderState';

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

export const useBookmarksStore = create<BookmarksState & BookmarksActions>((set, get) => ({
    folderColumns: [],
    folderState: {},
    error: null,
    hasLoaded: false,
    isFolderStateHydrated: false,

    hydrateFolderState: async () => {
        if (get().isFolderStateHydrated) return;
        try {
            const saved = await storageService.loadConfig<FolderStateType>(FOLDER_STATE_KEY, {});
            set({ folderState: saved, isFolderStateHydrated: true });
        } catch (error) {
            console.error('Failed to hydrate folder state:', error);
            set({ isFolderStateHydrated: true });
        }
    },

    loadBookmarks: async ({ topSitesNum, recentlyClosedNum, hiddenFolders, forceReload }) => {
        const { hasLoaded, isFolderStateHydrated } = get();
        if (hasLoaded && !forceReload) return;
        if (!isFolderStateHydrated) {
            await get().hydrateFolderState();
        }

        try {
            set({ error: null });
            const allFolders = await browserApiService.getAllFolders(
                topSitesNum,
                recentlyClosedNum,
            );
            const displayFolders = allFolders.filter(
                (folder) => !hiddenFolders.includes(folder.id),
            );
            const columns = rebuildLayout(displayFolders, get().folderState);
            set({ folderColumns: columns, hasLoaded: true });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'load data failed',
                hasLoaded: true,
            });
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
    storageService.saveConfig(FOLDER_STATE_KEY, state.folderState).catch((error) => {
        console.error('Failed to save folder state:', error);
    });
});
