import React from 'react';
import { useDrop } from 'react-dnd';

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
    const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
            accept: 'item',
            drop: (item: DragItem) => {
                onFolderDrop(item, columnIndex, folderIndex);
            },
            canDrop: (item: DragItem) => {
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
        [columnIndex, folderIndex, onFolderDrop],
    );

    const showDropIndicator = isOver && canDrop;

    return (
        <div ref={drop as never} className="flex h-6 items-center transition-colors duration-200">
            {showDropIndicator && <div className="h-1 w-full bg-newtab-bg-drop-indicator" />}
        </div>
    );
};

export default DropZoneInFolder;
