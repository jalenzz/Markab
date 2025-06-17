import type { FolderColumnsType, FolderItem, FolderStateType } from '../types';

function distributeFoldersIntoColumns(
    folders: FolderItem[],
    numberOfColumns: number = 3,
): FolderColumnsType {
    const columns: FolderItem[][] = Array.from({ length: numberOfColumns }, () => []);

    folders.forEach((folder, index) => {
        const columnIndex = index % numberOfColumns;
        columns[columnIndex].push(folder);
    });

    return columns;
}
function calculateOptimalColumns(folderCount: number): number {
    if (folderCount <= 3) return Math.max(1, folderCount);
    if (folderCount <= 9) return 3;
    if (folderCount <= 16) return 4;
    return Math.min(5, Math.ceil(folderCount / 4));
}

export function smartDistributeFolders(
    folders: FolderItem[],
    maxColumns: number = 4,
): { columns: FolderColumnsType; columnCount: number } {
    const optimalColumns = Math.min(calculateOptimalColumns(folders.length), maxColumns);
    const columns = distributeFoldersIntoColumns(folders, optimalColumns);

    return {
        columns,
        columnCount: optimalColumns,
    };
}

export function isValidPosition(
    columnIndex: number,
    indexInColumn: number,
    maxColumns: number,
): boolean {
    return columnIndex >= 0 && columnIndex < maxColumns && indexInColumn >= 0;
}

export function categorizeFolders(folders: FolderItem[], folderState: FolderStateType) {
    const foldersWithPosition: Array<{
        folder: FolderItem;
        columnIndex: number;
        indexInColumn: number;
    }> = [];
    const foldersWithoutPosition: FolderItem[] = [];

    folders.forEach((folder) => {
        const state = folderState[folder.id];
        if (
            state &&
            typeof state.columnIndex === 'number' &&
            typeof state.indexInColumn === 'number' &&
            isValidPosition(state.columnIndex, state.indexInColumn, 10)
        ) {
            foldersWithPosition.push({
                folder,
                columnIndex: state.columnIndex,
                indexInColumn: state.indexInColumn,
            });
        } else {
            foldersWithoutPosition.push(folder);
        }
    });

    return { foldersWithPosition, foldersWithoutPosition };
}

export function createInitialColumns(
    foldersWithPosition: Array<{
        folder: FolderItem;
        columnIndex: number;
        indexInColumn: number;
    }>,
    defaultColumnCount: number = 3,
): FolderColumnsType {
    // 确定需要的列数
    const maxColumnIndex = foldersWithPosition.reduce(
        (max, item) => Math.max(max, item.columnIndex),
        -1,
    );
    const columnCount = Math.max(defaultColumnCount, maxColumnIndex + 1);
    const columns: FolderColumnsType = Array.from({ length: columnCount }, () => []);

    foldersWithPosition.forEach(({ folder, columnIndex, indexInColumn }) => {
        while (columns.length <= columnIndex) {
            columns.push([]);
        }
        while (columns[columnIndex].length <= indexInColumn) {
            columns[columnIndex].push(null as unknown as FolderItem);
        }
        columns[columnIndex][indexInColumn] = folder;
    });

    return columns.map((column) => column.filter(Boolean)).filter((column) => column.length > 0);
}

// 最短列优先
export function distributeToShortestColumns(
    columns: FolderColumnsType,
    folders: FolderItem[],
): FolderColumnsType {
    const newColumns = columns.map((col) => [...col]);

    folders.forEach((folder) => {
        let shortestColumnIndex = 0;
        let shortestLength = newColumns[0]?.length || 0;

        for (let i = 1; i < newColumns.length; i++) {
            if (newColumns[i].length < shortestLength) {
                shortestLength = newColumns[i].length;
                shortestColumnIndex = i;
            }
        }

        newColumns[shortestColumnIndex].push(folder);
    });

    return newColumns;
}

export function rebuildLayout(
    folders: FolderItem[],
    folderState: FolderStateType,
): FolderColumnsType {
    const { foldersWithPosition, foldersWithoutPosition } = categorizeFolders(folders, folderState);

    // 没有存储数据的情况
    if (foldersWithPosition.length === 0) {
        const { columns } = smartDistributeFolders(folders, 3);
        return columns;
    }

    //恢复有位置的文件夹
    const columnsWithPositioned = createInitialColumns(foldersWithPosition, 3);

    // 没有位置信息的文件夹
    if (foldersWithoutPosition.length > 0) {
        return distributeToShortestColumns(columnsWithPositioned, foldersWithoutPosition);
    }

    return columnsWithPositioned;
}

export function updateFolderPositions(
    columns: FolderColumnsType,
    currentFolderState: FolderStateType,
): FolderStateType {
    const newState = { ...currentFolderState };

    columns.forEach((column, columnIndex) => {
        column.forEach((folder, indexInColumn) => {
            newState[folder.id] = {
                ...newState[folder.id],
                columnIndex,
                indexInColumn,
            };
        });
    });

    return newState;
}
