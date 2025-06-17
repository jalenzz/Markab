import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { ANIMATION_CONFIG } from '../config';
import type { DragItem, FolderItem, FolderStateType } from '../types';
import { BookmarkFolder } from './BookmarkFolder';
import { DropZoneInFolder } from './DropZoneInFolder';

interface BookmarkColumnProps {
    folders: FolderItem[];
    folderState: FolderStateType;
    onFolderClick: (folder: FolderItem) => void;
    onEmojiChange: (folderId: string, emoji: string) => void;
    columnIndex?: number;
    onFolderDrop?: (dragItem: DragItem, targetCol: number, targetIndex: number) => void;
}

export const BookmarkColumn: React.FC<BookmarkColumnProps> = ({
    folders,
    folderState,
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
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                            layout: ANIMATION_CONFIG.transitions.ease,
                            opacity: ANIMATION_CONFIG.transitions.ease,
                        }}
                    >
                        <BookmarkFolder
                            folder={folder}
                            folderState={folderState}
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

export default BookmarkColumn;
