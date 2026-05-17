export interface BookmarkItem {
    id: string;
    title: string;
    url: string;
    parentId?: string;
    action?: (openInNewTab?: boolean) => Promise<void> | void;
}

export interface FolderItem {
    id: string;
    title: string;
    children: BookmarkItem[];
}

export type FolderColumnsType = FolderItem[][];

export interface FolderStateType {
    [folderId: string]: {
        isExpanded?: boolean;
        columnIndex?: number;
        indexInColumn?: number;
        emoji?: string;
    };
}

export interface DragItem {
    folderId: string;
    sourceCol: number;
    sourceIndex: number;
}
