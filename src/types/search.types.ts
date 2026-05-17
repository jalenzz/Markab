import type { BookmarkItem } from './bookmark.types';

export interface SearchableBookmark extends BookmarkItem {
    folderTitle: string;
}

export interface SearchResult {
    type: 'bookmark' | 'web-search';
    id: string;
    title: string;
    url: string;
    folderTitle?: string;
    action?: (openInNewTab?: boolean) => Promise<void> | void;
}

export interface SearchState {
    isActive: boolean;
    query: string;
    selectedIndex: number;
    results: SearchResult[];
}
