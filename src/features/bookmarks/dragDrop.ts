import type { DragItem, FolderColumnsType } from '../../types';

/**
 * 计算拖拽后新的列布局。
 * targetCol === -1 表示在 targetIndex 位置插入一个新列。
 * 若拖拽不产生实际位置变化，返回 null。
 */
export function reorderColumnsByDrop(
    prevColumns: FolderColumnsType,
    dragItem: DragItem,
    targetCol: number,
    targetIndex: number,
): FolderColumnsType | null {
    const draggedFolder = prevColumns[dragItem.sourceCol]?.[dragItem.sourceIndex];
    if (!draggedFolder) {
        console.error('could not find dragged folder', dragItem);
        return null;
    }

    if (targetCol === dragItem.sourceCol) {
        const actualTargetIndex =
            targetIndex > dragItem.sourceIndex ? targetIndex - 1 : targetIndex;
        if (actualTargetIndex === dragItem.sourceIndex) {
            return null;
        }
    }

    const newColumns: FolderColumnsType = prevColumns.map((column, index) => {
        if (targetCol !== -1 && index !== dragItem.sourceCol && index !== targetCol) {
            return column;
        }
        return [...column];
    });

    newColumns[dragItem.sourceCol].splice(dragItem.sourceIndex, 1);

    let adjustedTargetIndex = targetIndex;
    if (targetCol === -1) {
        if (newColumns[dragItem.sourceCol].length === 0) {
            newColumns.splice(dragItem.sourceCol, 1);
            if (adjustedTargetIndex > dragItem.sourceCol) {
                adjustedTargetIndex = adjustedTargetIndex - 1;
            }
        }
        newColumns.splice(adjustedTargetIndex, 0, [draggedFolder]);
    } else {
        const finalTargetIndex =
            dragItem.sourceCol === targetCol && adjustedTargetIndex > dragItem.sourceIndex
                ? adjustedTargetIndex - 1
                : adjustedTargetIndex;
        newColumns[targetCol].splice(finalTargetIndex, 0, draggedFolder);

        if (newColumns[dragItem.sourceCol].length === 0) {
            newColumns.splice(dragItem.sourceCol, 1);
        }
    }

    return newColumns;
}
