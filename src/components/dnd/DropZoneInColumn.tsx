import React from 'react';
import { useDrop } from 'react-dnd';

import { type DragItem } from '../../types';

interface DropZoneInColumnProps {
    insertIndex: number;
    onFolderDrop: (dragItem: DragItem, targetCol: number, targetIndex: number) => void;
    isEdge?: boolean;
    edgeType?: 'left' | 'right';
}

export const DropZoneInColumn: React.FC<DropZoneInColumnProps> = ({
    insertIndex,
    onFolderDrop,
    isEdge = false,
    edgeType,
}) => {
    const [{ isOver, canDrop }, drop] = useDrop(
        {
            accept: 'item',
            drop: (item: DragItem) => {
                // 使用特殊的 targetCol 值 -1 表示创建新列
                onFolderDrop(item, -1, insertIndex);
            },
            canDrop: () => {
                return true;
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            }),
        },
        [insertIndex, onFolderDrop, isEdge, edgeType],
    );

    const showDropIndicator = isOver && canDrop;

    return (
        <div
            ref={drop as never}
            className={`flex h-full min-h-96 w-8 items-center justify-center transition-colors duration-200 ${isEdge ? 'w-16' : ''}`}
        >
            {showDropIndicator && (
                <div className="h-32 w-1 bg-newtab-theme-light dark:bg-newtab-theme-dark" />
            )}
        </div>
    );
};
