import { useBookmarksStore } from '../features/bookmarks/store';

export function useBookmarks() {
    const folderColumns = useBookmarksStore((s) => s.folderColumns);
    const folderState = useBookmarksStore((s) => s.folderState);
    const error = useBookmarksStore((s) => s.error);
    const handleFolderClick = useBookmarksStore((s) => s.toggleFolderExpanded);
    const handleEmojiChange = useBookmarksStore((s) => s.setFolderEmoji);
    const handleFolderDrop = useBookmarksStore((s) => s.dropFolder);

    return {
        folderColumns,
        folderState,
        error,
        handleFolderClick: (folder: { id: string }) => handleFolderClick(folder.id),
        handleEmojiChange,
        handleFolderDrop,
    } as const;
}
