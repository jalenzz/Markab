import React, { useState } from 'react';

import { useBookmarks } from '../../../hooks';
import { DropZoneInColumn } from '../../dnd';
import { SettingsButton, SettingsPanel } from '../../settings';
import { BookmarkColumn } from './BookmarkColumn';

export const BookmarkDashboard: React.FC = () => {
    const { folderColumns, folderState, handleFolderClick, handleEmojiChange, handleFolderDrop } =
        useBookmarks();

    // 设置面板状态
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleSettingsToggle = (isOpen: boolean) => {
        setIsSettingsOpen(isOpen);
    };

    const handleSettingsClose = () => {
        setIsSettingsOpen(false);
    };

    return (
        <div className="w-full">
            {/* 设置按钮 */}
            <SettingsButton onToggle={handleSettingsToggle} isOpen={isSettingsOpen} />

            {/* 设置面板 */}
            <SettingsPanel isOpen={isSettingsOpen} onClose={handleSettingsClose} />

            <main className="w-full py-12">
                <div className="flex w-full flex-row items-start justify-evenly">
                    {/* 左边缘拖拽区域 */}
                    <DropZoneInColumn
                        key="left-edge"
                        insertIndex={0}
                        onFolderDrop={handleFolderDrop}
                        isEdge={true}
                        edgeType="left"
                    />

                    {folderColumns.map((columnFolders, columnIndex) => {
                        const stableKey =
                            columnFolders.length > 0
                                ? `column-${columnFolders[0].id}`
                                : `empty-column-${columnIndex}`;

                        return (
                            <React.Fragment key={stableKey}>
                                <div className="w-64 min-w-0 flex-shrink-0">
                                    <BookmarkColumn
                                        folders={columnFolders}
                                        folderState={folderState}
                                        onFolderClick={handleFolderClick}
                                        onEmojiChange={handleEmojiChange}
                                        columnIndex={columnIndex}
                                        onFolderDrop={handleFolderDrop}
                                    />
                                </div>

                                <DropZoneInColumn
                                    key={`between-${columnIndex}-${columnIndex + 1}`}
                                    insertIndex={columnIndex + 1}
                                    onFolderDrop={handleFolderDrop}
                                    isEdge={columnIndex === folderColumns.length - 1}
                                    edgeType={
                                        columnIndex === folderColumns.length - 1
                                            ? 'right'
                                            : undefined
                                    }
                                />
                            </React.Fragment>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default BookmarkDashboard;
