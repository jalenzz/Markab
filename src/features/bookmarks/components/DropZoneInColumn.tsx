import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';

import { useSettingsStore } from '@/features/settings/store';

import { type DragItem } from '../types';

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
    const isDragEnabled = useSettingsStore((s) => !s.settings.lockLayout);

    const dropRef = useRef<HTMLDivElement>(null);
    const [{ isOver, canDrop }, drop] = useDrop<
        DragItem,
        unknown,
        { isOver: boolean; canDrop: boolean }
    >(
        () => ({
            accept: 'item',
            drop: (item: DragItem) => {
                // 使用特殊的 targetCol 值 -1 表示创建新列
                onFolderDrop(item, -1, insertIndex);
            },
            canDrop: () => {
                return isDragEnabled;
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            }),
        }),
        [insertIndex, onFolderDrop, isEdge, edgeType, isDragEnabled],
    );
    drop(dropRef);

    const showDropIndicator = isOver && canDrop;

    return (
        <div
            ref={dropRef}
            className={`flex h-full min-h-96 w-8 items-center justify-center transition-colors duration-default ${isEdge ? 'w-16' : ''}`}
        >
            {showDropIndicator && <div className="h-32 w-1 bg-newtab-primary" />}
        </div>
    );
};
