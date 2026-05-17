import { create } from 'zustand';

import { browserApiService } from '../../services/browserApi';
import { rebuildLayout, updateFolderPositions } from '../../services/columnLayoutService';
import { storageService } from '../../services/storageService';
import type { DragItem, FolderColumnsType, FolderItem, FolderStateType } from '../../types';

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
        const { folderColumns: prevColumns } = get();
        const draggedFolder: FolderItem | undefined =
            prevColumns[dragItem.sourceCol]?.[dragItem.sourceIndex];

        if (!draggedFolder) {
            console.error('could not find dragged folder', dragItem);
            return;
        }

        if (targetCol === dragItem.sourceCol) {
            const actualTargetIndex =
                targetIndex > dragItem.sourceIndex ? targetIndex - 1 : targetIndex;
            if (actualTargetIndex === dragItem.sourceIndex) {
                return;
            }
        }

        const newColumns: FolderColumnsType = prevColumns.map((column, index) => {
            if (targetCol !== -1 && index !== dragItem.sourceCol && index !== targetCol) {
                return column;
            }
            return [...column];
        });

        newColumns[dragItem.sourceCol].splice(dragItem.sourceIndex, 1);

        let adjustedTargetIndex = targetIndex;
        if (targetCol === -1) {
            if (newColumns[dragItem.sourceCol].length === 0) {
                newColumns.splice(dragItem.sourceCol, 1);
                if (adjustedTargetIndex > dragItem.sourceCol) {
                    adjustedTargetIndex = adjustedTargetIndex - 1;
                }
            }
            newColumns.splice(adjustedTargetIndex, 0, [draggedFolder]);
        } else {
            const finalTargetIndex =
                dragItem.sourceCol === targetCol && adjustedTargetIndex > dragItem.sourceIndex
                    ? adjustedTargetIndex - 1
                    : adjustedTargetIndex;
            newColumns[targetCol].splice(finalTargetIndex, 0, draggedFolder);

            if (newColumns[dragItem.sourceCol].length === 0) {
                newColumns.splice(dragItem.sourceCol, 1);
            }
        }

        set({ folderColumns: newColumns });

        setTimeout(() => {
            set((state) => ({
                folderState: updateFolderPositions(newColumns, state.folderState),
            }));
        }, 0);
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
