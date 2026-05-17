import { create } from 'zustand';

import type { SearchResult } from '../../types';
import { createSearchResults, flattenBookmarks } from '../../utils/searchUtils';
import { useBookmarksStore } from '../bookmarks/store';
import { useSettingsStore } from '../settings/store';

interface SearchState {
    isActive: boolean;
    query: string;
    selectedIndex: number;
    results: SearchResult[];
}

interface SearchActions {
    activate: () => void;
    deactivate: () => void;
    updateQuery: (query: string) => void;
    selectPrevious: () => void;
    selectNext: () => void;
    setSelectedIndex: (index: number) => void;
    openItem: (item: SearchResult) => Promise<void>;
    openSelected: () => Promise<void>;
}

const INITIAL_STATE: SearchState = {
    isActive: false,
    query: '',
    selectedIndex: 0,
    results: [],
};

export const useSearchStore = create<SearchState & SearchActions>((set, get) => ({
    ...INITIAL_STATE,

    activate: () => {
        set({ ...INITIAL_STATE, isActive: true });
    },

    deactivate: () => {
        set({ ...INITIAL_STATE });
    },

    updateQuery: (query) => {
        const { folderColumns } = useBookmarksStore.getState();
        const { searchEngines } = useSettingsStore.getState().settings;
        const allBookmarks = flattenBookmarks(folderColumns.flat());
        const results = createSearchResults(allBookmarks, query, searchEngines);
        set({ query, results, selectedIndex: 0 });
    },

    selectPrevious: () => {
        set((state) => ({
            selectedIndex:
                state.selectedIndex > 0 ? state.selectedIndex - 1 : state.results.length - 1,
        }));
    },

    selectNext: () => {
        set((state) => ({
            selectedIndex:
                state.selectedIndex < state.results.length - 1 ? state.selectedIndex + 1 : 0,
        }));
    },

    setSelectedIndex: (index) => {
        set({ selectedIndex: index });
    },

    openItem: async (item) => {
        const { linkOpen } = useSettingsStore.getState().settings;
        const openInNewTab = linkOpen === 'new-tab';

        if (item.action) {
            await item.action(openInNewTab);
        } else {
            const target = openInNewTab ? '_blank' : '_self';
            window.open(item.url, target);
        }
        get().deactivate();
    },

    openSelected: async () => {
        const { results, selectedIndex } = get();
        const item = results[selectedIndex];
        if (item) {
            await get().openItem(item);
        }
    },
}));
