import React from 'react';

import { useBookmarks } from '../hooks/useBookmarks';
import { useBookmarksStore } from '../store';
import { BookmarkColumn } from './BookmarkColumn';
import { DropZoneInColumn } from './DropZoneInColumn';

export const BookmarkGrid: React.FC = () => {
    const { folderColumns, handleFolderClick, handleEmojiChange, handleFolderDrop } =
        useBookmarks();
    const error = useBookmarksStore((s) => s.error);
    const hasLoaded = useBookmarksStore((s) => s.hasLoaded);

    return (
        <main className="w-full pb-12 pt-4">
            {error && hasLoaded && (
                <div
                    role="alert"
                    className="mx-auto mb-4 max-w-2xl rounded border border-newtab-border px-4 py-2 text-sm text-newtab-text-secondary"
                >
                    Bookmarks failed to load: {error}
                </div>
            )}
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
                                    columnIndex === folderColumns.length - 1 ? 'right' : undefined
                                }
                            />
                        </React.Fragment>
                    );
                })}
            </div>
        </main>
    );
};

export default BookmarkGrid;
