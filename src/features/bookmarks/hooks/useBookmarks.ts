import { useCallback } from 'react';

import { useBookmarksStore } from '../store';
import type { FolderItem } from '../types';

export function useBookmarks() {
    const folderColumns = useBookmarksStore((s) => s.folderColumns);
    const folderState = useBookmarksStore((s) => s.folderState);
    const error = useBookmarksStore((s) => s.error);
    const toggleFolderExpanded = useBookmarksStore((s) => s.toggleFolderExpanded);
    const handleEmojiChange = useBookmarksStore((s) => s.setFolderEmoji);
    const handleFolderDrop = useBookmarksStore((s) => s.dropFolder);

    const handleFolderClick = useCallback(
        (folder: Pick<FolderItem, 'id'>) => toggleFolderExpanded(folder.id),
        [toggleFolderExpanded],
    );

    return {
        folderColumns,
        folderState,
        error,
        handleFolderClick,
        handleEmojiChange,
        handleFolderDrop,
    } as const;
}
