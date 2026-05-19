import { motion } from 'motion/react';
import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';

import { useSettingsStore } from '@/features/settings/store';
import { ANIMATION_CONFIG } from '@/shared/animations';

import { useBookmarksStore } from '../store';
import type { DragItem, FolderItem } from '../types';
import { BookmarkList } from './BookmarkList';
import { FolderHeader } from './FolderHeader';

interface BookmarkFolderProps {
    folder: FolderItem;
    onFolderClick: (folder: FolderItem) => void;
    onEmojiChange: (folderId: string, emoji: string) => void;
    columnIndex: number;
    folderIndex: number;
}

const BookmarkFolderComponent: React.FC<BookmarkFolderProps> = ({
    folder,
    onFolderClick,
    onEmojiChange,
    columnIndex,
    folderIndex,
}) => {
    const folderStateData = useBookmarksStore((s) => s.folderState[folder.id]) ?? {};
    const isExpanded = folderStateData.isExpanded ?? false;
    const currentEmoji = folderStateData.emoji ?? '⭐';

    const isDragEnabled = useSettingsStore((s) => !s.settings.lockLayout);

    const dragRef = useRef<HTMLDivElement>(null);
    const [{ isDragging }, drag] = useDrag<DragItem | null, unknown, { isDragging: boolean }>(
        () => ({
            type: 'item',
            item: isDragEnabled
                ? {
                      folderId: folder.id,
                      sourceCol: columnIndex,
                      sourceIndex: folderIndex,
                  }
                : null,
            canDrag: isDragEnabled,
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [folder.id, columnIndex, folderIndex, isDragEnabled],
    );
    drag(dragRef);

    const folderBookmarks = folder.children || [];

    const handleFolderClick = () => {
        onFolderClick(folder);
    };

    const handleEmojiChange = (emoji: string) => {
        onEmojiChange(folder.id, emoji);
    };

    return (
        <div
            ref={dragRef}
            className={`group min-w-0 flex-1 ${isDragging ? 'opacity-50' : ''}`}
        >
            <div>
                <FolderHeader
                    title={folder.title}
                    emoji={currentEmoji}
                    isExpanded={isExpanded}
                    onTitleClick={handleFolderClick}
                    onEmojiChange={handleEmojiChange}
                />

                <motion.div
                    initial={false}
                    animate={{
                        height: isExpanded ? 'auto' : 0,
                        opacity: isExpanded ? 1 : 0,
                    }}
                    transition={ANIMATION_CONFIG.transitions.ease}
                    className="overflow-hidden"
                >
                    <BookmarkList bookmarks={folderBookmarks} isExpanded={isExpanded} />
                </motion.div>
            </div>
        </div>
    );
};

export const BookmarkFolder = React.memo(BookmarkFolderComponent);

export default BookmarkFolder;
