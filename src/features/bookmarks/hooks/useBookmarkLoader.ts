import { useEffect } from 'react';

import { useSettingsStore } from '@/features/settings/store';

import { useBookmarksStore } from '../store';

export function useBookmarkLoader() {
    const isSettingsLoading = useSettingsStore((s) => s.isLoading);
    const hiddenFolders = useSettingsStore((s) => s.settings.hiddenFolders);
    const topSitesNum = useSettingsStore((s) => s.settings.topSitesNum);
    const recentlyClosedNum = useSettingsStore((s) => s.settings.recentlyClosedNum);
    const loadBookmarks = useBookmarksStore((s) => s.loadBookmarks);

    useEffect(() => {
        if (isSettingsLoading) return;
        void loadBookmarks({
            topSitesNum,
            recentlyClosedNum,
            hiddenFolders,
        });
    }, [isSettingsLoading, hiddenFolders, topSitesNum, recentlyClosedNum, loadBookmarks]);
}
