import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';

import { useSettingsStore } from '@/features/settings/store';

import type { DragItem } from '../types';

interface DropZoneInFolderProps {
    columnIndex: number;
    folderIndex: number;
    onFolderDrop: (dragItem: DragItem, targetCol: number, targetIndex: number) => void;
}

export const DropZoneInFolder: React.FC<DropZoneInFolderProps> = ({
    columnIndex,
    folderIndex,
    onFolderDrop,
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
                onFolderDrop(item, columnIndex, folderIndex);
            },
            canDrop: (item: DragItem) => {
                if (!isDragEnabled) {
                    return false;
                }
                if (
                    item.sourceCol === columnIndex &&
                    (item.sourceIndex === folderIndex || item.sourceIndex === folderIndex - 1)
                ) {
                    return false;
                }
                return true;
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            }),
        }),
        [columnIndex, folderIndex, onFolderDrop, isDragEnabled],
    );
    drop(dropRef);

    const showDropIndicator = isOver && canDrop;

    return (
        <div
            ref={dropRef}
            className="flex h-6 items-center transition-colors duration-default"
        >
            {showDropIndicator && <div className="h-1 w-full bg-newtab-primary" />}
        </div>
    );
};

export default DropZoneInFolder;
