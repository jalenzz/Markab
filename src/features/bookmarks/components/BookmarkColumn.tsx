import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { ANIMATION_CONFIG } from '@/shared/animations';

import type { DragItem, FolderItem } from '../types';
import { BookmarkFolder } from './BookmarkFolder';
import { DropZoneInFolder } from './DropZoneInFolder';

interface BookmarkColumnProps {
    folders: FolderItem[];
    onFolderClick: (folder: FolderItem) => void;
    onEmojiChange: (folderId: string, emoji: string) => void;
    columnIndex?: number;
    onFolderDrop?: (dragItem: DragItem, targetCol: number, targetIndex: number) => void;
}

const BookmarkColumnComponent: React.FC<BookmarkColumnProps> = ({
    folders,
    onFolderClick,
    onEmojiChange,
    columnIndex = 0,
    onFolderDrop,
}) => {
    return (
        <div className="flex flex-col" data-column-index={columnIndex}>
            {/* 列顶部的放置区域 */}
            {onFolderDrop && (
                <DropZoneInFolder
                    columnIndex={columnIndex}
                    folderIndex={0}
                    onFolderDrop={onFolderDrop}
                />
            )}

            <AnimatePresence mode="popLayout">
                {folders.map((folder, folderIndex) => (
                    <motion.div
                        key={folder.id}
                        layoutId={`folder-${folder.id}`}
                        layout
                        {...ANIMATION_CONFIG.presets.slideInUp}
                        transition={ANIMATION_CONFIG.transitions.ease}
                    >
                        <BookmarkFolder
                            folder={folder}
                            onFolderClick={onFolderClick}
                            onEmojiChange={onEmojiChange}
                            columnIndex={columnIndex}
                            folderIndex={folderIndex}
                        />

                        {onFolderDrop && (
                            <DropZoneInFolder
                                columnIndex={columnIndex}
                                folderIndex={folderIndex + 1}
                                onFolderDrop={onFolderDrop}
                            />
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

function arePropsEqual(prev: BookmarkColumnProps, next: BookmarkColumnProps): boolean {
    if (
        prev.onFolderClick !== next.onFolderClick ||
        prev.onEmojiChange !== next.onEmojiChange ||
        prev.onFolderDrop !== next.onFolderDrop ||
        prev.columnIndex !== next.columnIndex
    ) {
        return false;
    }
    if (prev.folders !== next.folders) {
        if (prev.folders.length !== next.folders.length) return false;
        for (let i = 0; i < prev.folders.length; i++) {
            if (prev.folders[i] !== next.folders[i]) return false;
        }
    }
    return true;
}

export const BookmarkColumn = React.memo(BookmarkColumnComponent, arePropsEqual);

export default BookmarkColumn;
