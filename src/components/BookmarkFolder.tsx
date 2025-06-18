import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { useDrag } from 'react-dnd';

import { ANIMATION_CONFIG, COLOR_CONFIG } from '../config';
import type { FolderItem, FolderStateType } from '../types';
import { BookmarkItem } from './';
import { Emoji } from './Emoji';

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
    const folderStateData = folderState[folder.id] || {};
    const isExpanded = folderStateData.isExpanded || false;
    const currentEmoji = folderStateData.emoji || '⭐';

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: 'item',
            item: {
                folderId: folder.id,
                sourceCol: columnIndex,
                sourceIndex: folderIndex,
            },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [folder.id, columnIndex, folderIndex],
    );

    // FolderItem.children 已经只包含 BookmarkItem，不需要过滤
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
            className={`group min-w-0 flex-1 ${isDragging ? 'opacity-50' : ''}`}
        >
            <div>
                <motion.div
                    className="flex cursor-pointer items-center space-x-4 rounded-lg px-1 py-2"
                    onClick={handleFolderClick}
                    whileHover={{
                        backgroundColor: COLOR_CONFIG.hoverBackground,
                    }}
                    transition={ANIMATION_CONFIG.transitions.ease}
                >
                    <Emoji value={currentEmoji} onChange={handleEmojiChange} />

                    <div className="flex flex-1 items-center justify-between">
                        <h3 className="truncate text-xl font-semibold">{folder.title}</h3>

                        <motion.div
                            animate={{
                                rotate: isExpanded ? 90 : 0,
                            }}
                            transition={ANIMATION_CONFIG.transitions.ease}
                        >
                            <svg
                                className="h-4 w-4 text-newtab-text-muted-light opacity-60 dark:text-newtab-text-muted-dark"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial={false}
                    animate={{
                        height: isExpanded ? 'auto' : 0,
                        opacity: isExpanded ? 1 : 0,
                    }}
                    transition={ANIMATION_CONFIG.transitions.ease}
                    className="overflow-hidden"
                >
                    <div className="pb-1 pl-6 pr-1 pt-1">
                        <AnimatePresence>
                            {isExpanded && (
                                <>
                                    <div className="space-y-0.5">
                                        {folderBookmarks.map((bookmark, index) => (
                                            <BookmarkItem
                                                key={bookmark.id}
                                                bookmark={bookmark}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BookmarkFolder;
