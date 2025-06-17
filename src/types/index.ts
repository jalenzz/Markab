// 基础书签类型
export interface BookmarkItem {
    id: string;
    title: string;
    url: string;
    parentId?: string;
}

// 文件夹类型 - 扁平化展示
export interface FolderItem {
    id: string;
    title: string;
    children: BookmarkItem[];
}

// 布局相关类型
export type FolderColumnsType = FolderItem[][]; // 二维数组，用于列布局

// 文件夹状态
export interface FolderStateType {
    [folderId: string]: {
        isExpanded?: boolean; // 展开状态，默认 false
        columnIndex?: number; // 所在列的索引
        indexInColumn?: number; // 在列中的位置索引
        emoji?: string; // 自定义的 emoji 图标，默认为 '⭐'
    };
}

// 拖拽相关类型
export interface DragItem {
    folderId: string;
    sourceCol: number;
    sourceIndex: number;
}
