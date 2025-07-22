import { motion } from 'motion/react';
import React from 'react';
import { useDrag } from 'react-dnd';

import { ANIMATION_CONFIG } from '../../../config';
import { useSettings } from '../../../hooks';
import type { FolderItem, FolderStateType } from '../../../types';
import { BookmarkList } from '../layout';
import { FolderHeader } from './FolderHeader';

interface BookmarkFolderProps {
    folder: FolderItem;
    folderState: FolderStateType;
    onFolderClick: (folder: FolderItem) => void;
    onEmojiChange: (folderId: string, emoji: string) => void;
    columnIndex: number;
    folderIndex: number;
}

export const BookmarkFolder: React.FC<BookmarkFolderProps> = ({
    folder,
    folderState,
    onFolderClick,
    onEmojiChange,
    columnIndex,
    folderIndex,
}) => {
    const { settings } = useSettings();
    const folderStateData = folderState[folder.id] || {};
    const isExpanded = folderStateData.isExpanded || false;
    const currentEmoji = folderStateData.emoji || '⭐';

    // 根据设置决定是否启用拖拽功能
    const isDragEnabled = !settings.lockLayout;

    const [{ isDragging }, drag] = useDrag(
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

    const folderBookmarks = folder.children || [];

    const handleFolderClick = () => {
        onFolderClick(folder);
    };

    const handleEmojiChange = (emoji: string) => {
        onEmojiChange(folder.id, emoji);
    };

    return (
        <div
            ref={drag as never}
            className={`[data-has-background='true']:bg-white/10 [data-has-background='true']:backdrop-blur-md [data-has-background='true']:border [data-has-background='true']:border-white/20 [data-has-background='true']:dark:bg-black/20 [data-has-background='true']:dark:border-white/10 group min-w-0 flex-1 rounded-default bg-white/5 backdrop-blur-sm ${isDragging ? 'opacity-50' : ''}`}
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

export default BookmarkFolder;
